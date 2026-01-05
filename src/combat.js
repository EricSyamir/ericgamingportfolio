import { k } from "./kaboomCtx";
import { soundManager } from "./sounds";

// Combat configuration
export const COMBAT_CONFIG = {
  playerMaxHealth: 100,
  playerAttackDamage: 20,
  playerAttackRange: 50,
  playerAttackCooldown: 0.5, // seconds
  playerKnockbackStrength: 40, // pixels
  
  slimeMaxHealth: 40,
  slimeAttackDamage: 10,
  slimeSpeed: 50,
  slimeAggroRange: 120,
  slimeAttackRange: 20,
  slimeAttackCooldown: 1.5,
  
  respawnTime: 4, // seconds
  maxSlimes: 8,
};

// Player combat state
export class PlayerCombat {
  constructor(player) {
    this.player = player;
    this.health = COMBAT_CONFIG.playerMaxHealth;
    this.maxHealth = COMBAT_CONFIG.playerMaxHealth;
    this.canAttack = true;
    this.isAttacking = false;
    this.isDead = false;
    this.score = 0;
    this.onScoreChange = null; // Callback for score changes
  }
  
  addScore(points) {
    this.score += points;
    if (this.onScoreChange) {
      this.onScoreChange(this.score);
    }
  }

  takeDamage(damage) {
    if (this.isDead) return;
    
    this.health = Math.max(0, this.health - damage);
    soundManager.playError(); // Use error sound for damage
    
    // Flash effect
    this.player.color = k.rgb(255, 100, 100);
    k.wait(0.1, () => {
      if (this.player.exists()) {
        this.player.color = k.rgb(255, 255, 255);
      }
    });
    
    if (this.health <= 0) {
      this.die();
    }
    
    return this.health;
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    return this.health;
  }

  attack() {
    if (!this.canAttack || this.isAttacking || this.isDead) return false;
    
    this.isAttacking = true;
    this.canAttack = false;
    
    // Play attack sound
    soundManager.playInteract();
    
    // Attack animation (visual feedback)
    const originalScale = this.player.scale;
    this.player.scale = k.vec2(originalScale.x * 1.2, originalScale.y * 1.2);
    
    k.wait(0.1, () => {
      if (this.player.exists()) {
        this.player.scale = originalScale;
        this.isAttacking = false;
      }
    });
    
    // Cooldown
    k.wait(COMBAT_CONFIG.playerAttackCooldown, () => {
      this.canAttack = true;
    });
    
    return true;
  }

  die() {
    if (this.isDead) return;
    
    this.isDead = true;
    soundManager.playDialogueClose();
    
    // Show respawn modal with score
    const respawnModal = document.getElementById("respawnModal");
    const finalScoreEl = document.getElementById("finalScore");
    const nameInput = document.getElementById("playerNameInput");
    const leaderboardContainer = document.getElementById("leaderboard");
    
    if (respawnModal) {
      if (finalScoreEl) {
        finalScoreEl.textContent = this.score;
      }
      if (nameInput) {
        nameInput.value = "";
        nameInput.focus();
        // Show name input container
        if (nameInput.parentElement) {
          nameInput.parentElement.style.display = "block";
        }
      }
      // Hide leaderboard (will show after name is entered)
      if (leaderboardContainer) {
        leaderboardContainer.classList.add("hidden");
      }
      respawnModal.classList.remove("hidden");
    }
  }

  respawn() {
    this.health = this.maxHealth;
    this.isDead = false;
    this.canAttack = true;
    this.isAttacking = false;
    
    // Hide respawn modal
    const respawnModal = document.getElementById("respawnModal");
    if (respawnModal) {
      respawnModal.classList.add("hidden");
    }
    
    soundManager.playDialogueOpen();
  }
}

// Slime enemy class
export class Slime {
  constructor(pos, scaleFactor, combatZones = [], playerScore = 0) {
    this.scaleFactor = scaleFactor;
    this.combatZones = combatZones; // Zones to constrain movement
    
    // Scale difficulty based on player score
    const difficultyMultiplier = 1 + (playerScore / 500);
    const scaledHealth = Math.floor(COMBAT_CONFIG.slimeMaxHealth * difficultyMultiplier);
    const scaledDamage = Math.floor(COMBAT_CONFIG.slimeAttackDamage * difficultyMultiplier);
    const scaledSpeed = COMBAT_CONFIG.slimeSpeed * difficultyMultiplier;
    
    this.health = scaledHealth;
    this.maxHealth = scaledHealth;
    this.attackDamage = scaledDamage;
    this.speed = scaledSpeed;
    this.canAttack = true;
    this.isDead = false;
    this.target = null;
    this.onEnemyKilled = null; // Callback when killed
    
    // Create slime entity
    this.entity = k.add([
      k.sprite("spritesheet", { anim: "slime-idle" }),
      k.pos(pos),
      k.area({ scale: 0.8 }),
      k.anchor("center"),
      k.scale(scaleFactor),
      k.color(255, 255, 255),
      k.z(10),
      "slime",
      "enemy",
      {
        combat: this,
      },
    ]);
    
    this.setupAI();
  }

