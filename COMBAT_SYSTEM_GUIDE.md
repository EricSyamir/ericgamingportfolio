# Combat System Implementation Guide

## ✅ What's Been Implemented

### 1. **Combat System** (`src/combat.js`)
- ✅ Player health system (100 HP)
- ✅ Player attack mechanics (F key, 20 damage, 30px range)
- ✅ Attack cooldown (0.5s)
- ✅ Death and respawn system (R key)

### 2. **Slime Enemies**
- ✅ Slime AI with aggro range (120px)
- ✅ Slime health (40 HP)
- ✅ Slime attacks (10 damage)
- ✅ Slime movement towards player
- ✅ Death animations with fade-out

### 3. **Enemy Spawning System**
- ✅ Automatic spawning outside camera view
- ✅ Maximum 8 slimes at once
- ✅ 5-second respawn timer
- ✅ Spawns only in designated combat zones

### 4. **UI Elements**
- ✅ Health bar (top-left corner)
- ✅ Health bar color changes (green → yellow → red)
- ✅ Combat zone alerts
- ✅ Death screen with respawn prompt

### 5. **Controls**
- ✅ **F Key** - Attack nearby enemies
- ✅ **R Key** - Respawn after death
- ✅ **WASD/Arrows** - Movement
- ✅ **E/Space** - Interact with objects

---

## 📋 What You Need to Do: Create the New Map

The combat system is ready, but you need to create a new map using **Tiled Map Editor** with these layers:

### Required Map Layers:

1. **Ground Layer** (Tile Layer)
   - Draw the house interior
   - Draw the lawn
   - Draw the field/outdoor area
   - Use grass, dirt, and floor tiles from the spritesheet

2. **Walls/Objects Layer** (Tile Layer)
   - Add house walls
   - Add furniture
   - Add fence/gate
   - Add decorative objects

3. **Boundaries Layer** (Object Layer) - **IMPORTANT**
   - Add collision rectangles for walls
   - Add collision rectangles for furniture
   - Name interactive objects (e.g., "bed", "desk", "bookshelf", "gate")
   - These names will trigger dialogues from `constants.js`

4. **Combat Zones Layer** (Object Layer) - **NEW**
   - Add rectangles in the field area where enemies should spawn
   - Name this layer exactly: `combatzones`
   - Draw zones in the dangerous outdoor areas

5. **Spawnpoints Layer** (Object Layer)
   - Add a point object named "player" where the player spawns
   - This should be inside the house or safe area

---

## 🎮 How to Create the Map in Tiled

### Step 1: Open Tiled and Create New Map
1. Open **Tiled Map Editor**
2. File → New → New Map
3. Settings:
   - Orientation: Orthogonal
   - Tile layer format: CSV
   - Tile size: 16x16
   - Map size: 40x30 tiles (or larger for your design)

### Step 2: Import Spritesheet
1. Map → New Tileset
2. Browse to `spritesheet.png`
3. Tile width/height: 16x16
4. Margin: 0, Spacing: 0

### Step 3: Create Layers (in this order)
1. **Ground** (Tile Layer) - Draw floor/grass
2. **Objects** (Tile Layer) - Draw furniture/decorations
3. **Boundaries** (Object Layer) - Add collision boxes
4. **CombatZones** (Object Layer) - Add enemy spawn zones
5. **Spawnpoints** (Object Layer) - Add player spawn point

### Step 4: Design Your Map

#### House Interior:
- Use floor tiles (wood planks from spritesheet)
- Add walls using wall tiles
- Add furniture: bed, desk, bookshelf, etc.
- Add door leading to lawn

#### Lawn:
- Use grass tiles
- Add fence around perimeter
- Add gate object (interactive)
- Keep this area safe (no combat zones)

#### Field/Outdoor:
- Use grass and dirt tiles
- More open space
- **Add combat zone rectangles here**
- This is where slimes will spawn

### Step 5: Add Boundaries
1. Select "Boundaries" layer
2. Use Rectangle tool (R key)
3. Draw rectangles around:
   - Walls
   - Furniture
   - Fence
4. Name interactive objects in Properties panel:
   - Click rectangle → Properties → Add "name" property
   - Examples: "bed", "desk", "bookshelf", "gate", "door"

