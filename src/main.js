import { dialogueData, scaleFactor, playerScale, objectNames } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale, wasDialogueJustClosed } from "./utils";
import { soundManager } from "./sounds";
import { getSelectedCharacter } from "./characters";
import { PlayerCombat, EnemySpawner, COMBAT_CONFIG } from "./combat";
import { showProjectsMenu } from "./projectMenu";
import { setupMobileControls } from "./mobileControls";

// Get the selected character
const selectedChar = getSelectedCharacter();

k.loadSprite("spritesheet", "./spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    ...selectedChar.anims,
    // Slime animations
    "slime-idle": 858,
    "slime-move": { from: 858, to: 859, loop: true, speed: 6 },
    // Sword animations (swords in spritesheet around tile 230-250 area)
    "sword-swing-down": { from: 1009, to: 1011, loop: false, speed: 15 },
    "sword-swing-side": { from: 1009, to: 1011, loop: false, speed: 15 },
    "sword-swing-up": { from: 312, to: 315, loop: false, speed: 15 },
  },
});

k.loadSprite("map", "./map.png");

// Eric's theme color - deep purple/blue
k.setBackground(k.Color.fromHex("#0f0f1a"));

// Track nearby interactive object
let nearbyInteractive = null;
let lastNearbyInteractive = null;
const interactionPrompt = document.getElementById("interaction-prompt");
const interactionText = document.getElementById("interaction-text");

// Show/hide interaction prompt with object name
function showInteractionPrompt(show, objectName = null) {
  if (interactionPrompt) {
    interactionPrompt.style.display = show ? "block" : "none";
    
    if (show && interactionText && objectName) {
      const friendlyName = objectNames[objectName] || objectName.toUpperCase();
      interactionText.textContent = friendlyName;
      
      // Play sound when first approaching an object
      if (objectName !== lastNearbyInteractive) {
        soundManager.playNearObject();
        lastNearbyInteractive = objectName;
      }
    } else {
      lastNearbyInteractive = null;
    }
  }
}

