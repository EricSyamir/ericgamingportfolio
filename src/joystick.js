// Virtual Joystick for Mobile Devices
import { COMBAT_CONFIG } from "./combat";
import { playerScale, scaleFactor } from "./constants";

export function setupJoystick(player, k) {
  const joystickContainer = document.getElementById("joystickContainer");
  const joystickHandle = document.getElementById("joystickHandle");
  const mobileAttackBtn = document.getElementById("mobileAttackBtn");
  
  if (!joystickContainer || !joystickHandle) return;
  
  let isJoystickActive = false;
  let joystickCenterX = 0;
  let joystickCenterY = 0;
  let joystickRadius = 50; // Max distance handle can move from center
  let currentDirection = { x: 0, y: 0 };
  
  // Get joystick container position
  function updateJoystickCenter() {
    const rect = joystickContainer.getBoundingClientRect();
    joystickCenterX = rect.left + rect.width / 2;
    joystickCenterY = rect.top + rect.height / 2;
    joystickRadius = rect.width / 2 - 25; // Account for handle size
  }
  
  updateJoystickCenter();
  window.addEventListener("resize", updateJoystickCenter);
  
  // Handle joystick touch events
  function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    // Check if touch is within joystick area
    const rect = joystickContainer.getBoundingClientRect();
    if (touchX >= rect.left && touchX <= rect.right &&
        touchY >= rect.top && touchY <= rect.bottom) {
      isJoystickActive = true;
      joystickHandle.classList.add("active");
      updateJoystickCenter();
      handleTouchMove(e);
    }
  }
  
  function handleTouchMove(e) {
    if (!isJoystickActive) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    // Calculate distance and direction from center
    const deltaX = touchX - joystickCenterX;
    const deltaY = touchY - joystickCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Limit to joystick radius
    const angle = Math.atan2(deltaY, deltaX);
    const limitedDistance = Math.min(distance, joystickRadius);
    
    // Update handle position
    const handleX = Math.cos(angle) * limitedDistance;
    const handleY = Math.sin(angle) * limitedDistance;
    joystickHandle.style.transform = `translate(calc(-50% + ${handleX}px), calc(-50% + ${handleY}px))`;
    
    // Normalize direction
    const normalizedDistance = limitedDistance / joystickRadius;
    currentDirection.x = Math.cos(angle) * normalizedDistance;
    currentDirection.y = Math.sin(angle) * normalizedDistance;
  }
  
  function handleTouchEnd(e) {
    if (!isJoystickActive) return;
    e.preventDefault();
    
    isJoystickActive = false;
    joystickHandle.classList.remove("active");
    joystickHandle.style.transform = "translate(-50%, -50%)";
    currentDirection = { x: 0, y: 0 };
  }
  
  // Add event listeners
  joystickContainer.addEventListener("touchstart", handleTouchStart, { passive: false });
  joystickContainer.addEventListener("touchmove", handleTouchMove, { passive: false });
  joystickContainer.addEventListener("touchend", handleTouchEnd, { passive: false });
  joystickContainer.addEventListener("touchcancel", handleTouchEnd, { passive: false });
  
  // Update player movement based on joystick input
  let lastDirection = "";
  k.onUpdate(() => {
    if (!player.exists() || player.isInDialogue || player.combat.isDead) return;
    
    const threshold = 0.3; // Minimum movement threshold
    
    if (Math.abs(currentDirection.x) > threshold || Math.abs(currentDirection.y) > threshold) {
      const speed = player.speed;
      const moveX = currentDirection.x * speed;
      const moveY = currentDirection.y * speed;
      
      player.move(moveX, moveY);
      
      // Update player direction and animation
      const absX = Math.abs(currentDirection.x);
      const absY = Math.abs(currentDirection.y);
      
      if (absY > absX) {
        // Vertical movement
        if (currentDirection.y < 0) {
          if (lastDirection !== "up") {
            player.play("walk-up");
            player.direction = "up";
            lastDirection = "up";
          }
        } else {
          if (lastDirection !== "down") {
            player.play("walk-down");
            player.direction = "down";
            lastDirection = "down";
          }
        }
      } else {
        // Horizontal movement
        if (currentDirection.x > 0) {
          player.flipX = false;
          if (lastDirection !== "right") {
            player.play("walk-side");
            player.direction = "right";
            lastDirection = "right";
          }
        } else {
          player.flipX = true;
          if (lastDirection !== "left") {
            player.play("walk-side");
            player.direction = "left";
            lastDirection = "left";
          }
        }
      }
    } else if (lastDirection !== "") {
      // Stop movement
      const stopAnims = () => {
        if (player.direction === "down") {
          player.play("idle-down");
        } else if (player.direction === "up") {
          player.play("idle-up");
        } else {
          player.play("idle-side");
        }
      };
      stopAnims();
      lastDirection = "";
    }
  });
  
  // Mobile attack button
  if (mobileAttackBtn) {
    let attackButtonPressed = false;
    
    mobileAttackBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      attackButtonPressed = true;
      triggerAttack();
    }, { passive: false });
    
    mobileAttackBtn.addEventListener("touchend", (e) => {
      e.preventDefault();
      attackButtonPressed = false;
    }, { passive: false });
    
    mobileAttackBtn.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      attackButtonPressed = false;
    }, { passive: false });
    
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
  }
}