  setupAI() {
    this.entity.onUpdate(() => {
      if (this.isDead || !this.target) return;
      
      const player = this.target;
      if (!player.exists()) return;
      
      const dist = this.entity.pos.dist(player.pos);
      
      // Check if in aggro range
      if (dist > COMBAT_CONFIG.slimeAggroRange * this.scaleFactor) {
        return;
      }
      
      // Attack if in range
      if (dist < COMBAT_CONFIG.slimeAttackRange * this.scaleFactor) {
        this.attack(player);
        return;
      }
      
      // Move towards player (use scaled speed)
      const direction = player.pos.sub(this.entity.pos).unit();
      const moveAmount = this.speed * this.scaleFactor;
      const newPos = this.entity.pos.add(direction.scale(moveAmount));
      
      // Check if new position is within combat zone boundaries
      if (this.combatZones.length > 0) {
        const newX = newPos.x / this.scaleFactor;
        const newY = newPos.y / this.scaleFactor;
        let inZone = false;
        
        for (const zone of this.combatZones) {
          if (newX >= zone.x && newX <= zone.x + zone.width &&
              newY >= zone.y && newY <= zone.y + zone.height) {
            inZone = true;
            break;
          }
        }
        
        // Only move if staying within combat zone
        if (inZone) {
          this.entity.move(direction.scale(moveAmount));
        }
      } else {
        // No zone constraints, move freely
        this.entity.move(direction.scale(moveAmount));
      }
      
      // Animate
      if (this.entity.curAnim() !== "slime-move") {
        this.entity.play("slime-move");
      }
    });
  }

  takeDamage(damage, knockbackSource = null, knockbackStrength = null) {
    if (this.isDead) return;
    
    this.health = Math.max(0, this.health - damage);
    
    // Flash effect
    this.entity.color = k.rgb(255, 100, 100);
    k.wait(0.1, () => {
      if (this.entity.exists()) {
        this.entity.color = k.rgb(255, 255, 255);
      }
    });
    
    // Knockback - push enemy away from attack source
    if (!this.isDead && this.entity.exists()) {
      let knockbackDir = null;
      let knockbackAmount = 0;
      
      // Use provided knockback source (player position) if available
      if (knockbackSource && knockbackSource.exists()) {
        knockbackDir = this.entity.pos.sub(knockbackSource.pos).unit();
        knockbackAmount = (knockbackStrength || COMBAT_CONFIG.playerKnockbackStrength) * this.scaleFactor;
      } 
      // Otherwise use target position (fallback for other damage sources)
      else if (this.target && this.target.exists()) {
        knockbackDir = this.entity.pos.sub(this.target.pos).unit();
        knockbackAmount = COMBAT_CONFIG.playerKnockbackStrength * this.scaleFactor;
      }
      
      if (knockbackDir) {
        const startPos = this.entity.pos;
        const endPos = startPos.add(knockbackDir.scale(knockbackAmount));
        
        // Smooth knockback animation
        k.tween(
          startPos,
          endPos,
          0.15,
          (val) => {
            if (this.entity.exists()) {
              this.entity.pos = val;
            }
          },
          k.easings.easeOutQuad
        );
      }
    }
    
    if (this.health <= 0) {
      this.die();
    }
    
    return this.health;
  }

  attack(player) {
    if (!this.canAttack || this.isDead) return;
    
    this.canAttack = false;
    
    // Deal damage to player (use scaled damage)
    if (player.combat) {
      player.combat.takeDamage(this.attackDamage);
    }
    
    // Attack animation
    const originalScale = this.entity.scale;
    this.entity.scale = k.vec2(originalScale.x * 1.3, originalScale.y * 1.3);
    
    k.wait(0.2, () => {
      if (this.entity.exists()) {
        this.entity.scale = originalScale;
      }
    });
    
    // Cooldown
    k.wait(COMBAT_CONFIG.slimeAttackCooldown, () => {
      this.canAttack = true;
    });
  }

  die() {
    if (this.isDead) return;
    
    this.isDead = true;
    soundManager.playDialogueNext();
    
    // Award score points when slime is killed
    if (this.onEnemyKilled) {
      this.onEnemyKilled(100); // 100 points per slime
    }
    
    // Death animation
    this.entity.color = k.rgb(150, 150, 150);
    k.tween(
      this.entity.scale.x,
      0,
      0.3,
      (val) => {
        if (this.entity.exists()) {
          this.entity.scale = k.vec2(val, val);
        }
      },
      k.easings.easeInQuad
    );
    
    k.wait(0.3, () => {
      if (this.entity.exists()) {
        this.entity.destroy();
      }
    });
  }

  setTarget(target) {
    this.target = target;
  }
}

