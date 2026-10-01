# K-Learn Hub

## Korean Class Scheduling and Student Management Platform

**Document status:** Project idea and initial product plan  
**Course:** Advanced Software Engineering  
**Development approach:** Start with a small working MVP, then improve it systematically throughout the semester.

---

## 1. Project Summary

K-Learn Hub is a web platform for independent Korean-language teachers who currently manage classes, schedules, registrations, learning materials, and student information across several disconnected tools.

The platform will eventually provide one coherent environment for teaching operations. However, the first MVP will deliberately solve only one complete problem: allowing a teacher to publish a class and allowing a student to register for it.

### One-sentence description

K-Learn Hub helps independent Korean-language teachers publish classes and manage student registrations in one place.

---

## 2. Problem

Independent Korean-language teachers often combine several general-purpose tools:

- KakaoTalk for communication;
- Google Drive for learning materials;
- Google Calendar for schedules;
- Google Forms for registration;
- Excel or spreadsheets for student lists; and
- Instagram or other social networks for promotion.

This fragmented workflow causes repeated data entry, inconsistent information, difficulty tracking registrations, and unnecessary administrative work. Students also have no single place to check available classes and confirm what they have registered for.

K-Learn Hub aims to reduce this fragmentation by providing a workflow designed specifically for small, independently operated Korean-language classes.

---

## 3. Target Users

### Primary user: Independent Korean-language teacher

The teacher needs to:

- create and publish a class;
- define its date, time, capacity, and description;
- see who registered;
- prevent registrations beyond the class capacity; and
- manage teaching activities without maintaining several disconnected records.

### Secondary user: Korean-language student

The student needs to:

- browse available classes;
- see the schedule and remaining capacity;
- register for a class; and
- see a clear registration result.

### Initial constraints

- The MVP targets one independent teacher or a very small teaching operation.
- The MVP is not a full Learning Management System.
- Payments, video lessons, AI tutoring, marketing automation, and advanced analytics are outside the MVP.

---

## 4. Product Vision

**FOR** independent Korean-language teachers  
**WHO** need to manage class schedules and student registrations across disconnected tools,  
**THE** K-Learn Hub **IS A** class scheduling and student-management web platform  
**THAT** centralizes the essential class-registration workflow in one place.  
**UNLIKE** using separate tools such as KakaoTalk, Google Calendar, Google Forms, and spreadsheets,  
**OUR PRODUCT** provides one coherent workflow designed for independently operated Korean-language classes.

### Product principles

1. **One complete workflow before many incomplete features.**
2. **Simple enough for one teacher to operate.**
3. **Clear enough for a new student to use without instructions.**
4. **Every feature must support the product vision.**
5. **The team must understand, test, and maintain all AI-assisted code.**

---

## 5. MVP Scope

### Core hypothesis

An independent teacher and a student can complete the essential scheduling and registration process more easily when the class information and registration list are maintained in one application.

### Core workflow

1. A teacher creates a class.
2. The teacher provides a title, description, date, time, and maximum capacity.
3. The teacher publishes the class.
4. A student browses the published class schedule.
5. The student selects a class and submits a registration.
6. The system confirms or rejects the registration.
7. The teacher views the class roster.

### MVP features

#### Teacher

- Create a class.
- Edit an unpublished or existing class.
- Publish or unpublish a class.
- View all classes.
- View the registrations for a class.

#### Student

- Browse published classes.
- View class details and remaining capacity.
- Register using a name and email address.
- Receive a clear success or error result.

#### System

- Store classes and registrations persistently.
- Prevent registration when a class is full.
- Prevent duplicate registration with the same email for the same class.
- Validate required input.
- Preserve data after the application restarts.

### Explicitly excluded from the MVP

- Payment processing;
- AI tutor or AI content generation;
- course and lesson authoring;
- attendance and learning progress;
- review and rating features;
- email, KakaoTalk, or push notifications;
- advanced analytics and marketing;
- discounts and promotions;
- multi-teacher organizations;
- file uploads and video hosting; and
- complex role-based authorization.

These exclusions are intentional safeguards against scope creep.

---

## 6. MVP User Stories and Acceptance Criteria

### US-01: Create a class

**As a teacher, I want to create a class so that students can see when it is available.**

Acceptance criteria:

