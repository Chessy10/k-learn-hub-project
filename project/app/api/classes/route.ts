import { asc, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { classes, registrations } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const teacherView = new URL(request.url).searchParams.get("view") === "teacher";
    const db = getDb();
    const query = db.select({
      id: classes.id, title: classes.title, description: classes.description,
      level: classes.level, classDate: classes.classDate, startTime: classes.startTime,
      capacity: classes.capacity, status: classes.status,
      registrationCount: sql<number>`count(${registrations.id})`,
    }).from(classes).leftJoin(registrations, eq(registrations.classId, classes.id))
      .groupBy(classes.id).orderBy(asc(classes.classDate), asc(classes.startTime), desc(classes.id));

    const rows = teacherView ? await query : await query.where(eq(classes.status, "published"));
    return Response.json({ classes: rows.map((row) => ({
      ...row,
      registrationCount: Number(row.registrationCount),
      remainingSeats: Math.max(0, row.capacity - Number(row.registrationCount)),
    })) });
  } catch (error) {
    console.error("Failed to list classes", error);
    return Response.json({ error: "Classes are temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = {
      title: String(body.title ?? "").trim(),
      description: String(body.description ?? "").trim(),
      level: String(body.level ?? "All levels").trim() || "All levels",
      classDate: String(body.classDate ?? "").trim(),
      startTime: String(body.startTime ?? "").trim(),
      capacity: Number(body.capacity),
      status: body.status === "published" ? ("published" as const) : ("draft" as const),
    };
    if (!payload.title || !payload.classDate || !payload.startTime) {
      return Response.json({ error: "Title, date, and start time are required." }, { status: 400 });
    }
    if (!Number.isInteger(payload.capacity) || payload.capacity < 1 || payload.capacity > 100) {
      return Response.json({ error: "Capacity must be a whole number between 1 and 100." }, { status: 400 });
    }
    const [created] = await getDb().insert(classes).values(payload).returning();
    return Response.json({ class: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create class", error);
    return Response.json({ error: "The class could not be created." }, { status: 500 });
  }
}
