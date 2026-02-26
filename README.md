<div align="center">

<h1>BiteSpeed Chatbot Flow Builder</h1>

<p>A visual drag-and-drop chatbot flow builder. Design conversation flows by connecting message nodes — no code required.</p>

<p>
  <a href="https://chat-flow-iota-ivory.vercel.app" target="_blank"><strong>View Live Demo »</strong></a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Flow-11-FF0072?style=flat-square" />
  <img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

</div>

---

## About

Built as part of the **BiteSpeed Frontend Task**. The flow builder lets users visually design chatbot conversation sequences — drag nodes onto a canvas, connect them with edges, edit message text, and save the flow.

The saved JSON is what a chatbot execution engine would read to send real messages to users on WhatsApp / Instagram.

---

## Features

- **Drag & Drop Nodes** — drag a Message node from the panel onto the canvas
- **Connect Nodes** — draw edges to define the conversation order
- **Source Handle Rule** — each source handle allows only **one** outgoing edge
- **Target Handle Rule** — target handles accept **unlimited** incoming edges
- **Settings Panel** — click any node to edit its message text inline
- **Save Validation** — shows `Cannot save Flow` if more than one node has no incoming connection
- **Persistent Storage** — flows are saved to PostgreSQL via a REST API
- **Mobile Responsive** — works on all screen sizes

---

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 18, TypeScript, Vite, React Flow v11, Tailwind CSS |
| Backend  | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Deploy   | Vercel (frontend), Railway (backend) |

---

## Project Structure

```
BiteSpeed/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── nodes/
│   │   │   │   └── TextNode.tsx       # Custom React Flow node
│   │   │   ├── FlowCanvas.tsx         # Main canvas + all flow logic
│   │   │   ├── NodesPanel.tsx         # Draggable node palette (extensible)
│   │   │   └── SettingsPanel.tsx      # Node property editor
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── routes/
    │   │   └── flows.ts               # CRUD REST endpoints
    │   ├── db.ts                      # PostgreSQL pool + table init
    │   └── index.ts                   # Express server entry
    ├── .env.example
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL (local or remote)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/bitespeed-flow-builder.git
cd bitespeed-flow-builder
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/bitespeed_flows
PORT=3001
NODE_ENV=development
```

```bash
npm run dev
# Running on http://localhost:3001
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

> The Vite dev server proxies all `/api` requests to `http://localhost:3001` automatically.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/flows` | Get all saved flows |
| `GET` | `/api/flows/:id` | Get a flow by ID |
| `POST` | `/api/flows` | Save a new flow |
| `PUT` | `/api/flows/:id` | Update an existing flow |
| `DELETE` | `/api/flows/:id` | Delete a flow |
| `GET` | `/health` | Server health check |

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend → Railway / Render

Set these environment variables on your platform:

```
DATABASE_URL=your_postgres_connection_string
NODE_ENV=production
PORT=3001
```

---

## Adding New Node Types

The node system is built to be extensible. To add a new node type:

**1.** Create `frontend/src/components/nodes/YourNode.tsx`

**2.** Register it in `FlowCanvas.tsx`:
```ts
const nodeTypes = {
  textNode: TextNode,
  yourNode: YourNode, // add here
}
```

**3.** Add it to the palette in `NodesPanel.tsx`:
```ts
const AVAILABLE_NODES = [
  { type: 'textNode', label: 'Message', icon: '💬' },
  { type: 'yourNode', label: 'Your Node', icon: '⚡' }, // add here
]
```

---

## License

MIT

---

<div align="center">
  <p>Built for <strong>BiteSpeed Frontend Task</strong></p>
</div>