- The teacher can enter a title, description, date, start time, and maximum capacity.
- Required fields cannot be empty.
- Capacity must be a positive integer.
- A valid class is stored in the database.
- A success message is displayed after creation.

### US-02: Publish a class

**As a teacher, I want to publish a class so that students can register for it.**

Acceptance criteria:

- The teacher can change a class from draft to published.
- Only published classes appear in the student schedule.
- An unpublished class cannot accept new registrations.

### US-03: Browse available classes

**As a student, I want to browse published classes so that I can choose a suitable class.**

Acceptance criteria:

- The schedule displays only published classes.
- Each item shows its title, date, time, capacity, and remaining seats.
- The student can open a class-detail view.
- A clear empty state is shown when no classes are available.

### US-04: Register for a class

**As a student, I want to register for a class so that the teacher can reserve my place.**

Acceptance criteria:

- The student provides a name and valid email address.
- A valid registration is stored in the database.
- A student cannot register twice for the same class using the same email address.
- Registration is rejected when the class is full or unpublished.
- The interface clearly displays success and failure messages.

### US-05: View the class roster

**As a teacher, I want to view registered students so that I can prepare for the class.**

Acceptance criteria:

- The teacher can open a class and see its registrations.
- The roster shows each student's name and email address.
- The displayed registration count matches the stored registrations.
- An empty state is shown when no students have registered.

---

## 7. Definition of Done for the MVP

The MVP is complete only when:

- the core workflow works from beginning to end;
- data is stored persistently;
- another student can clone and run the project using the README;
- all major MVP features have acceptance criteria;
- automated tests cover the most important business rules;
- the frontend and backend build successfully;
- no secrets are committed to Git;
- the MVP is deployed to an accessible test environment;
- the repository contains meaningful commits and Pull Requests; and
- AI-assisted work is recorded in `AI_LOG.md`.

---

## 8. Product Roadmap

### Stage 1 — MVP: Class registration workflow

**Goal:** Prove that a teacher can publish a class and manage registrations in one system.

Key features:

- Class creation and publication;
- public class schedule;
- student registration;
- capacity and duplicate-registration rules; and
- teacher roster view.

Success criteria:

- The complete workflow can be demonstrated without manually editing the database.
- A second person can clone and run the application.
- The main acceptance tests pass.

### Stage 2 — Alpha: Teacher and student workspaces

**Goal:** Make the application usable repeatedly by known users.

Candidate features:

- Basic authentication;
- teacher dashboard;
- student dashboard and “My Classes”;
- registration cancellation;
- class editing and cancellation; and
- basic attendance.

Success criteria:

- Users can access the correct workspace.
- Existing registrations remain consistent after class updates.
- Core flows have automated integration tests.

### Stage 3 — Beta: Course and learning management

**Goal:** Allow real users to test a broader teaching workflow.

Candidate features:

- Course management;
- lesson management;
- learning materials;
- attendance history;
- learning progress;
- usability improvements;
- security audit; and
- structured user feedback.

Success criteria:

- A small group of teachers and students can test the system.
- Major usability and security problems are documented and addressed.
- Monitoring and error handling are sufficient for beta use.

### Stage 4 — Final semester release

**Goal:** Demonstrate a reliable and well-engineered product evolution.

Candidate outcomes:

- Stable deployment;
- CI pipeline;
- documented architecture decisions;
- reliable test suite;
- API documentation;
- refined UI;
- privacy and security controls; and
- before/after engineering report and live code walkthrough.

Success criteria:

- The team can explain the architecture and every critical workflow.
- Automated checks pass consistently.
- The repository clearly demonstrates the evolution from MVP to engineered product.

### Post-semester possibilities

- Reviews and ratings;
- notifications;
- promotion and discount tools;
- teacher analytics;
- payments;
- AI lesson generation;
- AI Korean tutor;
- pronunciation evaluation; and
- Korean writing feedback.

These features are ideas, not commitments.

---

## 9. Initial Product Backlog

