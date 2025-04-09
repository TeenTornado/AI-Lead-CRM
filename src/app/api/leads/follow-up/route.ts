import { NextResponse } from "next/server";
import { db } from "@/database/schema";
import { leads } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/leads/follow-up - Send automatic follow-ups
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