k.scene("main", async () => {
  try {
    const mapData = await (await fetch("./map.json")).json();
    const layers = mapData.layers;

    // Use scaleFactor (4) for map scale, same as the working version
    const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

    const player = k.make([
      k.sprite("spritesheet", { anim: "idle-down" }),
      k.area({
        shape: new k.Rect(k.vec2(0, 3), 10, 10),
      }),
      k.body(),
      k.anchor("center"),
      k.pos(),
      k.scale(playerScale),
      k.z(10), // Ensure player is above the map
      {
        speed: 250,
        direction: "down",
        isInDialogue: false,
        combat: null, // Will be set after player is added
      },
      "player",
    ]);
    
    // Add combat system to player
    player.combat = new PlayerCombat(player);
    
    // Create sword entity (hidden by default)
    const sword = k.make([
      k.sprite("spritesheet", { anim: "sword-swing-down" }),
      k.pos(),
      k.anchor("center"),
      k.scale(playerScale),
      k.z(player.z + 1), // Sword above player
      k.opacity(0),
      "sword",
    ]);
    
    player.sword = sword;

  // Store all interactive zones and spawn zones
  const interactiveZones = [];
  const spawnZones = [];
  let gateZone = null;
  let isInCombatZone = false;

  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        // Check if this is an interactive object (has dialogue data)
        const isInteractive = boundary.name && dialogueData[boundary.name];
        
        // Only add solid body for walls (non-interactive boundaries)
        // Interactive objects should be walkable
        const zone = map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          ...(isInteractive ? [] : [k.body({ isStatic: true })]), // Only walls are solid
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        // Track interactive zones (ones with dialogues)
        if (isInteractive) {
          interactiveZones.push({
            name: boundary.name,
            x: boundary.x,
            y: boundary.y,
            width: boundary.width,
            height: boundary.height,
          });
        }
        
        // Track gate
        if (boundary.name === "gate") {
          gateZone = zone;
        }
      }

      continue;
    }
    
    // Combat zones where enemies spawn
    if (layer.name === "combatzones") {
      for (const zone of layer.objects) {
        spawnZones.push({
          x: zone.x,
          y: zone.y,
          width: zone.width,
          height: zone.height,
        });
      }
      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        // Use first spawnpoint found (check for point: true or any object)
        if (entity.point === true || entity.name === "player" || layer.objects.indexOf(entity) === 0) {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          k.add(player);
          break; // Use first spawnpoint found
        }
      }
    }
  }

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });
  
  // Initialize enemy spawner (using scaleFactor for correct positioning)
  const enemySpawner = new EnemySpawner(k, scaleFactor, spawnZones, spawnZones);
  enemySpawner.setPlayer(player);
  enemySpawner.setOnEnemyKilled((points) => {
    if (player.combat) {
      player.combat.addScore(points);
    }
  });
  
  // Setup mobile controls (action button for attack/interact)
  setupMobileControls(
    player, 
    k, 
    () => isInCombatZone,
    () => nearbyInteractive
  );

  // Check proximity to interactive objects
  k.onUpdate(() => {
    if (player.combat.isDead) return;
    
    k.camPos(player.worldPos().x, player.worldPos().y - 100);
    
    // Update enemy spawner
    enemySpawner.update(k.dt());

    // Check if player is near any interactive zone
    if (!player.isInDialogue) {
      const playerX = player.pos.x / scaleFactor;
      const playerY = player.pos.y / scaleFactor;
      const interactionDistance = 50; // Pixels - increased from 25 for better detection

      nearbyInteractive = null;

      for (const zone of interactiveZones) {
        // Check if player is within expanded bounds of the zone
        const expandedZone = {
          x: zone.x - interactionDistance,
          y: zone.y - interactionDistance,
          width: zone.width + (interactionDistance * 2),
          height: zone.height + (interactionDistance * 2)
        };

        if (playerX >= expandedZone.x && 
            playerX <= expandedZone.x + expandedZone.width &&
            playerY >= expandedZone.y && 
            playerY <= expandedZone.y + expandedZone.height) {
          nearbyInteractive = zone.name;
          break;
        }
      }

      showInteractionPrompt(nearbyInteractive !== null, nearbyInteractive);
    } else {
      showInteractionPrompt(false);
    }
    
    // Check if in combat zone
    checkCombatZone();
  });
  
  // Draw in-game health bar and score
  k.onDraw(() => {
    // Draw player health bar and score
    if (player.exists() && player.combat && !player.combat.isDead) {
      const scoreText = `SCORE: ${player.combat.score}`;
      const scoreWidth = 200;
      const scoreHeight = 25;
      const barWidth = 200;
      const barHeight = 20;
      const spacing = 10; // Space between score and health bar
      
      // Adjust bottom offset for mobile visibility (health bar stays at bottom-right)
      const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const bottomOffset = isMobile ? 100 : 20; // More space on mobile so health bar is visible
      
      // Position at bottom-right corner (score above health bar)
      const barX = k.width() - barWidth - 20;
      const barY = k.height() - barHeight - bottomOffset; // Health bar at bottom
      const scoreY = barY - scoreHeight - spacing; // Score above health bar
      
      // Draw score background (styled like controls UI) - aligned with health bar
      k.drawRect({
        pos: k.vec2(barX, scoreY - 2),
        width: scoreWidth + 4,
        height: scoreHeight + 4,
        color: k.rgb(15, 15, 26),
        opacity: 0.9,
        fixed: true,
      });
      
      // Draw score border (gold like controls)
      k.drawRect({
        pos: k.vec2(barX, scoreY - 2),
        width: scoreWidth + 4,
        height: scoreHeight + 4,
        color: k.rgb(255, 215, 0),
        opacity: 1,
        outline: { width: 3, color: k.rgb(255, 215, 0) },
        fill: false,
        fixed: true,
      });
      
      // Draw score text (using monospace font to match other UI elements)
      k.drawText({
        text: scoreText,
        pos: k.vec2(barX + 10, scoreY + 8),
        size: 10,
        color: k.rgb(255, 215, 0),
        font: "monospace",
        fixed: true,
      });
      
      const healthPercent = player.combat.health / player.combat.maxHealth;
      
      // Background
      k.drawRect({
        pos: k.vec2(barX, barY),
        width: barWidth + 4,
        height: barHeight + 4,
        color: k.rgb(0, 0, 0),
        opacity: 0.7,
        fixed: true,
      });
      
      // Border
      k.drawRect({
        pos: k.vec2(barX, barY),
        width: barWidth + 4,
        height: barHeight + 4,
        color: k.rgb(255, 215, 0),
        opacity: 1,
        outline: { width: 3, color: k.rgb(255, 215, 0) },
        fill: false,
        fixed: true,
      });
      
      // Health fill
      let healthColor;
      if (healthPercent > 0.6) {
        healthColor = k.rgb(34, 197, 94); // Green
      } else if (healthPercent > 0.3) {
        healthColor = k.rgb(245, 158, 11); // Orange
      } else {
        healthColor = k.rgb(239, 68, 68); // Red
      }
      
      k.drawRect({
        pos: k.vec2(barX + 2, barY + 2),
        width: barWidth * healthPercent,
        height: barHeight,
        color: healthColor,
        fixed: true,
      });
      
      // Health text (using monospace font to match other UI elements)
      k.drawText({
        text: `❤️ ${Math.ceil(player.combat.health)} / ${player.combat.maxHealth}`,
        pos: k.vec2(barX + 10, barY + 5),
        size: 10,
        color: k.rgb(255, 255, 255),
        font: "monospace",
        fixed: true,
      });
    }
    
    // Draw enemy health bars
    const enemies = k.get("enemy");
    enemies.forEach(enemy => {
      if (enemy.combat && !enemy.combat.isDead && enemy.exists()) {
        const enemyHealth = enemy.combat.health;
        const enemyMaxHealth = enemy.combat.maxHealth;
        const healthPercent = enemyHealth / enemyMaxHealth;
        
        // Only show health bar if enemy is damaged
        if (healthPercent < 1) {
          const barWidth = 30 * scaleFactor;
          const barHeight = 4 * scaleFactor;
          const offsetY = -20 * scaleFactor; // Position above enemy
          
          const worldPos = enemy.worldPos();
          const barX = worldPos.x - barWidth / 2;
          const barY = worldPos.y + offsetY;
          
          // Background
          k.drawRect({
            pos: k.vec2(barX, barY),
            width: barWidth,
            height: barHeight,
            color: k.rgb(0, 0, 0),
            opacity: 0.8,
            fixed: false,
          });
          
          // Health fill
          let healthColor;
          if (healthPercent > 0.6) {
            healthColor = k.rgb(34, 197, 94); // Green
          } else if (healthPercent > 0.3) {
            healthColor = k.rgb(245, 158, 11); // Orange
          } else {
            healthColor = k.rgb(239, 68, 68); // Red
          }
          
          k.drawRect({
            pos: k.vec2(barX, barY),
            width: barWidth * healthPercent,
            height: barHeight,
            color: healthColor,
            opacity: 1,
            fixed: false,
          });
          
          // Border
          k.drawRect({
            pos: k.vec2(barX, barY),
            width: barWidth,
            height: barHeight,
            color: k.rgb(255, 255, 255),
            opacity: 0.5,
            outline: { width: 1, color: k.rgb(255, 255, 255) },
            fill: false,
            fixed: false,
          });
        }
      }
    });
  });
  
  // Check if player is in combat zone
  function checkCombatZone() {
    if (spawnZones.length === 0) return;
    
    const playerX = player.pos.x / scaleFactor;
    const playerY = player.pos.y / scaleFactor;
    
    let inZone = false;
    for (const zone of spawnZones) {
      if (playerX >= zone.x && playerX <= zone.x + zone.width &&
          playerY >= zone.y && playerY <= zone.y + zone.height) {
        inZone = true;
        break;
      }
    }
    
    if (inZone && !isInCombatZone) {
      isInCombatZone = true;
      enemySpawner.activate();
      showCombatAlert("DANGER ZONE: Enemies Ahead!");
    } else if (!inZone && isInCombatZone) {
      isInCombatZone = false;
      enemySpawner.deactivate();
      showCombatAlert("Safe Zone");
    }
  }
  
  // Show combat alert
  function showCombatAlert(message) {
    const alert = document.getElementById("combat-alert");
    const alertText = document.getElementById("combat-alert-text");
    
    if (alert && alertText) {
      alertText.textContent = message;
      alert.style.display = "block";
      
      setTimeout(() => {
        alert.style.display = "none";
      }, 3000);
    }
  }

  // Handle E key press for interaction
  k.onKeyPress("e", () => {
    // Don't interact if dialogue is open or was just closed
    if (player.isInDialogue || wasDialogueJustClosed()) return;
    
    // Check if dialogue UI is visible
    const dialogueUI = document.getElementById("textbox-container");
    if (dialogueUI && dialogueUI.style.display === "block") return;
    
    if (nearbyInteractive && dialogueData[nearbyInteractive]) {
      // Special case: projects should open the project menu
      if (nearbyInteractive === "projects") {
        soundManager.playInteract();
        showProjectsMenu();
        return;
      }
      
      player.isInDialogue = true;
      showInteractionPrompt(false);
      
      // Play interaction sound
      soundManager.playInteract();
      
      displayDialogue(
        dialogueData[nearbyInteractive],
        () => {
          player.isInDialogue = false;
        }
      );
    } else {
      // Play error sound if trying to interact with nothing
      soundManager.playError();
    }
  });
  
  // Handle attack (F key or Left Click on enemy)
  k.onKeyPress("f", () => {
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
            // Pass player position for knockback direction
            enemy.combat.takeDamage(
              COMBAT_CONFIG.playerAttackDamage,
              player,
              COMBAT_CONFIG.playerKnockbackStrength
            );
          }
        }
      });
    }
  });
  
  // Save score to localStorage
  function saveScore(name, score) {
    if (!name || name.trim() === "") {
      name = "Player";
    }
    name = name.trim().substring(0, 20); // Limit name length
    
    const scores = JSON.parse(localStorage.getItem("portfolioScores") || "[]");
    scores.push({
      name: name,
      score: score,
      date: new Date().toISOString()
    });
    
    // Sort by score (highest first) and keep top 10
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, 10);
    
    localStorage.setItem("portfolioScores", JSON.stringify(topScores));
  }
  
  // Respawn function
  function handleRespawn() {
    if (player.combat.isDead) {
      // Save score before respawning
      const nameInput = document.getElementById("playerNameInput");
      const playerName = nameInput ? nameInput.value : "Player";
      saveScore(playerName, player.combat.score);
      
      player.combat.respawn();
      player.combat.score = 0; // Reset score on respawn
      enemySpawner.clear();
      
      // Teleport to spawn point
      for (const layer of mapData.layers) {
        if (layer.name === "spawnpoints") {
          for (const entity of layer.objects) {
            if (entity.name === "player") {
              player.pos = k.vec2(
                (map.pos.x + entity.x) * scaleFactor,
                (map.pos.y + entity.y) * scaleFactor
              );
              break;
            }
          }
        }
      }
    }
  }
  
  // Respawn on R key
  k.onKeyPress("r", () => {
    handleRespawn();
  });
  
  // Respawn button click handler
  const respawnBtn = document.getElementById("respawnBtn");
  if (respawnBtn) {
    respawnBtn.addEventListener("click", () => {
      handleRespawn();
    });
  }
  
  // Allow Enter key to submit name and respawn
  const nameInput = document.getElementById("playerNameInput");
  if (nameInput) {
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && player.combat.isDead) {
        handleRespawn();
      }
    });
  }

  // Also support Space key for interaction
  k.onKeyPress("space", () => {
    // Don't interact if dialogue is open or was just closed
    if (player.isInDialogue || wasDialogueJustClosed()) return;
    
    // Check if dialogue UI is visible
    const dialogueUI = document.getElementById("textbox-container");
    if (dialogueUI && dialogueUI.style.display === "block") return;
    
    if (nearbyInteractive && dialogueData[nearbyInteractive]) {
      // Special case: projects should open the project menu
      if (nearbyInteractive === "projects") {
        soundManager.playInteract();
        showProjectsMenu();
        return;
      }
      
      player.isInDialogue = true;
      showInteractionPrompt(false);
      
      // Play interaction sound
      soundManager.playInteract();
      
      displayDialogue(
        dialogueData[nearbyInteractive],
        () => {
          player.isInDialogue = false;
        }
      );
    } else {
      // Play error sound if trying to interact with nothing
      soundManager.playError();
    }
  });

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.curAnim() !== "walk-up"
    ) {
      player.play("walk-up");
      player.direction = "up";
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== "walk-down"
    ) {
      player.play("walk-down");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "right";
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
      return;
    }
  });

  // Mobile tap interaction removed - use mobile action button instead

  function stopAnims() {
    if (player.direction === "down") {
      player.play("idle-down");
      return;
    }
    if (player.direction === "up") {
      player.play("idle-up");
      return;
    }

    player.play("idle-side");
  }

  k.onMouseRelease(stopAnims);

  k.onKeyRelease(() => {
    stopAnims();
  });

  // Support both Arrow keys and WASD
  k.onKeyDown((key) => {
    const keyMap = [
      k.isKeyDown("right") || k.isKeyDown("d"),  // Right
      k.isKeyDown("left") || k.isKeyDown("a"),   // Left
      k.isKeyDown("up") || k.isKeyDown("w"),     // Up
      k.isKeyDown("down") || k.isKeyDown("s"),   // Down
    ];

    let nbOfKeyPressed = 0;
    for (const key of keyMap) {
      if (key) {
        nbOfKeyPressed++;
      }
    }

    if (nbOfKeyPressed > 1) return;

    if (player.isInDialogue) return;
    
    // Right (Arrow Right or D)
    if (keyMap[0]) {
      player.flipX = false;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "right";
      player.move(player.speed, 0);
      return;
    }

    // Left (Arrow Left or A)
    if (keyMap[1]) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
      player.move(-player.speed, 0);
      return;
    }

    // Up (Arrow Up or W)
    if (keyMap[2]) {
      if (player.curAnim() !== "walk-up") player.play("walk-up");
      player.direction = "up";
      player.move(0, -player.speed);
      return;
    }

    // Down (Arrow Down or S)
    if (keyMap[3]) {
      if (player.curAnim() !== "walk-down") player.play("walk-down");
      player.direction = "down";
      player.move(0, player.speed);
    }
  });
  
  } catch (error) {
    console.error("Error loading game:", error);
    
    // Display error to user
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 30px;
      border-radius: 10px;
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      text-align: center;
      z-index: 10000;
      max-width: 80%;
    `;
    errorDiv.innerHTML = `
      <h2 style="margin-bottom: 20px;">❌ GAME ERROR</h2>
      <p style="margin-bottom: 15px;">Failed to load the game!</p>
      <p style="font-size: 8px; margin-bottom: 20px;">${error.message}</p>
      <button onclick="location.reload()" style="
        background: white;
        color: red;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Press Start 2P', monospace;
        font-size: 10px;
      ">RELOAD PAGE</button>
    `;
    document.body.appendChild(errorDiv);
  }
});

k.go("main");
