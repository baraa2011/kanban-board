# Kanban Board (Vite + React + TS)

Single-page Kanban board with multiple boards, drag-and-drop columns/tasks, search/sort, and local persistence.

## Tech Stack

- Vite, React 19, TypeScript
- TailwindCSS
- dnd-kit (DnD)
- LocalStorage persistence
- Vitest + Testing Library (jsdom)

## Setup

```bash
npm install
npm run dev          # start dev server
npm run test         # run Vitest
npm run build        # type-check + build
```

## Features

- Multiple boards with selector, create, delete (persisted to localStorage)
- Columns and tasks with add/edit/delete
- Drag-and-drop tasks within/between columns (dnd-kit)
- Global task search; per-column sort (Name/Newest)
- Responsive horizontal columns with snap/scroll
- Unit tests for reducer + basic App flow

## Known Limitations

- Drag-and-drop is disabled when search or per-column sort is active (to avoid ordering conflicts).

