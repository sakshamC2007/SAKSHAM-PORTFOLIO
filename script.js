// Project Data — Add your real media files inside the assets/ folder
// Supported mediaType: 'video' (for .mp4/.webm clips), 'image' (for .png/.jpg/.gif), or 'placeholder'
const projects = [
  {
    id: 'levelpage',
    title: 'LevelPage (AccessAble AI)',
    category: 'web',
    categoryLabel: 'Web & Accessibility',
    summary: 'Multi-sensory web document reader adapting PDFs and scanned notes with English/Hindi OCR, OpenDyslexic fonts, Bionic Reading, and Text-to-Speech.',
    description: 'Built to make dense academic PDFs and scanned handwritten notes accessible for neurodivergent learners. Extracts text via PyMuPDF and Tesseract OCR (English & Hindi) and renders customizable reading modes.',
    highlights: [
      'Dual-engine extraction combining PyMuPDF for native PDFs and Tesseract OCR for scanned pages.',
      'Real-time Bionic Reading, OpenDyslexic typography toggle, and Web Speech API narration.',
      'Lightweight Flask backend containerized with Docker for cloud deployment.'
    ],
    tags: ['Python', 'Flask', 'PyMuPDF', 'Tesseract OCR', 'JavaScript'],
    repoUrl: 'https://github.com',
    mediaType: 'placeholder', // Change to 'image' or 'video' once you add a file to assets/
    mediaSrc: 'assets/levelpage-demo.png',
    placeholderText: '[ Add assets/levelpage-demo.png or .mp4 ]'
  },
  {
    id: 'gesture-controller',
    title: 'Computer-Vision Gesture Controller',
    category: 'ai',
    categoryLabel: 'AI & Computer Vision',
    summary: 'Real-time webcam hand-tracking pipeline using OpenCV and MediaPipe to map hand landmarks into low-latency keyboard controls.',
    description: 'Transforms a standard laptop webcam into a touchless game controller by tracking 21 hand landmarks per frame and translating gesture states into OS-level keystrokes.',
    highlights: [
      'Real-time 21-point hand landmark detection using MediaPipe and OpenCV.',
      'Low-latency keyboard event dispatching via pynput with custom deadzone smoothing.',
      'Tested live on PC gaming workloads with zero external sensor hardware.'
    ],
    tags: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'pynput'],
    repoUrl: 'https://github.com',
    mediaType: 'placeholder', // Change to 'video' and point mediaSrc to 'assets/gesture-demo.mp4'
    mediaSrc: 'assets/gesture-demo.mp4',
    placeholderText: '[ Add assets/gesture-demo.mp4 ]'
  },
  {
    id: 'iot-telemetry',
    title: 'ESP8266 Serial & Telemetry Bridge',
    category: 'systems',
    categoryLabel: 'Security & Hardware',
    summary: 'Microcontroller-to-PC serial communication bridge built with ESP8266 and PySerial for real-time hardware monitoring and sensor logging.',
    description: 'Developed following the SAE NIT Kurukshetra Autokriti 15.0 IoT & AI/ML workshop to stream live sensor packets from ESP8266 boards to Python diagnostic scripts.',
    highlights: [
      'Bi-directional UART serial communication between ESP8266 firmware and Python.',
      'Structured packet parsing for real-time telemetry logging and anomaly checks.',
      'Modular foundation for hardware security and embedded sensor experiments.'
    ],
    tags: ['ESP8266', 'Arduino C++', 'Python', 'PySerial', 'IoT'],
    repoUrl: 'https://github.com',
    mediaType: 'placeholder',
    mediaSrc: 'assets/iot-preview.png',
    placeholderText: '[ Add assets/iot-preview.png ]'
  }
];

