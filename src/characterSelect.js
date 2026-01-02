import { characters, getSelectedCharacter, setSelectedCharacter } from "./characters";
import { soundManager } from "./sounds";

const modal = document.getElementById("char-select-modal");
const charGrid = document.getElementById("char-grid");
const startBtn = document.getElementById("start-game-btn");
const skipBtn = document.getElementById("change-char-later-btn");
const changeCharBtn = document.getElementById("change-char-btn");

let selectedCharId = null;

// Show character selection on first visit or when button clicked
function showCharacterSelect() {
  modal.classList.remove("hidden");
  renderCharacters();
}

// Hide character selection
function hideCharacterSelect() {
  modal.classList.add("hidden");
}

// Render all character options
function renderCharacters() {
  charGrid.innerHTML = "";
  
  const currentChar = getSelectedCharacter();
  selectedCharId = currentChar.id;
  
  characters.forEach(char => {
    const charOption = document.createElement("div");
    charOption.className = "char-option";
    if (char.id === selectedCharId) {
      charOption.classList.add("selected");
    }
    
    charOption.innerHTML = `
      <div class="char-preview">
        <div style="
          width: 16px; 
          height: 16px; 
          background: url('./spritesheet.png') no-repeat;
          background-size: 624px 496px;
          background-position: ${-((char.preview % 39) * 16)}px ${-Math.floor(char.preview / 39) * 16}px;
          transform: scale(4);
          image-rendering: pixelated;
        "></div>
      </div>
      <div class="char-name">${char.name}</div>
      <div class="char-color">${char.color}</div>
      <div class="char-desc">${char.description}</div>
    `;
    
    charOption.addEventListener("click", () => {
      soundManager.playInteract();
      selectCharacter(char.id);
    });
    
    charGrid.appendChild(charOption);
  });
}

// Select a character
function selectCharacter(charId) {
  selectedCharId = charId;
  
  // Update visual selection
  document.querySelectorAll(".char-option").forEach(el => {
    el.classList.remove("selected");
  });
  event.target.closest(".char-option").classList.add("selected");
}

// Start game with selected character
startBtn.addEventListener("click", () => {
  if (selectedCharId) {
    setSelectedCharacter(selectedCharId);
    soundManager.playDialogueOpen();
    hideCharacterSelect();
    
    // Reload the page to apply character change
    window.location.reload();
  }
});

// Skip character selection
skipBtn.addEventListener("click", () => {
  soundManager.playDialogueClose();
  hideCharacterSelect();
});

// Change character button in instructions
if (changeCharBtn) {
  changeCharBtn.addEventListener("click", () => {
    soundManager.playInteract();
    showCharacterSelect();
  });
}

// Show character select on first visit or if no character selected
window.addEventListener("load", () => {
  const hasVisited = localStorage.getItem("hasVisitedPortfolio");
  
  if (!hasVisited) {
    // First time visitor - show character select after a short delay
    setTimeout(() => {
      showCharacterSelect();
      localStorage.setItem("hasVisitedPortfolio", "true");
    }, 1000);
  }
});

// Expose function globally for tutorial button
window.showCharacterSelect = showCharacterSelect;