// Enemy spawner
export class EnemySpawner {
  constructor(k, scaleFactor, spawnZones, combatZones = []) {
    this.k = k;
    this.scaleFactor = scaleFactor;
    this.spawnZones = spawnZones;
    this.combatZones = combatZones; // Zones where enemies are constrained
    this.enemies = [];
    this.player = null;
    this.isActive = false;
    this.spawnTimer = 0;
    this.onEnemyKilled = null; // Callback when enemy is killed
  }

  setPlayer(player) {
    this.player = player;
  }
  
  setOnEnemyKilled(callback) {
    this.onEnemyKilled = callback;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  update(dt) {
    if (!this.isActive || !this.player) return;
    
    // Remove dead enemies
    this.enemies = this.enemies.filter(e => e.entity.exists() && !e.isDead);
    
    // Calculate difficulty scaling based on player score
    const playerScore = this.player.combat ? this.player.combat.score : 0;
    const difficultyMultiplier = 1 + (playerScore / 500); // Increases difficulty every 500 points
    const scaledSpawnRate = Math.max(1, COMBAT_CONFIG.respawnTime / difficultyMultiplier); // Faster spawning
    const scaledMaxEnemies = Math.min(15, Math.floor(COMBAT_CONFIG.maxSlimes * difficultyMultiplier)); // More enemies
    
    // Spawn new enemies with scaled difficulty
    this.spawnTimer += dt;
    if (this.spawnTimer >= scaledSpawnRate && this.enemies.length < scaledMaxEnemies) {
      this.spawnEnemy(playerScore);
      this.spawnTimer = 0;
    }
  }

  spawnEnemy(playerScore = 0) {
    if (this.spawnZones.length === 0 || !this.player) return;
    
    // Pick random spawn zone
    const zone = this.k.choose(this.spawnZones);
    
    // Get player position (use actual player pos, not camera)
    const playerPos = this.player.pos;
    
    // Spawn much farther from player - at least 300 pixels away
    const minDistance = 300 * this.scaleFactor;
    const maxAttempts = 20;
    let spawnPos;
    let attempts = 0;
    
    do {
      // Spawn at a random edge of the combat zone or far from player
      const side = Math.floor(Math.random() * 4);
      const angle = Math.random() * Math.PI * 2; // Random angle
      const distance = minDistance + Math.random() * 200 * this.scaleFactor; // 300-500 pixels away
      
      switch (side) {
        case 0: // Top
          spawnPos = this.k.vec2(
            playerPos.x + (Math.random() - 0.5) * 600 * this.scaleFactor,
            playerPos.y - distance
          );
          break;
        case 1: // Right
          spawnPos = this.k.vec2(
            playerPos.x + distance,
            playerPos.y + (Math.random() - 0.5) * 600 * this.scaleFactor
          );
          break;
        case 2: // Bottom
          spawnPos = this.k.vec2(
            playerPos.x + (Math.random() - 0.5) * 600 * this.scaleFactor,
            playerPos.y + distance
          );
          break;
        case 3: // Left
          spawnPos = this.k.vec2(
            playerPos.x - distance,
            playerPos.y + (Math.random() - 0.5) * 600 * this.scaleFactor
          );
          break;
      }
      
      attempts++;
    } while (attempts < maxAttempts && spawnPos.dist(playerPos) < minDistance);
    
    // Ensure spawn position is within combat zones if zones exist
    if (this.combatZones.length > 0) {
      const spawnX = spawnPos.x / this.scaleFactor;
      const spawnY = spawnPos.y / this.scaleFactor;
      let inZone = false;
      
      for (const combatZone of this.combatZones) {
        if (spawnX >= combatZone.x && spawnX <= combatZone.x + combatZone.width &&
            spawnY >= combatZone.y && spawnY <= combatZone.y + combatZone.height) {
          inZone = true;
          break;
        }
      }
      
      // If not in zone, find a position in the zone that's far from player
      if (!inZone && this.combatZones.length > 0) {
        const zone = this.k.choose(this.combatZones);
        const zoneCenterX = (zone.x + zone.width / 2) * this.scaleFactor;
        const zoneCenterY = (zone.y + zone.height / 2) * this.scaleFactor;
        
        // Spawn at edge of zone, far from player
        const angle = Math.atan2(playerPos.y - zoneCenterY, playerPos.x - zoneCenterX) + Math.PI; // Opposite direction
        spawnPos = this.k.vec2(
          zoneCenterX + Math.cos(angle) * Math.min(zone.width, zone.height) * this.scaleFactor * 0.4,
          zoneCenterY + Math.sin(angle) * Math.min(zone.width, zone.height) * this.scaleFactor * 0.4
        );
      }
    }
    
    const slime = new Slime(spawnPos, this.scaleFactor, this.combatZones, playerScore);
    slime.setTarget(this.player);
    if (this.onEnemyKilled) {
      slime.onEnemyKilled = this.onEnemyKilled;
    }
    this.enemies.push(slime);
  }

  clear() {
    this.enemies.forEach(e => {
      if (e.entity.exists()) {
        e.entity.destroy();
      }
    });
    this.enemies = [];
  }
}