### Step 6: Add Combat Zones
1. Select "CombatZones" layer (or create it as Object Layer)
2. Draw large rectangles in the field area
3. These zones determine where enemies spawn
4. Don't overlap with safe areas (house/lawn)

### Step 7: Add Player Spawn
1. Select "Spawnpoints" layer
2. Insert → Insert Point (or press I)
3. Click where player should start
4. In Properties: name = "player"

### Step 8: Export
1. File → Export As
2. Save as `map.json` in `/public/` folder
3. Also export as PNG: File → Export As Image → `map.png`

---

## 🎨 Recommended Map Layout

```
┌─────────────────────────────────────┐
│  HOUSE INTERIOR                     │
│  ┌──────┐  ┌──────┐                │
│  │ Bed  │  │ Desk │                │
│  └──────┘  └──────┘                │
│                                     │
│  [Door]                             │
└──────────┬──────────────────────────┘
           │
┌──────────┴──────────────────────────┐
│  LAWN (Safe Zone)                   │
│  🌳    🌳    🌳                     │
│                                     │
│  ═══════ GATE ═══════              │
└──────────┬──────────────────────────┘
           │
┌──────────┴──────────────────────────┐
│  FIELD (Combat Zone) 💀             │
│                                     │
│  👾  Slimes spawn here  👾         │
│                                     │
│  👾     👾     👾                  │
└─────────────────────────────────────┘
```

---

## 🔧 Adding Interactive Objects

After creating the map, add dialogue for your objects in `src/constants.js`:

```javascript
export const dialogueData = {
  // ... existing dialogues ...
  
  bed: [
    "A cozy bed.",
    "Perfect for a good night's sleep.",
    "Press R to rest and restore health!"
  ],
  
  gate: [
    "WARNING: Dangerous area ahead!",
    "Slimes roam the fields beyond.",
    "Press F to attack. Good luck!"
  ],
  
  bookshelf: [
    "A bookshelf full of coding books.",
    "JavaScript, Python, React...",
    "Knowledge is power!"
  ],
};

export const objectNames = {
  // ... existing names ...
  bed: "BED",
  gate: "GATE",
  bookshelf: "BOOKSHELF",
};
```

---

## 🎯 Testing the Combat System

Even without a new map, you can test the combat system:

1. The current map will work (no combat zones = no enemies)
2. To test enemies, manually add a combat zone to your current `map.json`:

```json
{
  "draworder":"topdown",
  "id":6,
  "name":"combatzones",
  "objects":[
    {
      "height":200,
      "id":40,
      "name":"field",
      "rotation":0,
      "type":"",
      "visible":true,
      "width":300,
      "x":100,
      "y":100
    }
  ],
  "opacity":1,
  "type":"objectgroup",
  "visible":true,
  "x":0,
  "y":0
}
```

3. Refresh the game and walk to that area
4. Slimes should start spawning!

---

## 🎮 Combat Tips for Players

- **Health Management**: Watch your health bar (top-left)
- **Attack Range**: Get close to slimes before pressing F
- **Kiting**: Hit and run - attack then move away
- **Safe Zones**: Return to house/lawn to escape
- **Respawn**: Press R after death to try again

---

## 🐛 Troubleshooting

### Slimes not spawning?
- Check if you're in a combat zone
- Look for "DANGER ZONE" alert
- Verify `combatzones` layer exists in map.json

### Can't attack?
- Press F key (not E)
- Get closer to enemies
- Wait for attack cooldown (0.5s)

### Health bar not showing?
- Check browser console for errors
- Verify HTML elements exist
- Refresh the page

---

## 🚀 Next Steps

1. **Create the map** in Tiled following the guide above
2. **Export** map.json and map.png to `/public/` folder
3. **Add dialogues** for new interactive objects
4. **Test** the combat system
5. **Adjust** enemy spawn rates/difficulty in `src/combat.js` if needed

---

## 📝 Optional Enhancements

Want to make it even better? You can:

- Add different enemy types (modify `combat.js`)
- Add health pickups (hearts that restore HP)
- Add weapons/power-ups
- Add boss enemies
- Add experience/leveling system
- Add sound effects for combat
- Add particle effects for attacks

The foundation is ready - now it's time to build your world! 🎮✨

