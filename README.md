# PaintFlow 2D — Production-Quality MS Paint–Style 2D Canvas Editor

A complete, responsive, web-based 2D canvas editor built with **React**, **Fabric.js**, **Firebase Firestore**, and **Tailwind CSS**. Inspired by the classic, clean workspace experience of **Windows 11 MS Paint** and **Canva**.

---

## 🎨 Project Overview

PaintFlow 2D provides a lightweight yet powerful in-browser drawing and vector manipulation workspace. Users can start a new drawing with a single click, design with shapes, pencil brush, and text, manipulate objects on canvas, and persist their work directly to Firebase Firestore with seamless URL-based reload and sharing (`/canvas/:canvasId`).

---

## ✨ Features

### 1. Shape & Vector Tools (Drag to Draw)
- **Rectangle / Square**: Click & drag with customizable stroke, fill, and corner radius.
- **Circle / Ellipse**: Drag-to-size circle creation with live dimensions.
- **Triangle**: Polygon triangle generator with interactive bounding box.
- **Line**: Smooth 2-point vector line tool with stroke width control.
- **Polygons & Stars**: Quick presets for Stars, Arrows, and Diamonds.

### 2. Freehand Pencil & Eraser
- **Smooth Pencil Brush**: Powered by Fabric.js freehand drawing with configurable stroke color and thickness.
- **Eraser**: Fast brush eraser tool.
- **Full Participation**: Once drawn, brush strokes become selectable Fabric objects that can be moved, scaled, rotated, colored, or deleted.

### 3. Typography & Text Editing
- **Interactive Textbox**: Click anywhere to spawn an editable text box.
- **Double-click inline text editing**: Edit content directly on the canvas.
- **Rich Text Properties**: Font family dropdown, font size controls, bold, italic, alignment (left/center/right), and text color.

### 4. Interactive Object Transformations
- **Selection & Multi-selection**: Select individual objects or drag-box select multiple objects.
- **Manipulations**: Move, scale, rotate with interactive control handles, flip horizontally/vertically, and layer reordering (Bring to Front, Send to Back).
- **Lock/Unlock**: Prevent accidental movement of finished layers.

### 5. MS Paint Palette & Color System
- **Dual Color System**: **Color 1** (Foreground / Stroke / Pen / Text) and **Color 2** (Background / Shape Fill).
- **2-Row 20-Color Classic Palette**: Instant one-click selection of standard MS Paint colors.
- **Custom Color Wheel Picker**: Support for any HEX / RGB color.

### 6. Persistence & Firebase Firestore
- **URL-based Canvas Loading**: Every canvas has a unique ID (`/canvas/:canvasId`).
- **Save Status UX**: Visual indicators for `✓ Saved`, `● Unsaved changes`, and `Saving...`.
- **Reliable Fallback**: Firestore timeout handling with local storage caching so work is never lost.
- **Graceful 404 Screen**: If a canvas ID is invalid or not found, a friendly "Canvas not found" screen with a "[Go Home]" button is displayed.

### 7. History & Undo/Redo
- **State Tracking**: Automatically tracks object additions, modifications, resizing, deletions, and brush strokes.
- **Undo / Redo Stack**: Works with keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y`) and ribbon buttons.
- **Clear Canvas Dialog**: Safe confirmation modal before wiping the canvas.

### 8. Export & Workspace Controls
- **Export Formats**: Download as **PNG**, **SVG vector**, or **Fabric JSON**.
- **Zoom System**: Live zoom slider and buttons (25% to 400%), plus fit-to-screen (`100%`).
- **Live Coordinates**: Cursor position tracker (`X, Y px`) and object counter on the bottom status bar.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Canvas Engine**: [Fabric.js v7](https://fabricjs.com/)
- **Database & Persistence**: [Firebase Firestore v12](https://firebase.google.com/docs/firestore)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Animations**: [Lucide React](https://lucide.dev/) & [Framer Motion](https://www.framer.com/motion/)

---

## 📁 Architecture

```text
src/
├── components/
│   ├── Canvas/
│   │   ├── CanvasArea.tsx           # Fabric.js canvas drawing engine & drag-to-create logic
│   │   ├── CanvasEditor.tsx         # Main editor page with state coordination
│   │   ├── RibbonToolbar.tsx        # MS Paint Windows 11 style top ribbon toolbar
│   │   ├── ContextualPropertyBar.tsx# Dynamic object styling bar for selected element
│   │   └── StatusBar.tsx            # Bottom status bar (coordinates, size, zoom slider)
│   ├── Home/
│   │   └── HomePage.tsx             # Landing page with "Create New Canvas" CTA
│   └── shared/
│       ├── ConfirmDialog.tsx        # "Clear Canvas" confirmation modal
│       └── Toast.tsx                # Toast notifications
│
├── hooks/
│   ├── useFirestore.ts              # Firestore CRUD operations & local caching
│   ├── useCanvasHistory.ts          # Undo / Redo history management
│   └── useKeyboardShortcuts.ts      # Global keyboard shortcuts listener
│
├── services/
│   └── firebase.ts                  # Firebase app & Firestore initialization
│
├── types/
│   └── canvas.ts                    # TypeScript types and schemas
│
├── utils/
│   ├── canvasHelpers.ts             # Fabric serialization, deserialization, and exports
│   └── constants.ts                 # Canvas size (1200x700), colors, fonts, stroke sizes
│
├── App.tsx                          # App routing config (/ and /canvas/:canvasId)
├── main.tsx                         # React root entry
└── index.css                        # Styling tokens and Tailwind setup
```

---

## 🗄️ Firestore Data Model

The application follows the clean document structure required by the assignment specification:

```text
canvases/
   └── {canvasId}
          ├── name: string           # e.g., "Untitled - Paint"
          ├── data: object           # Serialized Fabric.js JSON ({ version, objects })
          ├── createdAt: timestamp   # Firestore Server Timestamp
          └── updatedAt: timestamp   # Firestore Server Timestamp