// 1. Smart Navbar Brand Toggle ("saksham.codes")
const brandBtn = document.getElementById('brand-nav-btn');
brandBtn.addEventListener('click', () => {
  const educationSection = document.getElementById('education');
  // If already at the top/starter heading, scroll directly to Education & Milestones
  if (window.scrollY <= 80 && educationSection) {
    educationSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Otherwise, scroll straight back to the starter heading at the top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// 2. Render Project Cards & Media Previews
const projectGrid = document.getElementById('project-grid');

function buildMediaHTML(project, isModal = false) {
  if (project.mediaType === 'video') {
    return isModal
      ? `<video src="${project.mediaSrc}" controls autoplay muted loop playsinline></video>`
      : `<video src="${project.mediaSrc}" autoplay muted loop playsinline></video>`;
  }
  if (project.mediaType === 'image') {
    return `<img src="${project.mediaSrc}" alt="${project.title} preview" loading="lazy" />`;
  }
  return `<div class="media-placeholder">${project.placeholderText}</div>`;
}

function renderProjects(filter = 'all') {
  const filtered = filter === 'all'
    ? projects
    : projects.filter((p) => p.category === filter);

  projectGrid.innerHTML = filtered
    .map(
      (project) => `
      <article class="project-card" data-id="${project.id}">
        <div class="card-media">
          ${buildMediaHTML(project, false)}
        </div>
        <div class="card-body">
          <div class="card-top">
            <span class="card-cat">${project.categoryLabel}</span>
            <span class="card-arrow">↗</span>
          </div>
          <h3>${project.title}</h3>
          <p>${project.summary}</p>
          <div class="tag-list">
            ${project.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `
    )
    .join('');

  // Attach mouse spotlight tracking and modal click handlers
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });

    card.addEventListener('click', () => {
      const project = projects.find((p) => p.id === card.dataset.id);
      if (project) openProjectModal(project);
    });
  });
}

renderProjects();

// 3. Category Filter Buttons
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

// 4. Project Detail Modal
const projectModal = document.getElementById('project-modal');
const closeModalBtn = document.getElementById('close-modal');
const closeModalSecondaryBtn = document.getElementById('close-modal-secondary');

function openProjectModal(project) {
  document.getElementById('modal-category').textContent = project.categoryLabel;
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-media').innerHTML = buildMediaHTML(project, true);
  document.getElementById('modal-description').textContent = project.description;
  document.getElementById('modal-highlights').innerHTML = project.highlights
    .map((item) => `<li>${item}</li>`)
    .join('');
  document.getElementById('modal-tags').innerHTML = project.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join('');
  document.getElementById('modal-repo-link').href = project.repoUrl;

  projectModal.classList.remove('hidden');
}

function closeProjectModal() {
  projectModal.classList.add('hidden');
  document.getElementById('modal-media').innerHTML = '';
}

closeModalBtn.addEventListener('click', closeProjectModal);
closeModalSecondaryBtn.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) closeProjectModal();
});

// 5. Copy Email Buttons
function setupCopyButton(btnId, labelId, defaultLabel) {
  const btn = document.getElementById(btnId);
  const label = document.getElementById(labelId);
  if (!btn || !label) return;

  btn.addEventListener('click', async () => {
    const email = btn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      label.textContent = 'Copied to Clipboard!';
      setTimeout(() => {
        label.textContent = defaultLabel;
      }, 2000);
    } catch {
      label.textContent = email;
    }
  });
}

setupCopyButton('copy-email-hero', 'copy-email-text', 'Copy Email');
setupCopyButton('copy-email-footer', 'copy-footer-text', 'Copy Email Address');

// 6. Command Palette (Ctrl+K / Cmd+K)
const cmdModal = document.getElementById('cmd-modal');
const cmdTrigger = document.getElementById('cmd-trigger');
const cmdInput = document.getElementById('cmd-input');
const cmdResults = document.getElementById('cmd-results');

const commands = [
  { label: 'Go to Top / Starter Heading', hint: 'Section', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { label: 'Go to Projects & Builds', hint: 'Section', action: () => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Go to Education & Milestones', hint: 'Section', action: () => document.getElementById('education').scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Go to Technical Stack', hint: 'Section', action: () => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Go to Contact', hint: 'Section', action: () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Copy Email Address', hint: 'Action', action: () => document.getElementById('copy-email-hero').click() }
];

function renderCommands(query = '') {
  const q = query.toLowerCase().trim();
  const matches = commands.filter((c) => c.label.toLowerCase().includes(q));

  cmdResults.innerHTML = matches
    .map(
      (cmd, idx) => `
      <button class="cmd-item" data-index="${idx}">
        <span>${cmd.label}</span>
        <span class="mono-muted">${cmd.hint}</span>
      </button>
    `
    )
    .join('');

  document.querySelectorAll('.cmd-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      matches[idx].action();
      closeCmdModal();
    });
  });
}

function openCmdModal() {
  cmdModal.classList.remove('hidden');
  cmdInput.value = '';
  renderCommands();
  cmdInput.focus();
}

function closeCmdModal() {
  cmdModal.classList.add('hidden');
}

cmdTrigger.addEventListener('click', openCmdModal);
cmdInput.addEventListener('input', (e) => renderCommands(e.target.value));
cmdModal.addEventListener('click', (e) => {
  if (e.target === cmdModal) closeCmdModal();
});

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    cmdModal.classList.contains('hidden') ? openCmdModal() : closeCmdModal();
  }
  if (e.key === 'Escape') {
    closeProjectModal();
    closeCmdModal();
  }
});
