// =========================================
// 1. Project Data
// =========================================
const projects = [
  {
    id: 'levelpage',
    title: 'LevelPage (AccessAble AI)',
    category: 'web',
    categoryLabel: 'Web & Accessibility',
    summary:
      'Multi-sensory web document reader adapting PDFs and scanned notes with English/Hindi OCR, OpenDyslexic fonts, Bionic Reading, and Text-to-Speech.',
    description:
      'Built to make dense academic PDFs and scanned handwritten notes accessible for neurodivergent readers. Combines server-side PDF extraction and Tesseract OCR with real-time browser typography controls and synchronized Web Speech synthesis.',
    stack: ['Python', 'Flask', 'PyMuPDF', 'Tesseract OCR', 'JavaScript'],
    highlights: [
      'Dual-language OCR pipeline supporting both English and Hindi scanned documents.',
      'Real-time Bionic Reading & OpenDyslexic font toggles without page reloads.',
      'Client-side Web Speech API narration with adjustable reading speed.'
    ],
    mediaType: 'placeholder',
    mediaSrc: 'assets/levelpage-demo.png',
    repoUrl: 'https://github.com'
  },
  {
    id: 'gesture-controller',
    title: 'Computer-Vision Gesture Controller',
    category: 'ai',
    categoryLabel: 'AI & Computer Vision',
    summary:
      'Real-time webcam hand-tracking pipeline using OpenCV and MediaPipe to map hand landmarks into low-latency keyboard controls.',
    description:
      'A real-time computer-vision input bridge that tracks 21 hand landmarks per frame over a standard webcam and translates finger distances and gestures into OS-level keyboard events for hands-free game control.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'pynput'],
    highlights: [
      'Sub-30ms frame processing loop using MediaPipe Hands landmark detection.',
      'Configurable gesture thresholds to prevent accidental key triggers.',
      'Tested live on PC gaming workflows with visual landmark overlay debugging.'
    ],
    mediaType: 'placeholder',
    mediaSrc: 'assets/gesture-demo.mp4',
    repoUrl: 'https://github.com'
  },
  {
    id: 'esp8266-telemetry',
    title: 'ESP8266 Serial & Telemetry Bridge',
    category: 'security',
    categoryLabel: 'Security & Hardware',
    summary:
      'Microcontroller-to-PC serial communication bridge built with ESP8266 and PySerial for real-time hardware monitoring and sensor logging.',
    description:
      'Developed during hands-on IoT/AI workshop tracks to stream structured sensor packets from an ESP8266 microcontroller over UART/Serial into a Python processing script for anomaly checks and telemetry logging.',
    stack: ['ESP8266', 'Arduino C++', 'Python', 'PySerial', 'IoT'],
    highlights: [
      'Structured serial packet framing between ESP8266 firmware and Python host.',
      'Live telemetry parsing with threshold alerts for abnormal sensor spikes.',
      'Modular architecture adaptable for local ML inference pipelines.'
    ],
    mediaType: 'placeholder',
    mediaSrc: 'assets/esp8266-setup.jpg',
    repoUrl: 'https://github.com'
  }
];

// =========================================
// 2. Render Project Cards & Category Filter
// =========================================
const projectGrid = document.getElementById('project-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

function buildMediaHTML(project, isModal = false) {
  if (project.mediaType === 'video') {
    return `<video src="${project.mediaSrc}" autoplay loop muted playsinline ${isModal ? 'controls' : ''}></video>`;
  }
  if (project.mediaType === 'image') {
    return `<img src="${project.mediaSrc}" alt="${project.title} preview" loading="lazy" />`;
  }
  return '';
}

function renderProjects(filter = 'all') {
  if (!projectGrid) return;

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  projectGrid.innerHTML = filtered.map(project => `
    <article class="project-card" data-id="${project.id}" tabindex="0" role="button" aria-label="Open details for ${project.title}">
      ${project.mediaType !== 'placeholder' ? `<div class="card-media">${buildMediaHTML(project, false)}</div>` : ''}
      <div class="card-body">
        <div class="card-top">
          <span class="card-category">${project.categoryLabel}</span>
          <span class="card-arrow">↗</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="tag-list">
          ${project.stack.map(tech => `<span class="tag">${tech}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card.dataset.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(card.dataset.id);
      }
    });
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

