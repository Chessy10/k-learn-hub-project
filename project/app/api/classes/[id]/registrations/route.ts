import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { classes, registrations } from "@/db/schema";

export const dynamic = "force-dynamic";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await getDb().select().from(registrations)
      .where(eq(registrations.classId, Number(id))).orderBy(asc(registrations.createdAt), asc(registrations.id));
    return Response.json({ registrations: rows });
  } catch (error) {
    console.error("Failed to load roster", error);
    return Response.json({ error: "The class roster is temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const classId = Number(id);
    const body = (await request.json()) as { name?: string; email?: string };
    const studentName = body.name?.trim() ?? "";
    const studentEmail = body.email?.trim().toLowerCase() ?? "";
    if (studentName.length < 2) return Response.json({ error: "Please enter your full name." }, { status: 400 });
    if (!emailPattern.test(studentEmail)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });

    const db = getDb();
    const [selectedClass] = await db.select({
      id: classes.id, title: classes.title, capacity: classes.capacity, status: classes.status,
      registrationCount: sql<number>`count(${registrations.id})`,
    }).from(classes).leftJoin(registrations, eq(registrations.classId, classes.id))
      .where(eq(classes.id, classId)).groupBy(classes.id).limit(1);

    if (!selectedClass) return Response.json({ error: "Class not found." }, { status: 404 });
    if (selectedClass.status !== "published") return Response.json({ error: "This class is not accepting registrations." }, { status: 409 });
    if (Number(selectedClass.registrationCount) >= selectedClass.capacity) return Response.json({ error: "This class is full." }, { status: 409 });

    try {
      const [registration] = await db.insert(registrations).values({ classId, studentName, studentEmail }).returning();
      return Response.json({ registration, classTitle: selectedClass.title }, { status: 201 });
    } catch (error) {
      const message = error instanceof Error
        ? `${error.message} ${error.cause instanceof Error ? error.cause.message : String(error.cause ?? "")}`
        : String(error);
      if (message.toLowerCase().includes("unique")) {
        return Response.json({ error: "This email is already registered for the class." }, { status: 409 });
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to register student", error);
    return Response.json({ error: "Registration could not be completed." }, { status: 500 });
  }
}
