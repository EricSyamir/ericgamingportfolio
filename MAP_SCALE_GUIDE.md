# Map Scale Adjustment Guide

## 🎯 How to Change Map Size

### Location: `src/main.js` (Lines 57-64)

```javascript
k.scene("main", async () => {
  const mapData = await (await fetch("./map.json")).json();
  const layers = mapData.layers;

  // MAP SCALE - Adjust this number to change map size relative to character
  // Try values between 1-4: smaller = smaller map, larger = bigger map
  const mapScale = 2; // <-- CHANGE THIS NUMBER
  
  const map = k.add([k.sprite("map"), k.pos(0), k.scale(mapScale)]);
```

### 📐 Scale Values Guide

| mapScale Value | Map Size | Best For |
|----------------|----------|----------|
| **1** | Very Small | Character bigger than objects |
| **1.5** | Small | Character slightly bigger |
| **2** | Medium | **Current - Balanced size** ✅ |
| **2.5** | Medium-Large | Character slightly smaller |
| **3** | Large | More detailed map view |
| **4** | Very Large | Original size (was too big) |

### 🔧 How to Adjust

1. **Open** `src/main.js`
2. **Find** line ~63: `const mapScale = 2;`
3. **Change** the number:
   - **Increase** (e.g., 2.5, 3) = Bigger map, smaller character
   - **Decrease** (e.g., 1.5, 1) = Smaller map, bigger character
4. **Save** the file
5. **Refresh** browser (Ctrl + Shift + R)

### 💡 Tips

- **Start with small changes**: Try 0.25 increments (2 → 2.25 → 2.5)
- **Best balance**: Usually between 1.5 - 2.5
- **Current setting**: 2 (half the original size of 4)
- The character scale remains at 4 (scaleFactor), so only the map changes

### ⚠️ Important

- Don't change `scaleFactor` - it controls character, UI, and other game elements
- Only change `mapScale` - it's specifically for the map size
- All collision boundaries and spawn zones automatically adjust with mapScale

---

**Current Status**: Map scale set to **2** for balanced proportions ✅