// =========================================
// 3. Project Detail Modal
// =========================================
const projectModal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close');

function openProjectModal(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project || !projectModal) return;

  document.getElementById('modal-category').textContent = project.categoryLabel;
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-description').textContent = project.description;

  const modalMedia = document.getElementById('modal-media');
  if (project.mediaType === 'placeholder') {
    modalMedia.style.display = 'none';
    modalMedia.innerHTML = '';
  } else {
    modalMedia.style.display = 'flex';
    modalMedia.innerHTML = buildMediaHTML(project, true);
  }

  const highlightsList = document.getElementById('modal-highlights');
  highlightsList.innerHTML = project.highlights.map(item => `<li>${item}</li>`).join('');

  const stackContainer = document.getElementById('modal-stack');
  stackContainer.innerHTML = project.stack.map(tech => `<span class="tag">${tech}</span>`).join('');

  const repoLink = document.getElementById('modal-repo-link');
  repoLink.href = project.repoUrl;

  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeProjectModal);
}
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });
}

// =========================================
// 4. Copy Email with Toast Feedback
// =========================================
const toast = document.getElementById('toast');
let toastTimeout;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function copyEmail(email) {
  navigator.clipboard.writeText(email).then(() => {
    showToast(`Copied ${email} to clipboard`);
  }).catch(() => {
    showToast(`Email: ${email}`);
  });
}

['copy-email-hero', 'copy-email-footer'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', () => copyEmail(btn.dataset.email));
  }
});

// =========================================
// 5. Command Palette (Ctrl+K / Cmd+K)
// =========================================
const cmdPalette = document.getElementById('command-palette');
const cmdTrigger = document.getElementById('cmd-trigger');
const cmdInput = document.getElementById('cmd-input');
const cmdList = document.getElementById('cmd-list');

const commands = [
  { label: 'Go to Projects & Builds', shortcut: 'SEC 01', action: () => scrollToSection('#projects') },
  { label: 'Go to Education & Milestones', shortcut: 'SEC 02', action: () => scrollToSection('#education') },
  { label: 'Go to Technical Stack', shortcut: 'SEC 03', action: () => scrollToSection('#skills') },
  { label: 'Go to Contact', shortcut: 'SEC 04', action: () => scrollToSection('#contact') },
  { label: 'Copy Email Address', shortcut: 'EMAIL', action: () => copyEmail('sakshamc2707@gmail.com') },
  { label: 'Open GitHub Profile', shortcut: 'LINK', action: () => window.open('https://github.com', '_blank') },
  { label: 'Open LinkedIn Profile', shortcut: 'LINK', action: () => window.open('https://www.linkedin.com/in/saksham-chauhan-564a623b9', '_blank') }
];

function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function renderCommands(query = '') {
  if (!cmdList) return;
  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  cmdList.innerHTML = filtered.map((cmd, idx) => `
    <li class="cmd-item" data-index="${idx}">
      <span>${cmd.label}</span>
      <span class="cmd-shortcut">${cmd.shortcut}</span>
    </li>
  `).join('');

  cmdList.querySelectorAll('.cmd-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      filtered[idx].action();
      closeCommandPalette();
    });
  });
}

function openCommandPalette() {
  if (!cmdPalette || !cmdInput) return;
  cmdPalette.classList.add('open');
  cmdPalette.setAttribute('aria-hidden', 'false');
  cmdInput.value = '';
  renderCommands();
  setTimeout(() => cmdInput.focus(), 50);
}

