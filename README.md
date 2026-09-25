# ChullDraw 2D — Web-Based 2D Canvas style Editor

A complete, responsive, web-based 2D canvas editor built with **React**, **Fabric.js**, **Firebase Firestore**, and **Tailwind CSS**. Inspired by the clean workspace experience of **Windows 11 MS Paint** and **Canva**.

---

## 🎬 Product Demo

> **Add your screen recording or GIF here**
>
> Replace this section with a link or embedded video/gif of the product in action.
>
> Example: `![Demo](./public/demo.gif)`

---

## 🖼️ Workspace Screenshot

> **Add a screenshot of the editor here**
>
> Example: `![Editor Workspace](./public/screenshot.png)`

---

## 🎨 Project Overview

ChullDraw 2D provides a lightweight yet powerful in-browser drawing and vector manipulation workspace. Users can start a new drawing with a single click, design with shapes, pencil brush, and text, manipulate objects on canvas, and persist their work directly to Firebase Firestore with seamless URL-based reload and sharing (`/canvas/:canvasId`).

---

## ✨ Features

### 1. Shape & Vector Tools (Drag to Draw)
- **Rectangle / Square**: Click & drag with customizable stroke, fill, and corner radius.
- **Circle / Ellipse**: Drag-to-size circle creation with live dimensions.
- **Triangle**: Polygon triangle generator with interactive bounding box.
- **Line**: Smooth 2-point vector line tool with stroke width control.
- **Polygons & Stars**: Quick presets for Stars, Arrows, Diamonds, Hearts, and Clouds.

### 2. Freehand Pencil & Eraser
- **Smooth Pencil Brush**: Powered by Fabric.js freehand drawing with configurable stroke color and thickness.
- **Eraser**: Fast brush eraser tool.
- **Full Participation**: Once drawn, brush strokes become selectable Fabric objects that can be moved, scaled, rotated, colored, or deleted.

### 3. Typography & Text Editing
- **Interactive Textbox**: Click anywhere on the canvas to spawn an editable text box.
- **Click-to-Focus**: Clicking inside an already-selected textbox focuses it for inline editing instead of creating a new one.
- **Rich Text Properties**: Font family dropdown, font size controls, bold, italic, alignment (left/center/right), and text color.

### 4. Interactive Object Transformations
- **Selection & Multi-selection**: Select individual objects or drag-box select multiple objects.
- **Manipulations**: Move, scale, rotate with interactive control handles, flip horizontally/vertically, and layer reordering (Bring to Front, Send to Back).
- **Lock/Unlock**: Prevent accidental movement of finished layers.

### 5. MS Paint Palette & Color System
- **Dual Color System**: **Color 1** (Foreground / Stroke / Pen / Text) and **Color 2** (Background / Shape Fill).
- **2-Row 20-Color Classic Palette**: Instant one-click selection of standard MS Paint colors.
- **Custom Color Wheel Picker**: Support for any HEX / RGB color.

### 6. Workspace UX Refinements
- **Tool Toggle**: Clicking an already-active tool button deselects it and returns to the Select tool.
- **Background Click**: Clicking outside the white canvas workspace deselects any active tool and object selection.
- **CSS Grid Overlay**: Grid lines are rendered as a lightweight CSS background — zero Fabric.js object overhead.

### 7. Persistence & Firebase Firestore
- **URL-based Canvas Loading**: Every canvas has a unique ID (`/canvas/:canvasId`).
- **Save Status UX**: Visual indicators for `✓ Saved`, `● Unsaved changes`, and `Saving...`.
- **Reliable Fallback**: Firestore timeout handling with localStorage caching so work is never lost.
- **Graceful 404 Screen**: If a canvas ID is invalid or not found, a friendly "Canvas not found" screen with a "[Go Home]" button is displayed.

