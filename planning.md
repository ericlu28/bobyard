Insert comments into DB:
- String: `id` (primary key)
- String: `author`
- String: `text`
- String ISO8601: `date`
- int: `likes`
- String: `image`

---

# Frontend Plan (Parts 2 & 3)

## Stack
- **Vite + React + TypeScript** (`npm create vite@latest frontend -- --template react-ts`)
- **Vite dev proxy** for the backend — no CORS config needed
- **Refresh strategy:** Option A — re-fetch the full list after every mutation (simplest, one source of truth)
- **Date:** display the raw ISO8601 string as-is

## Folder layout
```
frontend/
├── index.html
├── package.json
├── vite.config.ts          # dev proxy: /api -> http://localhost:8080
├── tsconfig.json
└── src/
    ├── main.tsx            # React entry
    ├── App.tsx            # owns comments state, fetch + handlers
    ├── types.ts           # Comment & CommentRequest interfaces
    ├── api/
    │   └── comments.ts    # typed fetch wrappers for the 4 endpoints
    ├── components/
    │   ├── CommentList.tsx
    │   ├── CommentItem.tsx
    │   └── CommentForm.tsx
    └── index.css          # clean, minimal styling
```

## Vite dev proxy (vite.config.ts)
Configure `server.proxy` so the browser only ever talks to port 5173:
```ts
server: {
  proxy: { '/api': 'http://localhost:8080' }
}
```
Then all API calls use the relative path `/api/comments`. No backend CORS needed.

## Types (src/types.ts)
```ts
interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;      // raw ISO8601
  likes: number;
  image: string;
}
interface CommentRequest { text: string; image?: string; }
```

## API layer (src/api/comments.ts)
Four typed `fetch` wrappers, all against the relative base `/api/comments`:
- `getComments(): Promise<Comment[]>` — GET
- `addComment(text: string, image?: string): Promise<Comment>` — POST `{ text, image }`
- `editComment(id: number, text: string): Promise<Comment>` — PUT `{ text }`
- `deleteComment(id: number): Promise<void>` — DELETE

## Component responsibilities
- **App.tsx** — single owner of `comments: Comment[]`, plus `loading`/`error`. `useEffect` fetches on mount via `getComments()`. Defines `handleAdd`/`handleEdit`/`handleDelete`; each calls the API then **re-fetches** the list (Option A). Passes data + handlers down.
- **CommentList.tsx** — presentational; receives `comments` + handlers, maps to `CommentItem`s.
- **CommentItem.tsx** — renders author, raw ISO date, likes, text, and image **only when non-empty**. Local `isEditing` state toggles a textarea + Save/Cancel; Delete button.
- **CommentForm.tsx** — controlled `text` input; calls `handleAdd` on submit, clears the field.

## Part 2 (display) vs Part 3 (CRUD)
- **Part 2:** App + api layer + CommentList + CommentItem (read-only render of all fields).
- **Part 3:** add CommentForm (POST), inline edit in CommentItem (PUT), delete button (DELETE) — each followed by a re-fetch.

## Wrap-up after frontend
- README: add `cd frontend && npm install && npm run dev` (runs on http://localhost:5173)
- README: update Project layout + the "React frontend" line
- `.gitignore`: ensure `frontend/node_modules/` is ignored
- "What I'd do next" writeup: concurrency/`@Version` optimistic locking, service layer + `@Transactional`, replies/threading, likes endpoint, real auth, pagination, tests (JUnit + MockMvc, `@DataJpaTest`)

## Verification
1. Backend running on 8080, frontend `npm run dev` on 5173.
2. Page lists all comments with author/date/likes/text/images.
3. Add a comment → appears as "Admin" + current time after re-fetch.
4. Edit a comment's text inline → persists.
5. Delete a comment → removed from list and DB.
6. Confirm changes persist across a backend restart.

---

# Step 9: Styling + Construction Theme

## Visual direction: Bold / branded
- Plain CSS in `App.css`, driven by CSS variables (mini design system).
- Tokens: `--accent: #0F5CFB` (Bobyard blue), `--danger: #e5484d`, `--bg: #f4f6fb`,
  `--card: #fff`, `--text: #16182b`, `--muted: #6b7280`, `--border: #e8eaf0`,
  `--radius: 14px`, soft accent-tinted `--shadow`. Plus construction tokens:
  `--dozer: #f4b400` (yellow), `--dirt: #8a5a2b` (brown).
- Rounded shadowed cards w/ hover lift, large bold heading, color-coded buttons:
  Add/Save = filled accent, Edit/Cancel = neutral outline, Delete = danger red.
- Buttons need classes (`btn btn-primary` / `btn-outline` / `btn-danger`) — small
  JSX touch to CommentItem/CommentForm; everything else is pure CSS.
- Responsive: stack footer + tighten padding under ~480px. `:focus-visible` rings.

## Construction components (the fun layer)

### 1. ConstructionLoader (loading state)
- New component `ConstructionLoader.tsx`; replaces `{loading && <p>Loading…</p>}`.
- A bulldozer (🚜 emoji v1; inline SVG = polished upgrade) drives left→right
  pushing a growing dirt fill, looping (loading is indeterminate).
- Mechanic: `.dozer-fill` animates `width 0%→100%`; `.dozer` animates
  `translateX(0→trackWidth)` with the **same 2s / linear / infinite** timing so it
  rides the fill's leading edge. Dirt = `--dirt`, accents = `--dozer`.
- Optional: 💨 dust puff + slight engine bounce.

### 2. Fallen-cone error state
- Replaces `{error && <p>{error}</p>}`.
- A 🚧 / traffic cone tilted "fallen" (CSS `rotate`) + message
  "Site's down — is the backend running?" Styled in `--danger`/muted.

### 3. Wrecking-ball delete
- In `CommentItem`: add `isDemolishing` local state.
- Click Delete → `setIsDemolishing(true)` → play a wrecking-ball swing (CSS
  keyframes rotating a ball-on-chain across the card) + card shake/crumble (~700ms)
  → on animation end (or timeout) call `onDelete(comment.id)` (App re-fetches).
- Wrecking ball = inline SVG (ball + chain) since no emoji exists; swing via
  `transform-origin` pivot + `rotate` keyframes.
- Respect `prefers-reduced-motion` → skip animation, delete immediately.
- Tradeoff: small delay before the real DELETE fires; if the API failed the
  re-fetch would restore the card. Fine for a demo.
