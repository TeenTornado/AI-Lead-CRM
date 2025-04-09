import { NextResponse } from "next/server";
import { db } from "@/database/schema";
import { leads, leadUploads } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/leads/upload - Upload and process leads
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const priority = formData.get("priority") as string;

    if (!file) {
      return new NextResponse("File is required", { status: 400 });
    }

    // Create upload record
    const upload = await db
      .insert(leadUploads)
      .values({
        fileName: file.name,
        totalLeads: 0, // Will be updated after processing
        priority: priority || "medium",
      })
      .returning();

    // Process file in background
    processFile(file, upload[0].id, priority);

    return NextResponse.json(upload[0]);
  } catch (error) {
    console.error("Error uploading leads:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function processFile(file: File, uploadId: number, priority: string) {
  try {
    const text = await file.text();
    const rows = text.split("\n").slice(1); // Skip header row
    let processedCount = 0;

    for (const row of rows) {
      const [name, company, email, phone] = row
        .split(",")
        .map((cell) => cell.trim());

      if (name && email) {
        // Calculate qualification score based on available data
        const qualificationScore = calculateQualificationScore({
          name,
          company,
          email,
          phone,
        });

        await db.insert(leads).values({
          name,
          company,
          email,
          phone,
          priority,
          isQualified: qualificationScore >= 70,
          qualificationScore,
          nextFollowUp: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        });

        processedCount++;
        await db
          .update(leadUploads)
          .set({ processedLeads: processedCount })
          .where(eq(leadUploads.id, uploadId));
      }
    }

    // Update upload status
    await db
      .update(leadUploads)
      .set({
        status: "completed",
        totalLeads: processedCount,
        updatedAt: new Date(),
      })
      .where(eq(leadUploads.id, uploadId));
  } catch (error) {
    console.error("Error processing file:", error);
    await db
      .update(leadUploads)
      .set({ status: "failed" })
      .where(eq(leadUploads.id, uploadId));
  }
}

function calculateQualificationScore(data: {
  name: string;
  company: string;
  email: string;
  phone?: string;
}): number {
  let score = 0;

  if (data.name) score += 20;
  if (data.company) score += 20;
  if (data.email) score += 30;
  if (data.phone) score += 30;

  return score;
}

// POST /api/leads/upload/follow-up - Send automatic follow-ups
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { leadId, type, message } = body;

    const lead = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead) {
      return new NextResponse("Lead not found", { status: 404 });
    }

    if (type === "email") {
      await resend.emails.send({
        from: "noreply@yourdomain.com",
        to: lead[0].email,
        subject: "Follow-up from Your Company",
        html: message,
      });
    }

    // Update follow-up history
    await db
      .update(leads)
      .set({
        followUpHistory: [
          ...lead[0].followUpHistory,
          {
            type,
            date: new Date().toISOString(),
            notes: message,
          },
        ],
        lastContact: new Date(),
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      })
      .where(eq(leads.id, leadId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending follow-up:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
