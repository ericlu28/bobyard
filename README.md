# Bobyard Comments

A comment system (YouTube/Reddit style) with a RESTful backend and a React frontend.

- **Backend:** Java 21, Spring Boot 3, Spring Data JPA, H2 (file-based, embedded)


## Project layout

```
.
├── comments/          # Spring Boot backend
```

---

## Backend

### Prerequisites
- **Java 21** (JDK)
- **Maven**: optional. A Maven wrapper (`./mvnw`) is included, so a global `mvn` is not required.

### Run locally
```bash
cd comments
mvn clean install # install dependencies
mvn spring-boot:run        # or: ./mvnw spring-boot:run
```
The API runs at **http://localhost:8080**. The first run downloads dependencies and may take a minute.

### Database & seed data
- Uses **H2** persisted to a file at `comments/data/comments.mv.db`
- On first startup, `comments.json` is automatically loaded into an empty database
  (see `DataSeeder`). Subsequent restarts keep existing data.
- To reset to the original seed data: stop the app, delete the `comments/data/` folder, and restart.
- **H2 console** (browse the DB in a browser): http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:file:./data/comments`
  - User: `sa` &nbsp;·&nbsp; Password: _(empty)_

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