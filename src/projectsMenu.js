import { projectsData } from "./constants";
import { soundManager } from "./sounds";

let isProjectsMenuOpen = false;
let currentProjectIndex = 0;
let videoPreloaded = {};

// Preload all videos
export function preloadVideos() {
  projectsData.forEach((project, index) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.src = project.video;
    video.addEventListener('canplaythrough', () => {
      videoPreloaded[index] = true;
    });
    video.addEventListener('error', () => {
      console.log(`Video ${index} failed to load: ${project.video}`);
      videoPreloaded[index] = 'error';
    });
    video.load();
  });
}

// Create the projects menu modal
function createProjectsMenuHTML() {
  const modal = document.createElement('div');
  modal.id = 'projects-menu-modal';
  modal.className = 'projects-menu-modal';
  modal.innerHTML = `
    <div class="projects-menu-container">
      <div class="projects-menu-header">
        <h2>🚀 MY PROJECTS</h2>
        <button class="projects-close-btn" id="projects-close-btn">✕</button>
      </div>
      <div class="projects-content">
        <div class="projects-sidebar">
          <div class="projects-list" id="projects-list">
            ${projectsData.map((project, index) => `
              <div class="project-list-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                <span class="project-number">${index + 1}</span>
                <span class="project-list-title">${project.title}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="projects-main">
          <div class="project-video-wrapper" id="project-video-wrapper">
            <div class="video-loading">Loading video...</div>
            <video id="project-video" muted loop playsinline>
              <source src="${projectsData[0].video}" type="video/mp4">
            </video>
          </div>
          <div class="project-details" id="project-details">
            <h3 class="project-detail-title" id="project-title">${projectsData[0].title}</h3>
            <p class="project-detail-desc" id="project-desc">${projectsData[0].description}</p>
            <div class="project-tech-tags" id="project-tech">
              ${projectsData[0].tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <a href="${projectsData[0].link}" target="_blank" class="project-view-btn" id="project-link">
              View Project →
            </a>
          </div>
        </div>
      </div>
      <div class="projects-nav">
        <button class="project-nav-btn" id="prev-project">◀ Previous</button>
        <span class="project-counter"><span id="current-num">1</span> / ${projectsData.length}</span>
        <button class="project-nav-btn" id="next-project">Next ▶</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  addProjectsMenuStyles();
  attachProjectsMenuEvents();
}

// Add styles for the projects menu
function addProjectsMenuStyles() {
  if (document.getElementById('projects-menu-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'projects-menu-styles';
  style.textContent = `
    .projects-menu-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      justify-content: center;
      align-items: center;
      font-family: 'Press Start 2P', monospace;
    }

    .projects-menu-modal.open {
      display: flex;
    }

    .projects-menu-container {
      width: 95%;
      max-width: 1200px;
      max-height: 90vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 4px solid #00d9ff;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 40px rgba(0, 217, 255, 0.3);
    }

    .projects-menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: #0f3460;
      border-bottom: 3px solid #00d9ff;
    }

    .projects-menu-header h2 {
      color: #00d9ff;
      font-size: 16px;
      margin: 0;
    }

    .projects-close-btn {
      background: #ff4444;
      color: #fff;
      border: none;
      width: 40px;
      height: 40px;
      font-size: 18px;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.3s;
    }

    .projects-close-btn:hover {
      background: #ff6666;
      transform: scale(1.1);
    }

    .projects-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .projects-sidebar {
      width: 280px;
      background: #0f3460;
      border-right: 2px solid #00d9ff;
      overflow-y: auto;
    }

    .projects-list {
      padding: 10px;
    }

    .project-list-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      background: rgba(0, 217, 255, 0.1);
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
    }

    .project-list-item:hover {
      background: rgba(0, 217, 255, 0.2);
      border-color: #00d9ff;
    }

    .project-list-item.active {
      background: #00d9ff;
      color: #000;
    }

    .project-number {
      background: #00d9ff;
      color: #000;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
    }

    .project-list-item.active .project-number {
      background: #000;
      color: #00d9ff;
    }

    .project-list-title {
      font-size: 9px;
      line-height: 1.4;
    }

    .projects-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      overflow-y: auto;
    }

    .project-video-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      border: 3px solid #00d9ff;
      margin-bottom: 20px;
    }

    .project-video-wrapper video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #00d9ff;
      font-size: 10px;
      z-index: 1;
    }

    .project-video-wrapper video.loaded + .video-loading {
      display: none;
    }

    .project-details {
      flex: 1;
    }

    .project-detail-title {
      color: #00d9ff;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .project-detail-desc {
      color: #aaa;
      font-size: 10px;
      line-height: 1.8;
      margin-bottom: 15px;
    }

    .project-tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .tech-tag {
      background: rgba(0, 217, 255, 0.2);
      color: #00d9ff;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 8px;
      border: 1px solid #00d9ff;
    }

    .project-view-btn {
      display: inline-block;
      background: #00d9ff;
      color: #000;
      padding: 12px 24px;
      text-decoration: none;
      font-size: 10px;
      font-weight: bold;
      border-radius: 6px;
      transition: all 0.3s;
    }

    .project-view-btn:hover {
      background: #00ff88;
      transform: scale(1.05);
    }

    .projects-nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 15px;
      background: #0f3460;
      border-top: 2px solid #00d9ff;
    }

    .project-nav-btn {
      background: rgba(0, 217, 255, 0.2);
      color: #00d9ff;
      border: 2px solid #00d9ff;
      padding: 10px 20px;
      font-size: 10px;
      cursor: pointer;
      border-radius: 4px;
      font-family: 'Press Start 2P', monospace;
      transition: all 0.2s;
    }

    .project-nav-btn:hover {
      background: #00d9ff;
      color: #000;
    }

    .project-counter {
      color: #00d9ff;
      font-size: 10px;
    }

    /* Scrollbar styling */
    .projects-sidebar::-webkit-scrollbar,
    .projects-main::-webkit-scrollbar {
      width: 8px;
    }

    .projects-sidebar::-webkit-scrollbar-track,
    .projects-main::-webkit-scrollbar-track {
      background: #0f3460;
    }

    .projects-sidebar::-webkit-scrollbar-thumb,
    .projects-main::-webkit-scrollbar-thumb {
      background: #00d9ff;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .projects-content {
        flex-direction: column;
      }
      
      .projects-sidebar {
        width: 100%;
        max-height: 150px;
        border-right: none;
        border-bottom: 2px solid #00d9ff;
      }
      
      .projects-list {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding: 10px;
      }
      
      .project-list-item {
        flex-shrink: 0;
        margin-bottom: 0;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Attach event listeners
function attachProjectsMenuEvents() {
  const modal = document.getElementById('projects-menu-modal');
  const closeBtn = document.getElementById('projects-close-btn');
  const prevBtn = document.getElementById('prev-project');
  const nextBtn = document.getElementById('next-project');
  const listItems = document.querySelectorAll('.project-list-item');

  closeBtn.addEventListener('click', closeProjectsMenu);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectsMenu();
    }
  });

  prevBtn.addEventListener('click', () => {
    currentProjectIndex = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
    updateProjectDisplay();
    soundManager.playDialogueNext();
  });

  nextBtn.addEventListener('click', () => {
    currentProjectIndex = (currentProjectIndex + 1) % projectsData.length;
    updateProjectDisplay();
    soundManager.playDialogueNext();
  });

  listItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentProjectIndex = index;
      updateProjectDisplay();
      soundManager.playDialogueNext();
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!isProjectsMenuOpen) return;
    
    if (e.key === 'Escape') {
      closeProjectsMenu();
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      currentProjectIndex = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
      updateProjectDisplay();
      soundManager.playDialogueNext();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      currentProjectIndex = (currentProjectIndex + 1) % projectsData.length;
      updateProjectDisplay();
      soundManager.playDialogueNext();
    }
  });
}

// Update the project display
function updateProjectDisplay() {
  const project = projectsData[currentProjectIndex];
  const video = document.getElementById('project-video');
  const wrapper = document.getElementById('project-video-wrapper');
  
  // Update list items
  document.querySelectorAll('.project-list-item').forEach((item, index) => {
    item.classList.toggle('active', index === currentProjectIndex);
  });

  // Show loading
  wrapper.querySelector('.video-loading').style.display = 'block';
  video.classList.remove('loaded');

  // Update video
  video.src = project.video;
  video.load();
  
  video.oncanplaythrough = () => {
    wrapper.querySelector('.video-loading').style.display = 'none';
    video.classList.add('loaded');
    video.play().catch(() => {});
  };

  video.onerror = () => {
    wrapper.querySelector('.video-loading').textContent = 'Video unavailable';
  };

  // Update details
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-desc').textContent = project.description;
  document.getElementById('project-tech').innerHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  document.getElementById('project-link').href = project.link;
  document.getElementById('current-num').textContent = currentProjectIndex + 1;
}

// Open the projects menu
export function openProjectsMenu() {
  if (!document.getElementById('projects-menu-modal')) {
    createProjectsMenuHTML();
  }

  const modal = document.getElementById('projects-menu-modal');
  modal.classList.add('open');
  isProjectsMenuOpen = true;
  currentProjectIndex = 0;
  updateProjectDisplay();
  soundManager.playDialogueOpen();
}

// Close the projects menu
export function closeProjectsMenu() {
  const modal = document.getElementById('projects-menu-modal');
  if (modal) {
    modal.classList.remove('open');
  }
  isProjectsMenuOpen = false;
  
  // Pause video
  const video = document.getElementById('project-video');
  if (video) {
    video.pause();
  }
  
  soundManager.playDialogueClose();
}

// Check if projects menu is open
export function isProjectsMenuVisible() {
  return isProjectsMenuOpen;
}
