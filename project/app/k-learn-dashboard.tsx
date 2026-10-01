"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { BookOpenText, CalendarDays, Check, ChevronRight, CircleUserRound, Clock3, GraduationCap, LoaderCircle, Plus, RefreshCw, Sparkles, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

type ClassItem = {
  id: number; title: string; description: string; level: string; classDate: string;
  startTime: string; capacity: number; status: "draft" | "published" | "cancelled";
  registrationCount: number; remainingSeats: number;
};
type Registration = { id: number; studentName: string; studentEmail: string; createdAt: string };
type ModelContextLike = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: Record<string, unknown>;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => Promise<unknown>;
    },
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};
const today = new Date().toISOString().slice(0, 10);

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" })
    .format(new Date(`${value}T12:00:00`));
}
async function readJson(response: Response) {
  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok) throw new Error(String(data.error ?? "Something went wrong."));
  return data;
}

export function KLearnDashboard() {
  const [mode, setMode] = useState<"student" | "teacher">("student");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [registrationClass, setRegistrationClass] = useState<ClassItem | null>(null);
  const [rosterClass, setRosterClass] = useState<ClassItem | null>(null);
  const [roster, setRoster] = useState<Registration[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  const loadClasses = useCallback(async () => {
    setLoading(true); setLoadError("");
    try {
      const response = await fetch(`/api/classes${mode === "teacher" ? "?view=teacher" : ""}`);
      const data = await readJson(response);
      setClasses(data.classes as ClassItem[]);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Classes could not be loaded.");
    } finally { setLoading(false); }
  }, [mode]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadClasses(), 0);
    return () => window.clearTimeout(timer);
  }, [loadClasses]);
  useEffect(() => {
    const modelContext = (document as Document & { modelContext?: ModelContextLike }).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    const report = (error: unknown) => console.warn("WebMCP tool registration failed", error);

    void Promise.resolve(modelContext.registerTool({
      name: "list_published_classes",
      title: "List published Korean classes",
      description: "Return the currently published K-Learn Hub classes and remaining seats.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      async execute() {
        const data = await readJson(await fetch("/api/classes"));
        return { classes: data.classes };
      },
    }, { signal: lifecycle.signal })).catch(report);

    void Promise.resolve(modelContext.registerTool({
      name: "create_class_registration",
      title: "Register for a Korean class",
      description: "Register a student name and email for one published class.",
      inputSchema: {
        type: "object",
        properties: {
          classId: { type: "integer", minimum: 1 },
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
        },
        required: ["classId", "name", "email"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        const value = input as { classId?: number; name?: string; email?: string };
        if (!Number.isInteger(value.classId) || !value.name || !value.email) throw new Error("classId, name, and email are required.");
        const data = await readJson(await fetch(`/api/classes/${value.classId}/registrations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: value.name, email: value.email }),
        }));
        await loadClasses();
        return { status: "confirmed", registration: data.registration, classTitle: data.classTitle };
      },
    }, { signal: lifecycle.signal })).catch(report);

    return () => lifecycle.abort();
  }, [loadClasses]);
  const seats = useMemo(() => classes.reduce((sum, item) => sum + item.remainingSeats, 0), [classes]);

  async function togglePublished(item: ClassItem) {
    try {
      await readJson(await fetch(`/api/classes/${item.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: item.status === "published" ? "draft" : "published" }),
      }));
      toast.success(item.status === "published" ? "Class moved to draft" : "Class published");
      await loadClasses();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Status could not be changed."); }
  }

  async function openRoster(item: ClassItem) {
    setRosterClass(item); setRosterLoading(true);
    try {
      const data = await readJson(await fetch(`/api/classes/${item.id}/registrations`));
      setRoster(data.registrations as Registration[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Roster could not be loaded."); setRoster([]);
    } finally { setRosterLoading(false); }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />
      <header className="border-b border-border bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-[14px] bg-primary text-primary-foreground shadow-sm"><span className="text-lg font-black tracking-[-0.08em]">한</span></div>
            <div><p className="text-[1.1rem] font-extrabold leading-none tracking-[-0.035em]">K-Learn Hub</p><p className="mt-1 text-xs font-medium text-muted-foreground">Classroom, clearly organized.</p></div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><span className="hidden sm:inline">MVP demo</span><span className="size-2 rounded-full bg-emerald-500" aria-label="Online" /></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary"><Sparkles className="size-3.5" /> Korean learning, without admin chaos</div>
            <h1 className="text-balance text-4xl font-black tracking-[-0.055em] sm:text-5xl">{mode === "student" ? "Choose your next Korean class." : "Run your classes from one calm place."}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{mode === "student" ? "See upcoming sessions, check availability, and reserve your place in a few seconds." : "Publish a class, watch registrations come in, and keep every roster in one view."}</p>
          </div>
          <Tabs value={mode} onValueChange={(value) => setMode(value as "student" | "teacher")}>
            <TabsList className="h-12 rounded-2xl bg-muted p-1.5">
              <TabsTrigger value="student" className="h-9 gap-2 rounded-xl px-4"><GraduationCap className="size-4" /> Student</TabsTrigger>
              <TabsTrigger value="teacher" className="h-9 gap-2 rounded-xl px-4"><BookOpenText className="size-4" /> Teacher</TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <section className="mb-8 grid gap-3 sm:grid-cols-3">
          <StatCard icon={<CalendarDays />} label={mode === "student" ? "Upcoming classes" : "All classes"} value={String(classes.length)} />
          <StatCard icon={<UsersRound />} label={mode === "student" ? "Open seats" : "Registrations"} value={String(mode === "student" ? seats : classes.reduce((sum, item) => sum + item.registrationCount, 0))} />
          <StatCard icon={<CircleUserRound />} label="Current view" value={mode === "student" ? "Student" : "Teacher"} />
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div><h2 className="text-xl font-extrabold tracking-tight">{mode === "student" ? "Upcoming classes" : "Class management"}</h2><p className="mt-1 text-sm text-muted-foreground">{mode === "student" ? "Only published classes are visible here." : "Draft, publish, and review your class rosters."}</p></div>
            {mode === "teacher" && <CreateClassDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={loadClasses} />}
          </div>

          {loading ? (
            <div className="grid min-h-64 place-items-center rounded-[28px] border border-border bg-card"><LoaderCircle className="size-7 animate-spin text-primary" aria-label="Loading classes" /></div>
          ) : loadError ? (
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center"><p className="font-bold text-red-900">We couldn’t load the class schedule.</p><p className="mt-2 text-sm text-red-700">{loadError}</p><Button variant="outline" className="mt-5" onClick={() => void loadClasses()}><RefreshCw className="size-4" /> Try again</Button></div>
          ) : classes.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-border bg-card p-10 text-center"><CalendarDays className="mx-auto size-9 text-muted-foreground" /><h3 className="mt-4 font-extrabold">{mode === "student" ? "No published classes yet" : "Create your first class"}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{mode === "student" ? "Please check again soon. New classes will appear here when the teacher publishes them." : "Start with one focused session. You can keep it as a draft until the details are ready."}</p></div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{classes.map((item) => <ClassCard key={item.id} item={item} mode={mode} onRegister={() => setRegistrationClass(item)} onRoster={() => void openRoster(item)} onToggle={() => void togglePublished(item)} />)}</div>
          )}
        </section>
      </div>

      <RegistrationDialog item={registrationClass} onClose={() => setRegistrationClass(null)} onRegistered={async () => { setRegistrationClass(null); await loadClasses(); }} />
      <RosterDialog item={rosterClass} registrations={roster} loading={rosterLoading} onClose={() => setRosterClass(null)} />
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-4 rounded-[20px] border border-border bg-card px-5 py-4 shadow-[0_8px_30px_rgb(24_39_75/4%)]"><span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary [&>svg]:size-5">{icon}</span><div><p className="text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-0.5 text-xl font-black tracking-tight">{value}</p></div></div>;
}

function ClassCard({ item, mode, onRegister, onRoster, onToggle }: { item: ClassItem; mode: "student" | "teacher"; onRegister: () => void; onRoster: () => void; onToggle: () => void }) {
  const full = item.remainingSeats === 0;
  return <article className="group flex min-h-[300px] flex-col rounded-[26px] border border-border bg-card p-6 shadow-[0_16px_50px_rgb(24_39_75/5%)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgb(24_39_75/9%)]">
    <div className="flex items-start justify-between gap-3"><Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-bold">{item.level}</Badge>{mode === "teacher" && <Badge variant={item.status === "published" ? "default" : "outline"} className="rounded-full capitalize">{item.status}</Badge>}</div>
    <h3 className="mt-5 text-xl font-black leading-tight tracking-[-0.03em]">{item.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description || "A focused Korean-language session."}</p>
    <div className="mt-6 space-y-2.5 text-sm"><p className="flex items-center gap-2.5"><CalendarDays className="size-4 text-primary" /><span className="font-semibold">{dateLabel(item.classDate)}</span></p><p className="flex items-center gap-2.5"><Clock3 className="size-4 text-primary" /><span>{item.startTime}</span></p><p className="flex items-center gap-2.5"><UsersRound className="size-4 text-primary" /><span>{item.remainingSeats} of {item.capacity} seats available</span></p></div>
    <div className="mt-auto flex gap-2 pt-6">{mode === "student" ? <Button className="h-11 w-full rounded-xl font-bold" disabled={full} onClick={onRegister}>{full ? "Class full" : "Reserve a seat"}<ChevronRight className="size-4" /></Button> : <><Button variant="outline" className="h-11 flex-1 rounded-xl" onClick={onRoster}>View roster</Button><Button className="h-11 flex-1 rounded-xl" variant={item.status === "published" ? "secondary" : "default"} onClick={onToggle}>{item.status === "published" ? "Move to draft" : "Publish"}</Button></>}</div>
  </article>;
}

function CreateClassDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (open: boolean) => void; onCreated: () => Promise<void> }) {
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setSubmitting(true);
    try { await readJson(await fetch("/api/classes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) })); toast.success("Class created"); onOpenChange(false); await onCreated(); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Class could not be created."); }
    finally { setSubmitting(false); }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogTrigger asChild><Button className="h-11 rounded-xl px-4 font-bold"><Plus className="size-4" /> New class</Button></DialogTrigger><DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-xl"><DialogHeader><DialogTitle>Create a class</DialogTitle><DialogDescription>Add the essential details now. You can publish it immediately or keep it as a draft.</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4">
    <Field label="Class title" htmlFor="title"><Input id="title" name="title" required placeholder="Everyday Korean Conversation" /></Field>
    <Field label="Description" htmlFor="description"><Textarea id="description" name="description" placeholder="What will students practice in this session?" /></Field>
    <Field label="Level" htmlFor="level"><Input id="level" name="level" defaultValue="Beginner" /></Field>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Date" htmlFor="classDate"><Input id="classDate" name="classDate" type="date" min={today} required /></Field><Field label="Start time" htmlFor="startTime"><Input id="startTime" name="startTime" type="time" required /></Field></div>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Maximum students" htmlFor="capacity"><Input id="capacity" name="capacity" type="number" min="1" max="100" defaultValue="8" required /></Field><Field label="Initial status" htmlFor="status"><select id="status" name="status" className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="draft">Draft</option><option value="published">Published</option></select></Field></div>
    <DialogFooter><Button type="submit" disabled={submitting} className="rounded-xl">{submitting && <LoaderCircle className="size-4 animate-spin" />} Create class</Button></DialogFooter>
  </form></DialogContent></Dialog>;
}

function RegistrationDialog({ item, onClose, onRegistered }: { item: ClassItem | null; onClose: () => void; onRegistered: () => Promise<void> }) {
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!item) return; const form = new FormData(event.currentTarget); setSubmitting(true);
    try { await readJson(await fetch(`/api/classes/${item.id}/registrations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) })); toast.success(`Seat reserved for ${item.title}`); await onRegistered(); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Registration failed."); }
    finally { setSubmitting(false); }
  }
  return <Dialog open={Boolean(item)} onOpenChange={(open) => !open && onClose()}><DialogContent className="rounded-3xl sm:max-w-md"><DialogHeader><DialogTitle>Reserve your seat</DialogTitle><DialogDescription>{item ? `${item.title} · ${dateLabel(item.classDate)} at ${item.startTime}` : ""}</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4"><Field label="Full name" htmlFor="studentName"><Input id="studentName" name="name" minLength={2} required placeholder="Minji Kim" autoComplete="name" /></Field><Field label="Email address" htmlFor="studentEmail"><Input id="studentEmail" name="email" type="email" required placeholder="minji@example.com" autoComplete="email" /></Field><p className="text-xs leading-5 text-muted-foreground">We use this information only to manage your class registration in this demo.</p><DialogFooter><Button type="submit" disabled={submitting} className="rounded-xl">{submitting ? <LoaderCircle className="size-4 animate-spin" /> : <Check className="size-4" />} Confirm registration</Button></DialogFooter></form></DialogContent></Dialog>;
}

function RosterDialog({ item, registrations, loading, onClose }: { item: ClassItem | null; registrations: Registration[]; loading: boolean; onClose: () => void }) {
  return <Dialog open={Boolean(item)} onOpenChange={(open) => !open && onClose()}><DialogContent className="rounded-3xl sm:max-w-2xl"><DialogHeader><DialogTitle>{item?.title} roster</DialogTitle><DialogDescription>{item ? `${item.registrationCount} of ${item.capacity} seats filled` : ""}</DialogDescription></DialogHeader>{loading ? <div className="grid min-h-40 place-items-center"><LoaderCircle className="size-6 animate-spin text-primary" /></div> : registrations.length === 0 ? <div className="rounded-2xl bg-muted p-8 text-center"><UsersRound className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 font-bold">No registrations yet</p><p className="mt-1 text-sm text-muted-foreground">Published classes will collect student registrations here.</p></div> : <Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Email</TableHead><TableHead>Registered</TableHead></TableRow></TableHeader><TableBody>{registrations.map((registration) => <TableRow key={registration.id}><TableCell className="font-semibold">{registration.studentName}</TableCell><TableCell>{registration.studentEmail}</TableCell><TableCell className="text-muted-foreground">{new Date(registration.createdAt).toLocaleDateString()}</TableCell></TableRow>)}</TableBody></Table>}</DialogContent></Dialog>;
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={htmlFor}>{label}</Label>{children}</div>;
}
