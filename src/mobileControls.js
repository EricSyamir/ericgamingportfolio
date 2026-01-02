// Mobile Controls for Touch Devices
import { COMBAT_CONFIG } from "./combat";
import { playerScale, scaleFactor } from "./constants";
import { dialogueData } from "./constants";
import { displayDialogue, wasDialogueJustClosed } from "./utils";
import { soundManager } from "./sounds";
import { showProjectsMenu } from "./projectMenu";

export function setupMobileControls(player, k, getIsInCombatZone, getNearbyInteractive) {
  const mobileActionBtn = document.getElementById("mobileActionBtn");
  
  if (!mobileActionBtn) return;
  
  // Update button text based on context
  function updateButtonText() {
    const isInCombat = getIsInCombatZone();
    const nearby = getNearbyInteractive();
    
    if (isInCombat) {
      mobileActionBtn.innerHTML = '<span>F</span>';
      mobileActionBtn.style.background = 'rgba(255, 71, 87, 0.9)';
      mobileActionBtn.style.borderColor = '#fff';
      mobileActionBtn.style.boxShadow = '0 4px 20px rgba(255, 71, 87, 0.5)';
    } else if (nearby && dialogueData[nearby]) {
      mobileActionBtn.innerHTML = '<span>E</span>';
      mobileActionBtn.style.background = 'rgba(102, 126, 234, 0.9)';
      mobileActionBtn.style.borderColor = 'var(--primary)';
      mobileActionBtn.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.5)';
    } else {
      mobileActionBtn.innerHTML = '<span>F</span>';
      mobileActionBtn.style.background = 'rgba(255, 71, 87, 0.9)';
      mobileActionBtn.style.borderColor = '#fff';
      mobileActionBtn.style.boxShadow = '0 4px 20px rgba(255, 71, 87, 0.5)';
    }
  }
  
  // Update button text periodically
  k.onUpdate(() => {
    updateButtonText();
  });
  
  // Handle button press
  mobileActionBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleButtonPress();
  }, { passive: false });
  
  mobileActionBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
  }, { passive: false });
  
  mobileActionBtn.addEventListener("touchcancel", (e) => {
    e.preventDefault();
  }, { passive: false });
  
  function handleButtonPress() {
    if (player.isInDialogue || player.combat.isDead) return;
    
    const isInCombat = getIsInCombatZone();
    const nearby = getNearbyInteractive();
    
    // Priority: Attack if in combat zone, otherwise interact
    if (isInCombat) {
      triggerAttack();
    } else if (nearby && dialogueData[nearby]) {
      triggerInteraction(nearby);
    } else {
      // Fallback to attack if no interaction available
      triggerAttack();
    }
  }
  
  function triggerAttack() {
    if (player.isInDialogue || player.combat.isDead) return;
    
    if (player.combat.attack()) {
      // Show sword animation
      if (player.sword && !player.sword.exists()) {
        k.add(player.sword);
      }
      
      // Position sword based on player direction
      let swordAnim = "sword-swing-down";
      let swordOffset = k.vec2(0, 20 * playerScale);
      
      if (player.direction === "up") {
        swordAnim = "sword-swing-up";
        swordOffset = k.vec2(0, -20 * playerScale);
      } else if (player.direction === "left" || player.direction === "right") {
        swordAnim = "sword-swing-side";
        swordOffset = k.vec2((player.direction === "right" ? 20 : -20) * playerScale, 0);
        player.sword.flipX = player.direction === "left";
      }
      
      player.sword.play(swordAnim);
      player.sword.pos = player.pos.add(swordOffset);
      player.sword.opacity = 1;
      
      // Hide sword after animation
      k.wait(0.2, () => {
        if (player.sword.exists()) {
          player.sword.opacity = 0;
        }
      });
      
      // Check for enemies in range
      const enemies = k.get("enemy");
      const attackRange = COMBAT_CONFIG.playerAttackRange * scaleFactor;
      
      enemies.forEach(enemy => {
        if (enemy.pos.dist(player.pos) < attackRange) {
          if (enemy.combat && !enemy.combat.isDead) {
            enemy.combat.takeDamage(
              COMBAT_CONFIG.playerAttackDamage,
              player,
              COMBAT_CONFIG.playerKnockbackStrength
            );
          }
        }
      });
    }
  }
  
  function triggerInteraction(interactiveName) {
    // Don't interact if dialogue is open or was just closed
    if (player.isInDialogue || wasDialogueJustClosed()) return;
    
    // Check if dialogue UI is visible
    const dialogueUI = document.getElementById("textbox-container");
    if (dialogueUI && dialogueUI.style.display === "block") return;
    
    if (!interactiveName || !dialogueData[interactiveName]) {
      soundManager.playError();
      return;
    }
    
    // Special case: projects should open the project menu
    if (interactiveName === "projects") {
      soundManager.playInteract();
      showProjectsMenu();
      return;
    }
    
    player.isInDialogue = true;
    
    // Play interaction sound
    soundManager.playInteract();
    
    displayDialogue(
      dialogueData[interactiveName],
      () => {
        player.isInDialogue = false;
      }
    );
  }
}

