# Portfolio Game Map Guide

## Your New Map is Ready! 🎮

The AI-generated image has been successfully implemented as your game map!

### 🗺️ Map Layout

#### **House Interior (Top Section)**
Your portfolio showcase room with all your achievements and projects displayed.

**Interactive Objects:**
1. **Bed** (Bottom Left) → Shows your "Philosophy" and personal beliefs
2. **Trophy Shelf** (Left Wall) → Shows "Awards & Achievements" 
3. **Bookshelf** (Left Side) → Shows "Skills & Certifications"
4. **Project Gallery** (Center Wall) → Shows your "Featured Projects"
5. **Computer Desk** (Center) → Shows your "Portfolio" and work
6. **Right Bookshelf** (Right Side) → Shows additional "Skills"
7. **Contact Desk** (Bottom Right) → Shows "Experience & Contact Info"

#### **Lawn Area (Middle Section)**
A beautiful, peaceful garden area between your house and the dangerous field.

**Interactive Objects:**
8. **Fountain** (Decorative) → Non-interactive boundary
9. **Welcome Sign** → Shows welcome message and introduction
10. **Trees & Decorations** → Boundaries to prevent walking through

#### **Field/Combat Zone (Bottom Section)**
The dangerous area where slimes spawn and attack you!

**Interactive Objects:**
11. **Gate** → Shows warning about entering combat zone

### 🎮 How to Play

**Movement:**
- **WASD** or **Arrow Keys** to move your character

**Interactions:**
- Walk near objects until you see "PRESS E to INTERACT (OBJECT_NAME)"
- Press **E** to interact and open dialogue
- Press **Enter** or **Space** to advance through dialogue
- Press **X** or the close button to exit dialogue

**Combat (Field Area):**
- Press **F** to attack with your sword
- Avoid slimes or defeat them
- Slimes will respawn from outside the screen
- Watch your health bar (top left)
- Press **R** to respawn if you die

**Character Selection:**
- Click "Change Character" button to select a different character
- Choose from 8 different character designs

**UI Controls:**
- Toggle the controls panel with the hide/show button

### 📍 Interactive Object Locations

```
House Interior (Pixel Coordinates):
├─ Bed: (80, 144) - 48x32px
├─ Trophy Shelf: (96, 80) - 96x64px
├─ Left Bookshelf: (304, 80) - 48x48px
├─ Project Gallery: (352, 80) - 128x64px
├─ Computer Desk: (352, 160) - 96x48px
├─ Right Bookshelf: (496, 80) - 64x48px
└─ Contact Desk: (512, 144) - 64x32px

Lawn Area:
├─ Fountain: (144, 240) - 48x32px [boundary]
└─ Welcome Sign: (256, 272) - 64x32px

Field:
└─ Gate: (288, 304) - 64x32px
```

### 🎯 Player Spawn Point
- **Location:** Center of house (320, 160)
- You start inside your portfolio room

### ⚔️ Combat Zone
- **Location:** Bottom section (rows 20-35)
- **Area:** Full width, 240px height
- Slimes spawn and attack in this area
- Enemies respawn infinitely from outside the screen

### 🎨 Map Details
- **Dimensions:** 640×560 pixels (40×35 tiles at 16×16 pixels each)
- **Style:** Pixel art, top-down RPG view
- **Image File:** `public/map.png` (AI-generated)
- **Map Data:** `public/map.json` (collision boundaries and objects)

### 🚀 Development Server
Your game is running at: **http://localhost:5175/**

### 📝 Adding More Interactive Objects

To add new interactive objects:

1. **Edit `public/map.json`** - Add a new object to the "boundaries" layer:
```json
{
  "height": 32,
  "id": 25,
  "name": "your-object-name",
  "type": "boundary",
  "visible": true,
  "width": 48,
  "x": 200,
  "y": 150
}
```

2. **Edit `src/constants.js`** - Add dialogue data:
```javascript
export const dialogueData = {
  "your-object-name": [
    "First line of dialogue",
    "Second line of dialogue",
    "Third line of dialogue"
  ],
  // ... other objects
};

export const objectNames = {
  "your-object-name": "DISPLAY NAME",
  // ... other objects
};
```

3. **Rebuild:** Run `npm run build` and refresh the page!

### 🎵 Sound Effects
The game includes 8-bit sound effects for:
- Approaching objects
- Opening dialogue
- Advancing dialogue
- Closing dialogue
- Attacking
- Getting hit
- Enemy death
- Player death
- Respawning

---

**Enjoy exploring your portfolio game! 🎮✨**

