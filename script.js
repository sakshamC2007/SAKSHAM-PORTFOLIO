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
    category: 'systems',
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
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
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
const closeModalBtn = document.getElementById('close-modal');
const closeModalSecondaryBtn = document.getElementById('close-modal-secondary');

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

  const tagsContainer = document.getElementById('modal-tags');
  tagsContainer.innerHTML = project.stack.map(tech => `<span class="tag">${tech}</span>`).join('');

  const repoLink = document.getElementById('modal-repo-link');
  repoLink.href = project.repoUrl;

  projectModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.add('hidden');
  document.body.style.overflow = '';
}

if (closeModalBtn) closeModalBtn.addEventListener('click', closeProjectModal);
if (closeModalSecondaryBtn) closeModalSecondaryBtn.addEventListener('click', closeProjectModal);
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });
}

// =========================================
// 4. Copy Email with Button Feedback
// =========================================
function copyEmail(email, triggerBtn = null) {
  navigator.clipboard.writeText(email).catch(() => {});

  if (triggerBtn) {
    const labelTarget = triggerBtn.querySelector('span') || triggerBtn;
    const originalText = labelTarget.textContent;
    labelTarget.textContent = 'Copied ✓';
    setTimeout(() => {
      labelTarget.textContent = originalText;
    }, 2000);
  }
}

['copy-email-hero', 'copy-email-footer'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', () => copyEmail(btn.dataset.email, btn));
  }
});

// =========================================
// 5. Command Palette (Ctrl+K / Cmd+K)
// =========================================
const cmdModal = document.getElementById('cmd-modal');
const cmdTrigger = document.getElementById('cmd-trigger');
const cmdInput = document.getElementById('cmd-input');
const cmdResults = document.getElementById('cmd-results');

const commands = [
  { label: 'Go to Projects & Builds', shortcut: 'SEC 01', action: () => scrollToSection('#projects') },
  { label: 'Go to Education & Milestones', shortcut: 'SEC 02', action: () => scrollToSection('#education') },
  { label: 'Go to Technical Stack', shortcut: 'SEC 03', action: () => scrollToSection('#skills') },
  { label: 'Go to Contact', shortcut: 'SEC 04', action: () => scrollToSection('#contact') },
  { label: 'Copy Email Address', shortcut: 'EMAIL', action: () => copyEmail('sakshamc2707@gmail.com', document.getElementById('copy-email-hero')) },
  { label: 'Open GitHub Profile', shortcut: 'LINK', action: () => window.open('https://github.com', '_blank', 'noopener') },
  { label: 'Open LinkedIn Profile', shortcut: 'LINK', action: () => window.open('https://www.linkedin.com/in/saksham-chauhan-564a623b9', '_blank', 'noopener') }
];

function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function renderCommands(query = '') {
  if (!cmdResults) return;
  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  cmdResults.innerHTML = filtered.map((cmd, idx) => `
    <button type="button" class="cmd-item" data-index="${idx}">
      <span>${cmd.label}</span>
      <span class="mono-muted">${cmd.shortcut}</span>
    </button>
  `).join('');

  cmdResults.querySelectorAll('.cmd-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      filtered[idx].action();
      closeCommandPalette();
    });
  });
}

function openCommandPalette() {
  if (!cmdModal || !cmdInput) return;
  cmdModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  cmdInput.value = '';
  renderCommands();
  setTimeout(() => cmdInput.focus(), 40);
}

function closeCommandPalette() {
  if (!cmdModal) return;
  cmdModal.classList.add('hidden');
  document.body.style.overflow = '';
}

if (cmdTrigger) cmdTrigger.addEventListener('click', openCommandPalette);
if (cmdInput) cmdInput.addEventListener('input', (e) => renderCommands(e.target.value));
if (cmdModal) {
  cmdModal.addEventListener('click', (e) => {
    if (e.target === cmdModal) closeCommandPalette();
  });
}

// =========================================
// 6. Brand Button & Global Keyboard Shortcuts
// =========================================
const brandNavBtn = document.getElementById('brand-nav-btn');
if (brandNavBtn) {
  brandNavBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (cmdModal && !cmdModal.classList.contains('hidden')) {
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
