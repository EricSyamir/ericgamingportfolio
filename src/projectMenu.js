import { projectsData, getProjectsByCategory, getProjectById } from './projectsData.js';

let currentCategory = 'all';

// Show projects modal
export function showProjectsMenu() {
  const modal = document.getElementById('projectsModal');
  if (modal) {
    modal.style.display = 'flex';
    renderProjects(currentCategory);
  }
}

// Hide projects modal
export function hideProjectsMenu() {
  const modal = document.getElementById('projectsModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Show project detail
function showProjectDetail(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;
  
  const modal = document.getElementById('projectDetailModal');
  const body = document.getElementById('projectDetailBody');
  
  if (!modal || !body) return;
  
  // Build tech tags HTML
  const techTags = project.tech.map(tech => 
    `<span class="project-detail-tech-tag">${tech}</span>`
  ).join('');
  
  // Determine if link is external or internal
  const isExternal = project.link.startsWith('http');
  const linkTarget = isExternal ? '_blank' : '_self';
  
  body.innerHTML = `
    <h2 class="project-detail-title">${project.title}</h2>
    <p style="font-size: 8px; color: var(--text-muted); margin-bottom: 20px;">${project.category} • ${project.year}</p>
    
    <div class="project-detail-desc">
      <p style="margin-bottom: 15px;">${project.description}</p>
      <p>${project.longDescription}</p>
    </div>
    
    <div class="project-detail-tech">
      ${techTags}
    </div>
    
    <a href="${project.link}" target="${linkTarget}" class="project-detail-link">
      ${isExternal ? '🔗 VIEW ON GITHUB' : '📱 VIEW PROJECT'}
    </a>
  `;
  
  modal.style.display = 'flex';
}

// Hide project detail
function hideProjectDetail() {
  const modal = document.getElementById('projectDetailModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Render projects grid
function renderProjects(category) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  
  const projects = getProjectsByCategory(category);
  
  grid.innerHTML = projects.map(project => {
    const techTags = project.tech.slice(0, 4).map(tech => 
      `<span class="project-tech-tag">${tech}</span>`
    ).join('');
    
    return `
      <div class="project-card" data-project-id="${project.id}">
        <span class="project-category">${project.category}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">
          ${techTags}
          ${project.tech.length > 4 ? `<span class="project-tech-tag">+${project.tech.length - 4}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  // Add click handlers to project cards
  const cards = grid.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = parseInt(card.dataset.projectId);
      showProjectDetail(projectId);
    });
  });
}

// Initialize event listeners
function initProjectMenu() {
  // Close main modal
  const closeBtn = document.getElementById('projectsClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideProjectsMenu);
  }
  
  // Close detail modal
  const detailCloseBtn = document.getElementById('projectDetailClose');
  if (detailCloseBtn) {
    detailCloseBtn.addEventListener('click', hideProjectDetail);
  }
  
  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update category and render
      currentCategory = btn.dataset.category;
      renderProjects(currentCategory);
    });
  });
  
  // Close modals on outside click
  const projectsModal = document.getElementById('projectsModal');
  const projectDetailModal = document.getElementById('projectDetailModal');
  
  if (projectsModal) {
    projectsModal.addEventListener('click', (e) => {
      if (e.target === projectsModal) {
        hideProjectsMenu();
      }
    });
  }
  
  if (projectDetailModal) {
    projectDetailModal.addEventListener('click', (e) => {
      if (e.target === projectDetailModal) {
        hideProjectDetail();
      }
    });
  }
  
  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectDetailModal && projectDetailModal.style.display === 'flex') {
        hideProjectDetail();
      } else if (projectsModal && projectsModal.style.display === 'flex') {
        hideProjectsMenu();
      }
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectMenu);
} else {
  initProjectMenu();
}

// Export for use in main.js
export { initProjectMenu };

