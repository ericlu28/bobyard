# Bobyard Comments

A comment system (YouTube/Reddit style) with a RESTful backend and a React frontend.

- **Backend:** Java 21, Spring Boot 3, Spring Data JPA, H2 (file-based, embedded)
- **Frontend:** React, TypeScript, Vite

---

## Local development setup

Follow these steps to run the full app on your machine.

### Prerequisites

| Requirement | Version | How to check |
|-------------|---------|--------------|
| **Java JDK** | 21 | `java -version` |
| **Node.js** | 18 or newer | `node -version` |
| **npm** | (included with Node.js) | `npm -version` |

Maven does **not** need to be installed globally. The backend includes a Maven wrapper at `comments/mvnw`.  

### Step 1 — Clone the repository

```bash
git clone git@github.com:ericlu28/bobyard.git
cd bobyard
```

### Step 2 — Start the backend (Terminal 1)

```bash
cd comments
./mvnw spring-boot:run
```

- First run downloads Maven dependencies and may take a minute.
- Wait until the log shows the application has started (look for `Started CommentsApplication`).
- The API is available at **http://localhost:8080**.

### Step 3 — Start the frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

- The UI is available at **http://localhost:5173**.
- **Start the backend first.** The Vite dev server proxies `/api` requests to `http://localhost:8080`

### Step 4 — Confirm everything works

1. Open **http://localhost:5173** in a browser — you should see a list of seeded comments.
2. Try adding, editing, or deleting a comment in the UI.
3. Optionally hit the API directly:

```bash
curl http://localhost:8080/api/comments
```

### Reset to original seed data

To wipe local changes and reload the initial `comments.json` data:

1. Stop the backend (`Ctrl+C` in Terminal 1).
2. Delete the `comments/data/` folder.
3. Start the backend again (`./mvnw spring-boot:run`).

### Run backend tests (optional)

```bash
cd comments
./mvnw test
```

---

## Project layout

```
.
├── comments/          # Spring Boot backend
└── frontend/          # React + TypeScript frontend (Vite)
```

---

## Backend

### Database & H2 console

- Uses **H2** persisted to a file at `comments/data/comments.mv.db`
- On first startup, `comments.json` is automatically loaded into an empty database
  (see `DataSeeder`). Subsequent restarts keep existing data.
- **H2 console** (browse the DB in a browser): http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:file:./data/comments`
  - User: `sa` · Password: _(empty)_

### API

Base path: `/api/comments`

| Method | Path                 | Description                                  | Body                            |
|--------|----------------------|----------------------------------------------|---------------------------------|
| GET    | `/api/comments`      | List all comments                            | —                               |
| POST   | `/api/comments`      | Add a comment (author `Admin`, current time) | `{ "text": "...", "image": "" }`|
| PUT    | `/api/comments/{id}` | Edit the text of an existing comment         | `{ "text": "..." }`             |
| DELETE | `/api/comments/{id}` | Delete a comment                             | —                               |

A `PUT`/`DELETE` against an unknown id returns **404**.

#### Examples

```bash
# List
curl localhost:8080/api/comments

# Add
curl -X POST localhost:8080/api/comments \
  -H "Content-Type: application/json" -d '{"text":"hello from admin","image":""}'

# Edit
curl -X PUT localhost:8080/api/comments/1 \
  -H "Content-Type: application/json" -d '{"text":"edited text"}'

# Delete
curl -X DELETE localhost:8080/api/comments/2
```

---

## Frontend

A React + TypeScript single-page app (Vite) that lists comments and supports
add, inline edit, and delete.

During local development, run `npm run dev` from `frontend/` (see **Local development setup** above). Production build:

```bash
cd frontend
npm run build
npm run preview   # serves the built app locally
```
