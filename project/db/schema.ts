import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const classes = sqliteTable("classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  level: text("level").notNull().default("All levels"),
  classDate: text("class_date").notNull(),
  startTime: text("start_time").notNull(),
  capacity: integer("capacity").notNull(),
  status: text("status", { enum: ["draft", "published", "cancelled"] }).notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const registrations = sqliteTable(
  "registrations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    classId: integer("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
    studentName: text("student_name").notNull(),
    studentEmail: text("student_email").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("idx_registrations_class_email").on(table.classId, table.studentEmail)],
);