| Priority | Backlog item | Expected result |
|---|---|---|
| HIGH | Create the repository structure | Frontend, backend, documentation, and test locations are clear |
| HIGH | Define database schema and migrations | Classes and registrations can be stored persistently |
| HIGH | Implement class-management API | Classes can be created, updated, listed, and published |
| HIGH | Implement registration API | Valid registrations are stored and invalid ones are rejected |
| HIGH | Build teacher class form | A teacher can create and publish a class through the UI |
| HIGH | Build public schedule | Students can browse published classes |
| HIGH | Build registration form | Students can complete the core registration workflow |
| HIGH | Build class-roster view | A teacher can see registered students |
| HIGH | Add core automated tests | Capacity, duplicate, validation, and publication rules are verified |
| HIGH | Deploy the MVP | The working application can be demonstrated online |
| MEDIUM | Add consistent error handling | Users receive understandable error messages |
| MEDIUM | Improve responsive layout | Core screens work on desktop and mobile widths |
| MEDIUM | Add seed data | Reviewers can quickly explore the application |
| MEDIUM | Document API and architecture | Developers can understand the system structure |
| LOW | Add search or filtering | Users can locate a class more easily |
| LOW | Add registration export | A teacher can download a roster |

Each backlog item should become a GitHub Issue with scope, acceptance criteria, dependencies, and verification instructions.

---

## 10. Proposed Technical Approach

### Initial stack

- **Frontend:** Next.js with TypeScript
- **Backend:** FastAPI with Python
- **Database:** PostgreSQL
- **ORM and migrations:** SQLAlchemy and Alembic
- **API style:** REST with JSON
- **Frontend deployment:** Vercel
- **Backend hosting:** A managed Python-compatible service
- **Version control:** Git and GitHub
- **CI:** GitHub Actions

### Stack decision rule

The proposed stack should be used only if the team can read, debug, test, and deploy it. If the stack slows down the one-week MVP, the team should simplify it rather than preserve unnecessary complexity.

### Initial system boundary

```text
Student/Teacher Browser
        |
        v
Next.js Web Application
        |
        v
FastAPI REST API
        |
        v
PostgreSQL Database
```

The MVP will be a modular monolith. Microservices, message queues, Kubernetes, multiple databases, and distributed infrastructure are unnecessary for the initial scope.

### Initial domain entities

#### Class

- `id`
- `title`
- `description`
- `class_date`
- `start_time`
- `capacity`
- `status` (`draft`, `published`, or `cancelled`)
- `created_at`
- `updated_at`

#### Registration

- `id`
- `class_id`
- `student_name`
- `student_email`
- `created_at`

Important rules:

- A registration belongs to one class.
- The pair `(class_id, student_email)` must be unique.
- Registration count cannot exceed class capacity.
- Only published classes accept registrations.

