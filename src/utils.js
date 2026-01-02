import { soundManager } from "./sounds";

// RPG-style dialogue system with pagination
let currentDialogue = [];
let currentPage = 0;
let linesPerPage = 3;
let onDialogueEnd = null;
let dialogueJustClosed = false; // Flag to prevent immediate re-interaction

export function displayDialogue(text, onDisplayEnd) {
  const dialogueUI = document.getElementById("textbox-container");
  const dialogue = document.getElementById("dialogue");
  const closeBtn = document.getElementById("close");

  onDialogueEnd = onDisplayEnd;
  dialogueJustClosed = false; // Reset flag when opening new dialogue

  // Play open sound
  soundManager.playDialogueOpen();

  // Handle array of lines (RPG style) or HTML content
  if (Array.isArray(text)) {
    currentDialogue = text;
    currentPage = 0;
    dialogueUI.style.display = "block";
    showCurrentPage(dialogue, closeBtn);
  } else if (text.includes('<')) {
    // Legacy HTML content - show all at once
    currentDialogue = [];
    dialogueUI.style.display = "block";
    dialogue.innerHTML = text;
    closeBtn.textContent = "CLOSE [ENTER/SPACE]";
  } else {
    // Plain text - wrap in array
    currentDialogue = [text];
    currentPage = 0;
    dialogueUI.style.display = "block";
    showCurrentPage(dialogue, closeBtn);
  }

  // Remove old listeners
  closeBtn.onclick = null;
  document.onkeydown = null;

  // Handle close/next
  function handleAdvance(e) {
    if (e) {
      // Allow Enter, Space, E, or Escape
      if (e.type === 'keydown') {
        const validKeys = ['Enter', 'Space', 'KeyE', 'Escape'];
        if (!validKeys.includes(e.code)) {
          return;
        }
      }
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling to Kaboom handlers
      e.stopImmediatePropagation(); // Stop other handlers too
    }

    if (currentDialogue.length === 0) {
      // HTML content - just close
      closeDialogue(dialogueUI, dialogue);
      return;
    }

    // Check if there are more pages
    const totalPages = Math.ceil(currentDialogue.length / linesPerPage);
    
    if (currentPage < totalPages - 1) {
      // Advance to next page
      currentPage++;
      soundManager.playDialogueNext();
      showCurrentPage(dialogue, closeBtn);
    } else {
      // End of dialogue
      closeDialogue(dialogueUI, dialogue);
    }
  }

  closeBtn.onclick = handleAdvance;
  
  // Handle keyboard input
  document.onkeydown = (e) => {
    // Enter, Space, or E to advance/close
    if (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyE') {
      handleAdvance(e);
    }
    // Escape to close
    if (e.code === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      closeDialogue(dialogueUI, dialogue);
    }
  };
}

function showCurrentPage(dialogueEl, closeBtn) {
  const startIndex = currentPage * linesPerPage;
  const endIndex = Math.min(startIndex + linesPerPage, currentDialogue.length);
  const pageLines = currentDialogue.slice(startIndex, endIndex);
  
  // Clear and show lines with typewriter effect
  dialogueEl.innerHTML = '';
  
  pageLines.forEach((line, index) => {
    const lineEl = document.createElement('p');
    lineEl.className = 'dialogue-line';
    lineEl.style.animationDelay = (index * 0.1) + 's';
    lineEl.textContent = line;
    dialogueEl.appendChild(lineEl);
  });

  // Update button text
  const totalPages = Math.ceil(currentDialogue.length / linesPerPage);
  const isLastPage = currentPage >= totalPages - 1;
  
  if (isLastPage) {
    closeBtn.textContent = "CLOSE [ENTER/SPACE]";
  } else {
    closeBtn.textContent = `NEXT [ENTER/SPACE] (${currentPage + 1}/${totalPages})`;
  }
}

function closeDialogue(dialogueUI, dialogue) {
  soundManager.playDialogueClose();
  
  dialogueUI.style.display = "none";
  dialogue.innerHTML = "";
  currentDialogue = [];
  currentPage = 0;
  dialogueJustClosed = true; // Set flag to prevent immediate re-interaction
  
  // Clear keyboard handler
  document.onkeydown = null;
  
  // Reset flag after a short delay to allow re-interaction
  setTimeout(() => {
    dialogueJustClosed = false;
  }, 200); // 200ms cooldown
  
  if (onDialogueEnd) {
    onDialogueEnd();
    onDialogueEnd = null;
  }
}

// Export function to check if dialogue was just closed
export function wasDialogueJustClosed() {
  return dialogueJustClosed;
}

export function setCamScale(k) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.camScale(k.vec2(0.5)); // Zoomed out more (was 1.0)
  } else {
    k.camScale(k.vec2(0.5)); // Zoomed out more (was 1.5)
  }
}