```

Example saved Firestore document:

```json
{
  "name": "Landscape Painting",
  "data": {
    "version": "6.0.0",
    "objects": [
      {
        "type": "rect",
        "left": 100,
        "top": 150,
        "width": 300,
        "height": 200,
        "fill": "#22C55E",
        "stroke": "#000000",
        "strokeWidth": 2
      }
    ]
  },
  "createdAt": "2026-09-24T18:45:00Z",
  "updatedAt": "2026-09-24T18:47:00Z"
}
```

---

## 🔒 Firestore Security Rules (Demo Setup)

For the purpose of this assignment (where authentication is not required), the following Firestore security rules allow read and write access to the `canvases` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /canvases/{canvasId} {
      allow read, write: if true;
    }
  }
}
```

> **Security Note:** Public read/write rules are used here to fulfill the no-auth assignment requirements. For a production deployment with user accounts, rules should restrict read/write permissions to authenticated document owners (`request.auth.uid == resource.data.ownerId`).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + S` / `Cmd + S` | Save Canvas to Firestore |
| `Ctrl + Z` / `Cmd + Z` | Undo |
| `Ctrl + Y` / `Ctrl + Shift + Z` | Redo |
| `Delete` / `Backspace` | Delete selected object(s) |
| `Ctrl + C` / `Ctrl + V` | Copy / Paste selected object |
| `Ctrl + A` | Select all objects |
| `Ctrl + +` / `Ctrl + -` | Zoom in / Zoom out |
| `Ctrl + 0` | Reset Zoom to 100% |
| `V` | Switch to Select tool |
| `P` | Switch to Pencil / Pen tool |
| `E` | Switch to Eraser tool |
| `T` | Switch to Text tool |
| `R` | Switch to Rectangle tool |
| `C` | Switch to Circle tool |
| `L` | Switch to Line tool |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

An example template is provided in [.env.example](file:///.env.example).

---

## 🚀 Local Setup & Installation

```bash
# 1. Clone or open the repository
cd canva_2D_editor

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deployment

### Deploy to Vercel
1. Push the repository to GitHub/GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Framework Preset to **Vite**.
4. Add the Firebase environment variables (`VITE_FIREBASE_*`) in **Project Settings -> Environment Variables**.
5. `vercel.json` is already included to ensure SPA routing works seamlessly on `/canvas/:canvasId` refreshes.
6. Deploy!

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize hosting
firebase login
firebase init hosting

# Build production bundle
npm run build

# Deploy
firebase deploy --only hosting
```

---

## 📋 Assignment Compliance Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Tech Stack** | React, Fabric.js, Firebase Firestore, React Router, Tailwind CSS | ✅ Complete |
| **Home Page** | Name/Logo, description, "Create New Canvas" creating Firestore doc ID & routing | ✅ Complete |
| **Canvas Routing** | `/canvas/:canvasId` route with document loading & state restoration | ✅ Complete |
| **Fabric.js Objects** | Rectangle, Circle, Textbox, Line, Star, Arrow, Diamond, PencilBrush | ✅ Complete |
| **Object Manipulation**| Move, Resize, Rotate, Flip, Layer Reorder, Lock, Delete | ✅ Complete |
| **Double-Click Text** | Inline editing on double-click with font size, bold, italic & alignment | ✅ Complete |
| **Drag-to-Draw** | Click & drag on canvas creates shapes with live preview | ✅ Complete |
| **Persistence** | Explicit Save button, `name` & `data` schema, Firestore timestamps | ✅ Complete |
| **Save Status UX** | `✓ Saved`, `● Unsaved changes`, `Saving...` states | ✅ Complete |
| **Undo / Redo** | Independent canvas history stack with keyboard shortcuts | ✅ Complete |
| **Clear Canvas** | Clear action with confirmation modal ("Clear the entire canvas?...") | ✅ Complete |
| **MS Paint UI** | Windows 11 Ribbon layout, Tools, Shapes, Color 1 & 2, 20-color palette | ✅ Complete |
| **Status Bar** | Live coordinates (`X, Y px`), dimensions (`1200 × 700px`), zoom slider | ✅ Complete |
| **Canvas Not Found** | Friendly "Canvas Not Found" screen with "[Go Home]" button | ✅ Complete |
| **SPA Refresh Support**| `vercel.json` rewrites for `/canvas/:canvasId` direct navigation | ✅ Complete |