### Candidate MVP API

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/classes` | Create a class |
| `GET` | `/classes` | List classes using appropriate visibility rules |
| `GET` | `/classes/{id}` | View class details |
| `PATCH` | `/classes/{id}` | Edit or publish a class |
| `POST` | `/classes/{id}/registrations` | Register a student |
| `GET` | `/classes/{id}/registrations` | View a class roster |

The exact API may change after implementation planning and architecture review.

---

## 11. Quality, Security, and Privacy Baseline

### Quality

- Validate input on both client and server where appropriate.
- Keep business rules in testable backend services.
- Use small commits and feature branches.
- Run tests, linting, and builds before merging.
- Provide clear loading, success, error, and empty states.

### Security

- Never commit API keys, passwords, database credentials, tokens, or `.env` files.
- Provide a safe `.env.example` containing variable names but no secrets.
- Treat any secret pushed to GitHub as compromised and rotate it.
- Use parameterized ORM queries and validated request models.
- Avoid exposing the teacher roster through public student endpoints.
- Add authentication before real personal information is used outside a controlled demonstration.

### Privacy

The MVP stores student names and email addresses, which are personal data. During development:

- Prefer fictional seed data.
- Collect only the information required for registration.
- Do not display the roster publicly.
- Define deletion and retention behavior before real-world use.
- Document that the MVP is an educational prototype, not yet a production service.

---

## 12. Git and GitHub Workflow

### Branching

- `main`: stable, reviewed code
- `feature/<short-description>`: new functionality
- `fix/<short-description>`: bug fixes
- `docs/<short-description>`: documentation changes
- `test/<short-description>`: test-focused work

Examples:

- `feature/create-class`
- `feature/student-registration`
- `fix/registration-capacity`
- `docs/mvp-readme`

### Feature workflow

1. Create or select a GitHub Issue.
2. Pull the latest `main`.
3. Create a focused branch.
4. Implement one scoped change.
5. Run tests, linting, and build checks.
6. Commit with a meaningful message.
7. Push the branch.
8. Open a Pull Request linked to the Issue.
9. Review the code and verification evidence.
10. Merge only after the acceptance criteria are satisfied.

One team uses one shared repository as the single source of truth.

---

## 13. AI-Assisted Development Policy

AI is a development tool, not a substitute for developer understanding or responsibility.

### Prompt structure

Every significant request should communicate:

- **GOAL:** What should change?
- **CONTEXT:** What currently exists?
- **CONSTRAINTS:** What must not change?
- **ACCEPTANCE CRITERIA:** How will completion be judged?
- **VERIFICATION:** Which tests or commands must be run?

### Workflow for significant changes

1. Ask the AI to inspect the relevant code without modifying it.
2. Ask for an implementation plan.
3. Review and correct the plan.
4. Implement one small step.
5. Run the appropriate verification.
6. Review the diff and understand the code.
7. Commit the verified change.

### `AI_LOG.md`

For each meaningful AI-assisted milestone, record:

- date and milestone;
- tool or model used;
- what was requested;
- what was accepted;
- what was changed or rejected;
- what the AI got wrong;
- how the result was verified; and
- related Issue, branch, commit, or Pull Request.

The purpose is to demonstrate that the team understood and evaluated AI output.

---

## 14. Required Repository Documentation

The project repository should progressively contain:

- `README.md` — product vision, MVP status, core workflow, limitations, and setup;
- `ROADMAP.md` — MVP, Alpha, Beta, and Final Release;
- `AI_LOG.md` — reflective record of AI-assisted work;
- `AGENTS.md` — durable instructions for coding agents;
- `.env.example` — required environment-variable names without secrets;
- API documentation;
- architecture diagram;
- Architecture Decision Records where meaningful; and
- contribution and testing instructions.

### Suggested `AGENTS.md` topics

- Project architecture;
- repository structure;
- commands for setup, development, tests, linting, and build;
- code conventions;
- database and migration rules;
- API conventions;
- security restrictions;
- definition of done; and
- files or decisions that an agent must not change without approval.

---

## 15. Engineering Story

The project will not pretend that its first version is production-ready. Its academic and engineering value comes from making improvement visible and evidence-based.

Expected evolution:

```text
Simple working MVP
    -> identify problems
    -> clarify requirements
    -> improve architecture
    -> refactor code
    -> add tests and code review
    -> audit security and privacy
    -> improve documentation and CI
    -> collect user feedback
    -> produce a more reliable software product
```

The final presentation should compare the initial and final versions using repository evidence, architecture decisions, tests, deployment history, Pull Requests, and lessons from AI-assisted development.

---

## 16. Project Pitch

### Short pitch

Independent Korean-language teachers often rely on KakaoTalk, Google Calendar, Google Forms, spreadsheets, and cloud storage to manage a single teaching workflow. K-Learn Hub brings the essential class scheduling and registration process into one web platform. Its first MVP allows a teacher to publish a class, a student to register, and the teacher to view the resulting roster. The project will begin with this small working workflow and evolve throughout the semester through architecture, security, testing, DevOps, and documentation improvements.

### 30-second pitch

K-Learn Hub is a class scheduling and student-registration platform for independent Korean-language teachers. Instead of managing schedules in Calendar, registrations in Forms, and student lists in spreadsheets, a teacher can publish a class and manage its roster in one place. The MVP focuses on one complete workflow—create, publish, register, and review—so the team can build it quickly and then demonstrate how software engineering practices transform it into a reliable product.

---

## 17. Immediate Next Steps

1. Confirm that every team member agrees with the reduced MVP scope.
2. Inspect the current repository and record what already works.
3. Update `README.md` with the Product Vision and honest MVP status.
4. Create `ROADMAP.md`, `AI_LOG.md`, and `AGENTS.md`.
5. Convert the HIGH-priority backlog into GitHub Issues.
6. Define the initial database migration and API contracts.
7. Implement the core workflow in small, reviewable increments.
8. Deploy the first demonstrable MVP.

Before accepting any new feature, ask:

> Does this feature directly help the teacher publish a class, the student register, or the teacher manage that registration?

If the answer is no, place it in a later roadmap stage rather than the MVP.
