import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { classes } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const allowedStatus = ["draft", "published", "cancelled"];
    const updates: Record<string, unknown> = { updatedAt: sql`CURRENT_TIMESTAMP` };
    if (typeof body.title === "string") updates.title = body.title.trim();
    if (typeof body.description === "string") updates.description = body.description.trim();
    if (typeof body.level === "string") updates.level = body.level.trim();
    if (typeof body.classDate === "string") updates.classDate = body.classDate;
    if (typeof body.startTime === "string") updates.startTime = body.startTime;
    if (body.capacity !== undefined) {
      const capacity = Number(body.capacity);
      if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100) {
        return Response.json({ error: "Capacity must be between 1 and 100." }, { status: 400 });
      }
      updates.capacity = capacity;
    }
    if (body.status !== undefined) {
      if (!allowedStatus.includes(String(body.status))) {
        return Response.json({ error: "Invalid class status." }, { status: 400 });
      }
      updates.status = body.status;
    }
    const [updated] = await getDb().update(classes).set(updates).where(eq(classes.id, Number(id))).returning();
    if (!updated) return Response.json({ error: "Class not found." }, { status: 404 });
    return Response.json({ class: updated });
  } catch (error) {
    console.error("Failed to update class", error);
    return Response.json({ error: "The class could not be updated." }, { status: 500 });
  }
}