### 8. History & Undo/Redo
- **State Tracking**: Automatically tracks object additions, modifications, resizing, deletions, and brush strokes.
- **Undo / Redo Stack**: Works with keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y`) and ribbon buttons (up to 50 steps).
- **Clear Canvas Dialog**: Safe confirmation modal before wiping the canvas.

### 9. Export & Workspace Controls
- **Export Formats**: Download as **PNG** (2× retina), **SVG vector**, or **Fabric JSON**.
- **Zoom System**: Live zoom slider and buttons (25% to 400%), plus fit-to-screen (`100%`).
- **Live Coordinates**: Cursor position tracker (`X, Y px`) and object counter on the bottom status bar.

### 10. Image Editing
- **Image Upload**: Insert images from local disk directly onto the canvas.
- **Filter Presets**: Grayscale, Sepia, Invert, Vintage, Black & White.
- **Adjustments**: Brightness, Contrast, Blur sliders with per-image persistence.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Canvas Engine | [Fabric.js v7](https://fabricjs.com/) |
| Persistence | [Firebase Firestore v12](https://firebase.google.com/docs/firestore) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Build Tool | [Vite](https://vitejs.dev/) |

---

## 📁 Architecture

```text
src/
├── components/
│   ├── Canvas/
│   │   ├── CanvasArea.tsx             # Fabric.js engine: drag-to-draw, tool routing, zoom
│   │   ├── CanvasEditor.tsx           # Main editor page — state coordination hub
│   │   ├── RibbonToolbar.tsx          # MS Paint Windows 11-style top ribbon toolbar
│   │   ├── ContextualPropertyBar.tsx  # Object property controls (appears on selection)
│   │   └── StatusBar.tsx             # Bottom bar: coordinates, canvas size, zoom slider
│   ├── Home/
│   │   ├── HomePage.tsx              # Landing page & canvas creation entry point
│   │   ├── Navbar.tsx                # Navigation with dropdown menus
│   │   ├── Hero.tsx                  # Hero section with CTA
│   │   ├── FeaturesSection.tsx       # Features overview
│   │   ├── HowItWorks.tsx            # Step-by-step usage guide
│   │   ├── ToolsSection.tsx          # Tool showcase section
│   │   ├── CTASection.tsx            # Call-to-action section
│   │   ├── ProductPreview.tsx        # Product preview / screenshot display
│   │   ├── TrustStrip.tsx            # Social proof / trust indicators
│   │   ├── Footer.tsx                # Site footer
│   │   └── CustomCursor.tsx          # Custom canvas cursor effect
│   └── shared/
│       ├── ColorPicker.tsx           # Reusable color picker with palette + hex input
│       ├── ConfirmDialog.tsx         # "Clear Canvas" confirmation modal
│       └── Toast.tsx                 # Global toast notification system
│
├── hooks/
│   ├── useFirestore.ts               # Firestore CRUD with localStorage fallback
│   ├── useCanvasHistory.ts           # Undo / Redo history stack (max 50 entries)
│   └── useKeyboardShortcuts.ts       # Global keyboard shortcut bindings
│
├── services/
│   └── firebase.ts                   # Firebase app & Firestore initialization
│
├── types/
│   └── canvas.ts                     # TypeScript types: ToolType, CanvasDocument, etc.
│
├── utils/
│   ├── canvasHelpers.ts              # Canvas serialize/deserialize, PNG/SVG export
│   ├── constants.ts                  # Canvas dimensions, palette colors, font list
│   └── floodFill.ts                  # BFS flood-fill algorithm for the fill tool
│
├── App.tsx                           # Route config (/ and /canvas/:canvasId)
├── main.tsx                          # React root entry point
└── index.css                         # Design tokens & Tailwind configuration
```

---

## 🗄️ Firestore Data Model

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

## 🔒 Firestore Security Rules

For the purpose of this project (no authentication required), the following rules allow read and write access to the `canvases` collection:

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

> **Security Note:** Public read/write rules are appropriate here for an unauthenticated demo. For a production deployment with user accounts, restrict read/write to authenticated document owners: `request.auth.uid == resource.data.ownerId`.

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
| `V` | Select tool |
| `P` | Pencil / Pen tool |
| `E` | Eraser tool |
| `T` | Text tool |
| `R` | Rectangle tool |
| `C` | Circle tool |
| `L` | Line tool |
| `S` | Star tool |
| `H` | Heart tool |

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

> All variables must be prefixed with `VITE_` to be exposed to the client by Vite.

---

## 🚀 Local Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/canva_2D_editor.git
cd canva_2D_editor

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# 4. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)
1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Framework Preset to **Vite**.
4. Add all `VITE_FIREBASE_*` variables in **Project Settings → Environment Variables**.
5. `vercel.json` is already included to ensure SPA routing works on `/canvas/:canvasId` page refreshes.
6. Deploy!

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

---

## 📋 Feature Checklist

| Feature | Implementation | Status |
| :--- | :--- | :---: |
| React + Fabric.js + Firebase | Vite, React 19, Fabric.js v7, Firestore | ✅ |
| Home Page & Canvas Creation | Landing page, Firestore doc creation, routing | ✅ |
| Canvas Routing | `/canvas/:canvasId` with document load & restore | ✅ |
| Shape Tools | Rect, Circle, Triangle, Line, Star, Arrow, Diamond, Heart, Cloud | ✅ |
| Freehand Pen & Eraser | PencilBrush, configurable width & color | ✅ |
| Flood Fill | BFS pixel-flood fill algorithm | ✅ |
| Object Manipulation | Move, Resize, Rotate, Flip, Layer order, Lock | ✅ |
| Text Editing | Click-to-create, click-to-focus, double-click inline edit | ✅ |
| Persistence | Save button, Firestore sync, localStorage fallback | ✅ |
| Save Status UX | `✓ Saved`, `● Unsaved`, `Saving...` states | ✅ |
| Undo / Redo | 50-entry history stack, Ctrl+Z/Y | ✅ |
| Clear Canvas | Confirmation modal before wipe | ✅ |
| Export | PNG (2x), SVG, Fabric JSON download | ✅ |
| Image Upload & Filters | Local image insert, filter presets, adjustments | ✅ |
| MS Paint Ribbon UI | Windows 11 ribbon layout with full 20-color palette | ✅ |
| Status Bar | Live cursor coords, canvas dimensions, zoom slider | ✅ |
| Keyboard Shortcuts | Save, Undo, Redo, Delete, Copy, Paste, 9 tool shortcuts | ✅ |
| Grid Overlay | CSS-based grid toggle (zero canvas overhead) | ✅ |
| Tool Toggle UX | Re-clicking active tool returns to Select | ✅ |
| Canvas Not Found | Friendly 404 screen with Go Home button | ✅ |
| SPA Refresh Support | `vercel.json` rewrites for deep-link navigation | ✅ |
