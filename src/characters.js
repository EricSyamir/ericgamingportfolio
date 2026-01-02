// Character configurations from the spritesheet
// Each character has different tile indices for their animations
export const characters = [
  {
    id: "char1",
    name: "Alex",
    color: "Pink",
    description: "Cheerful & Friendly",
    anims: {
      "idle-down": 936,
      "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
      "idle-side": 975,
      "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
      "idle-up": 1014,
      "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
    },
    preview: 936, // Idle down sprite for preview
  },
  {
    id: "char2",
    name: "Blake",
    color: "Blue",
    description: "Cool & Calm",
    anims: {
      "idle-down": 940,
      "walk-down": { from: 940, to: 943, loop: true, speed: 8 },
      "idle-side": 979,
      "walk-side": { from: 979, to: 982, loop: true, speed: 8 },
      "idle-up": 1018,
      "walk-up": { from: 1018, to: 1021, loop: true, speed: 8 },
    },
    preview: 940,
  },
  {
    id: "char3",
    name: "Charlie",
    color: "Green",
    description: "Adventurous & Bold",
    anims: {
      "idle-down": 944,
      "walk-down": { from: 944, to: 947, loop: true, speed: 8 },
      "idle-side": 983,
      "walk-side": { from: 983, to: 986, loop: true, speed: 8 },
      "idle-up": 1022,
      "walk-up": { from: 1022, to: 1025, loop: true, speed: 8 },
    },
    preview: 944,
  },
  {
    id: "char4",
    name: "Drew",
    color: "Purple",
    description: "Mysterious & Wise",
    anims: {
      "idle-down": 948,
      "walk-down": { from: 948, to: 951, loop: true, speed: 8 },
      "idle-side": 987,
      "walk-side": { from: 987, to: 990, loop: true, speed: 8 },
      "idle-up": 1026,
      "walk-up": { from: 1026, to: 1029, loop: true, speed: 8 },
    },
    preview: 948,
  },
  {
    id: "char5",
    name: "Ellis",
    color: "Red",
    description: "Energetic & Brave",
    anims: {
      "idle-down": 952,
      "walk-down": { from: 952, to: 955, loop: true, speed: 8 },
      "idle-side": 991,
      "walk-side": { from: 991, to: 994, loop: true, speed: 8 },
      "idle-up": 1030,
      "walk-up": { from: 1030, to: 1033, loop: true, speed: 8 },
    },
    preview: 952,
  },
  {
    id: "char6",
    name: "Finley",
    color: "Yellow",
    description: "Optimistic & Happy",
    anims: {
      "idle-down": 956,
      "walk-down": { from: 956, to: 959, loop: true, speed: 8 },
      "idle-side": 995,
      "walk-side": { from: 995, to: 998, loop: true, speed: 8 },
      "idle-up": 1034,
      "walk-up": { from: 1034, to: 1037, loop: true, speed: 8 },
    },
    preview: 956,
  },
  {
    id: "char7",
    name: "Gray",
    color: "Gray",
    description: "Thoughtful & Steady",
    anims: {
      "idle-down": 960,
      "walk-down": { from: 960, to: 963, loop: true, speed: 8 },
      "idle-side": 999,
      "walk-side": { from: 999, to: 1002, loop: true, speed: 8 },
      "idle-up": 1038,
      "walk-up": { from: 1038, to: 1041, loop: true, speed: 8 },
    },
    preview: 960,
  },
  {
    id: "char8",
    name: "Harper",
    color: "Orange",
    description: "Creative & Fun",
    anims: {
      "idle-down": 964,
      "walk-down": { from: 964, to: 967, loop: true, speed: 8 },
      "idle-side": 1003,
      "walk-side": { from: 1003, to: 1006, loop: true, speed: 8 },
      "idle-up": 1042,
      "walk-up": { from: 1042, to: 1045, loop: true, speed: 8 },
    },
    preview: 964,
  },
];

// Get selected character from localStorage or default to first character
export function getSelectedCharacter() {
  const savedCharId = localStorage.getItem("selectedCharacter");
  return characters.find(c => c.id === savedCharId) || characters[0];
}

// Save selected character to localStorage
export function setSelectedCharacter(charId) {
  localStorage.setItem("selectedCharacter", charId);
}

