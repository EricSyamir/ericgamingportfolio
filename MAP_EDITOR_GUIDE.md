# 🗺️ Map Editor Tool - User Guide

## 🚀 Quick Start

1. **Open the Map Editor:**
   - Double-click `map-editor.html` in your browser
   - OR open it from: `http://localhost:5173/map-editor.html` (if dev server is running)

2. **Your map image (`map.png`) will load automatically**

3. **Start creating objects!**

---

## 📍 How to Use

### **Step 1: Select a Mode**

Click one of these buttons:

- 🟢 **INTERACTIVE OBJECT** - Objects you can press E to interact with (bed, computer, desk, etc.)
- 🔴 **BOUNDARY (Wall)** - Walls and obstacles that block player movement
- 🟠 **COMBAT ZONE** - Areas where enemies spawn and attack
- 🔵 **SPAWN POINT** - Player starting position (should be a small square)
- ✋ **SELECT/EDIT** - Click objects to select, edit, or delete them

### **Step 2: Set Object Name**

- Type the object name in "Object Name/Type" field
- **For interactives:** Use names from your `constants.js` (bed, pc, tv, projects, etc.)
- **For boundaries:** Use "wall", "tree", "boundary", etc.

### **Step 3: Draw on Canvas**

- **Click and drag** on the map to create rectangles
- Red/Green/Orange overlay will appear showing your object
- Objects snap to 16px grid by default (you can disable this)

### **Step 4: Manage Objects**

- View all objects in the right panel
- Click an object to select it
- **✏️ Edit** - Change object name
- **🗑️ Delete** - Remove object

### **Step 5: Export**

- Click **💾 EXPORT map.json** button
- Save the file as `map.json`
- Replace your current `public/map.json` with the new one
- Refresh your game!

---

## 🎨 Object Types Explained

### 🟢 **Interactive Objects** (Green)
- Objects players can press E to interact with
- Must have dialogue defined in `src/constants.js`
- Examples: bed, pc, tv, desk, bookshelf, gate, projects, resume

### 🔴 **Boundaries** (Red)
- Walls, obstacles, trees, furniture that blocks movement
- Player cannot walk through these
- Use for walls, large furniture, decorations

### 🟠 **Combat Zones** (Orange)
- Areas where slimes spawn and attack
- Usually the dangerous field area
- Draw a large rectangle covering the combat area

### 🔵 **Spawn Points** (Blue)
- Player starting position
- Should be a small 16×16 square
- Place inside the house or safe area

---

## ⚙️ Settings

### **Show Grid**
- Displays 16×16 pixel grid overlay
- Helps align objects with game tiles

### **Snap to Grid**
- Automatically aligns objects to 16px grid
- Turn off for precise pixel placement

### **Show Labels**
- Shows object names on the canvas
- Turn off for cleaner view

---

## 💾 Import/Export

### **Import Existing map.json**
1. Click **📂 Load map.json**
2. Select your current `public/map.json`
3. All objects will load into the editor
4. You can now edit them!

### **Export New map.json**
1. Click **💾 EXPORT map.json**
2. File downloads automatically
3. Replace `public/map.json` with the new file
4. Copy to `dist/map.json` as well
5. Refresh your game browser!

---

## 🎯 Tips & Best Practices

### **Creating Walls**
- Draw rectangles around room perimeters
- Leave gaps for doors
- Cover all edges where player shouldn't walk

### **Interactive Objects**
- Make slightly larger than visual object on map
- Easier for player to interact
- Typical size: 48×48 or 64×48 pixels

### **Combat Zones**
- One large rectangle for the entire field
- Should cover area where slimes appear
- Don't overlap with safe areas

### **Spawn Points**
- Small 16×16 or 32×32 square
- Place in center of starting room
- Make sure it's not inside a boundary!

### **Object Names**
- Use lowercase, no spaces
- Use hyphens for multi-word: "project-gallery"
- Match names in `constants.js` for interactives

---

## 🔧 Workflow Example

1. **Import** your current `map.json` to see existing objects
2. **Select/Edit Mode** to adjust existing objects
3. Switch to **Boundary Mode** to add walls you missed
4. Switch to **Interactive Mode** to add new portfolio items
5. **Export** the new `map.json`
6. Copy to `public/` and `dist/` folders
7. **Refresh** game and test!

---

## 🐛 Troubleshooting

### **Map image not showing**
- Make sure `map.png` is in the same folder as `map-editor.html`
- Click "🔄 Reload Image" button
- Check browser console for errors

### **Objects not working in game**
- Verify object names match `dialogueData` in `constants.js`
- Make sure `map.json` is in `public/` folder
- Copy to `dist/` folder and rebuild: `npm run build`

### **Player can walk through walls**
- Boundaries need to be in "boundaries" layer (automatic in export)
- Make sure boundaries cover all wall areas
- Check for gaps in boundary rectangles

### **Can't interact with objects**
- Use **Interactive Object** mode (green), not Boundary mode
- Object must have matching entry in `constants.js`
- Get close enough to the object (within 25 pixels)

---

## 📂 File Locations

- **Map Editor:** `map-editor.html`
- **Map Image:** `public/map.png`
- **Map Data:** `public/map.json`
- **Dialogue Data:** `src/constants.js`

---

## 🎮 Testing Your Map

1. Export `map.json` from editor
2. Save to `public/map.json`
3. Run: `npm run build`
4. Refresh browser: `Ctrl + Shift + R`
5. Test all interactive objects
6. Walk around to check boundaries
7. Go to combat zone to test slimes

---

**Happy Mapping! 🗺️✨**