function closeCommandPalette() {
  if (!cmdPalette) return;
  cmdPalette.classList.remove('open');
  cmdPalette.setAttribute('aria-hidden', 'true');
}

if (cmdTrigger) cmdTrigger.addEventListener('click', openCommandPalette);
if (cmdInput) cmdInput.addEventListener('input', (e) => renderCommands(e.target.value));
if (cmdPalette) {
  cmdPalette.addEventListener('click', (e) => {
    if (e.target === cmdPalette) closeCommandPalette();
  });
}

// =========================================
// 6. Smart Scroll Toggle Button
// =========================================
const scrollToggleBtn = document.getElementById('scroll-toggle');
const scrollArrow = document.getElementById('scroll-arrow');

function updateScrollButton() {
  if (!scrollToggleBtn || !scrollArrow) return;
  const scrolled = window.scrollY;
  const halfPage = (document.documentElement.scrollHeight - window.innerHeight) / 2;

  if (scrolled > halfPage) {
    scrollArrow.textContent = '↑';
    scrollToggleBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToggleBtn.dataset.direction = 'up';
  } else {
    scrollArrow.textContent = '↓';
    scrollToggleBtn.setAttribute('aria-label', 'Scroll to bottom');
    scrollToggleBtn.dataset.direction = 'down';
  }
}

if (scrollToggleBtn) {
  scrollToggleBtn.addEventListener('click', () => {
    if (scrollToggleBtn.dataset.direction === 'up') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  });
}

window.addEventListener('scroll', updateScrollButton, { passive: true });

// =========================================
// 7. Global Keyboard Shortcuts & Init
// =========================================
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (cmdPalette && cmdPalette.classList.contains('open')) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
  }
  if (e.key === 'Escape') {
    closeProjectModal();
    closeCommandPalette();
  }
});

renderProjects('all');
updateScrollButton();
// =========================================
// 8. Interactive Hero Image Pixelator
// =========================================
const runBtn = document.getElementById('run-btn');
const resetBtn = document.getElementById('reset-btn');
const ideView = document.getElementById('ide-view');
const outputView = document.getElementById('output-view');
const rawPhoto = document.getElementById('raw-photo');
const pixelatedPhoto = document.getElementById('pixelated-photo');
const outputStatus = document.getElementById('output-status');
const statusPulse = document.getElementById('status-pulse');
const glitchOverlay = document.getElementById('glitch-overlay');

function runPixelator() {
  if (!runBtn || !ideView || !outputView) return;
  
  // Transition views
  ideView.classList.add('hidden');
  outputView.classList.remove('open', 'hidden');
  
  // Reset output view elements
  rawPhoto.classList.remove('hidden');
  pixelatedPhoto.classList.add('hidden');
  glitchOverlay.classList.add('hidden');
  
  outputStatus.textContent = 'Allocating memory & loading image...';
  statusPulse.style.background = '#f59e0b'; // Amber pulse
  
  // Phase 1: Show original image loading (Simulation)
  setTimeout(() => {
    outputStatus.textContent = 'Applying 16-bit Downsampling & Dithering...';
    
    // Phase 2: Render pixelated image (Reveal image_5.png!)
    setTimeout(() => {
      rawPhoto.classList.add('hidden');
      pixelatedPhoto.classList.remove('hidden');
      glitchOverlay.classList.remove('hidden');
      outputStatus.textContent = 'SUCCESS: me-pixel.png rendered (35ms)';
      statusPulse.style.background = '#10b981'; // Green pulse (success)
    }, 1200);
    
  }, 900);
}

function resetPixelator() {
  if (!ideView || !outputView) return;
  ideView.classList.remove('hidden');
  outputView.classList.add('hidden');
  statusPulse.style.background = '#ef4444'; // Red pulse
}

if (runBtn) runBtn.addEventListener('click', runPixelator);
if (resetBtn) resetBtn.addEventListener('click', resetPixelator);
