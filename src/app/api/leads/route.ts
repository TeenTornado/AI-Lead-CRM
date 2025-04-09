import { NextResponse } from "next/server";
import { db } from "@/database/db";
import { leads } from "@/database/schema";
import { eq, and, or, like } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    let query = db.select().from(leads);

    if (status) {
      query = query.where(eq(leads.status, status));
    }

    if (priority) {
      query = query.where(eq(leads.priority, priority));
    }

    if (search) {
      query = query.where(
        or(
          like(leads.name, `%${search}%`),
          like(leads.company, `%${search}%`),
          like(leads.email, `%${search}%`)
        )
      );
    }

    const result = await query;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      company,
      email,
      phone,
      status,
      score,
      value,
      probability,
      tags,
      notes,
    } = body;

    const result = await db
      .insert(leads)
      .values({
        name,
        company,
        email,
        phone,
        status,
        score,
        value,
        probability,
        tags,
        notes,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating lead:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    const result = await db
      .update(leads)
      .set(updates)
      .where(eq(leads.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating lead:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing lead ID", { status: 400 });
    }

    await db.delete(leads).where(eq(leads.id, parseInt(id)));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
