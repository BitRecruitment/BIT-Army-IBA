/**
 * BUSINESS INFORMATION & TECHNOLOGY CLUB (BIT)
 * Official Executive Portal & Multi-Stage Assessment Engine | AIBA Savar
 * Exclusively for BBA 16 & BBA 17 Candidates
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

const APP_STORAGE_KEY = 'BIT_CLUB_APPLICATIONS_MULTI_STAGE_V1';
const THEME_STORAGE_KEY = 'BIT_CLUB_THEME_PREF';
const SOUND_STORAGE_KEY = 'BIT_CLUB_SOUND_PREF';

// Configured Formspree Email Endpoint
const WEBHOOK_URL = 'https://formspree.io/f/moeapklj';

let soundEnabled = true;

// Candidate Application State
let candidateProfile = null;
let uploadedCVFile = null;
let ecvProfileData = null;
let ecvPhotoDataUrl = null;

let psychologicalAnswers = null;
let cognitiveResponse = null;

// Timer State
let cognitiveTimerInterval = null;
let cognitiveTimeLeft = 40;
let cognitiveStartTime = null;
let selectedPuzzleChoice = null;

function initApp() {
  initTheme();
  initAudio();
  initConstellationCanvas();
  initMagneticButton();
  initModalEvents();
  initTrackModalEvents();
  initCvSubmissionEngine();
  initStage1FormEngine();
  initStage2PsychologicalEngine();
  initStage3CognitiveEngine();
  initStage4ShowcaseEngine();
}

/* ==========================================================================
   STAGE NAVIGATION CONTROLLER
   ========================================================================== */
function switchStage(targetStageId) {
  const allStages = document.querySelectorAll('.app-stage-view');
  allStages.forEach(stage => {
    stage.classList.remove('active-stage');
  });

  const targetStage = document.getElementById(targetStageId);
  if (targetStage) {
    targetStage.classList.add('active-stage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playTone(550, 'sine', 0.08);
  }
}

/* ==========================================================================
   DYNAMIC BUSINESS-TECH CONSTELLATION CANVAS ENGINE
   ========================================================================== */
function initConstellationCanvas() {
  const canvas = document.getElementById('constellationCanvas');
  const cursorGlow = document.getElementById('cursorGlow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: width / 2,
    y: height / 2,
    radius: 180
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (cursorGlow) {
      cursorGlow.style.left = `${mouse.x}px`;
      cursorGlow.style.top = `${mouse.y}px`;
    }
  });

  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 65);

  class Node {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = 1.5 + Math.random() * 2;
      this.baseAlpha = 0.2 + Math.random() * 0.5;
      this.color = Math.random() > 0.4 ? '#38BDF8' : '#818CF8';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.2;
        this.y -= (dy / dist) * force * 1.2;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Node());
    }
  }

  initParticles();

  function renderConstellations() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#38BDF8';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const dx = mouse.x - particles[i].x;
      const dy = mouse.y - particles[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const alpha = (1 - dist / mouse.radius) * 0.45;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = '#818CF8';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(renderConstellations);
  }

  renderConstellations();
}

/* ==========================================================================
   MAGNETIC BUTTON PULL EFFECT
   ========================================================================== */
function initMagneticButton() {
  const btns = document.querySelectorAll('.btn-primary');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      playTone(600, 'sine', 0.05);
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark');
      updateThemeIcon(isLight);
      showToast(isLight ? 'Executive Light Theme' : 'Cyber Navy Theme');
    });
  }
}

function updateThemeIcon(isLight) {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.textContent = isLight ? '🌙' : '☀️';
  }
}

/* ==========================================================================
   AUDIO SYNTHESIZER
   ========================================================================== */
let audioCtx = null;

function initAudio() {
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const savedSound = localStorage.getItem(SOUND_STORAGE_KEY);

  if (savedSound !== null) {
    soundEnabled = savedSound === 'true';
  }

  if (soundIcon) {
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled);
      if (soundIcon) {
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
      }
      if (soundEnabled) {
        playTone(700, 'sine', 0.08);
        showToast('Sound Effects Enabled');
      } else {
        showToast('Sound Muted');
      }
    });
  }
}

function playTone(freq, type = 'sine', duration = 0.06) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio restrictions
  }
}

function playSuccessChime() {
  if (!soundEnabled) return;
  setTimeout(() => playTone(523.25, 'sine', 0.1), 0);
  setTimeout(() => playTone(659.25, 'sine', 0.1), 100);
  setTimeout(() => playTone(783.99, 'sine', 0.15), 200);
  setTimeout(() => playTone(1046.50, 'sine', 0.25), 300);
}

/* ==========================================================================
   MODAL CONTROLS
   ========================================================================== */
function initModalEvents() {
  const openModalBtns = document.querySelectorAll('.trigger-apply-modal');
  const modalOverlay = document.getElementById('applyModalOverlay');
  const closeModalBtn = document.getElementById('closeApplyModal');
  const doneModalBtn = document.getElementById('doneModalBtn');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playTone(550, 'sine', 0.08);
      openApplyModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      playTone(400, 'sine', 0.05);
      closeApplyModal();
    });
  }

  if (doneModalBtn) {
    doneModalBtn.addEventListener('click', () => {
      playTone(600, 'sine', 0.06);
      resetAllAssessments();
      switchStage('stageLanding');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeApplyModal();
      }
    });
  }
}

function openApplyModal() {
  const modal = document.getElementById('applyModalOverlay');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
    const container = modal.querySelector('.modal-container');
    if (container) {
      container.scrollTop = 0;
    }
    requestAnimationFrame(() => {
      modal.scrollTop = 0;
      if (container) {
        container.scrollTop = 0;
      }
    });
  }
}

function closeApplyModal() {
  const modal = document.getElementById('applyModalOverlay');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   APPLICATION STATUS TRACKER CONTROLLER
   ========================================================================== */
function initTrackModalEvents() {
  const triggerTrackBtns = document.querySelectorAll('.trigger-track-modal');
  const closeTrackBtn = document.getElementById('closeTrackModal');
  const trackOverlay = document.getElementById('trackModalOverlay');
  const trackForm = document.getElementById('trackStatusForm');

  triggerTrackBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playTone(520, 'sine', 0.08);
      openTrackModal();
    });
  });

  if (closeTrackBtn) {
    closeTrackBtn.addEventListener('click', () => {
      playTone(400, 'sine', 0.05);
      closeTrackModal();
    });
  }

  if (trackOverlay) {
    trackOverlay.addEventListener('click', (e) => {
      if (e.target === trackOverlay) {
        closeTrackModal();
      }
    });
  }

  if (trackForm) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputQuery = document.getElementById('trackInputQuery');
      const resultArea = document.getElementById('trackResultArea');
      const displayId = document.getElementById('trackDisplayId');

      if (!inputQuery || !inputQuery.value.trim()) {
        showToast('Please enter your Application ID or Student ID', 'error');
        return;
      }

      const queryVal = inputQuery.value.trim().toUpperCase();
      if (displayId) displayId.textContent = queryVal;
      if (resultArea) resultArea.style.display = 'block';

      playTone(680, 'sine', 0.1);
      showToast('Status Query Processed: Results Pending Publication');
    });
  }
}

function openTrackModal() {
  const modal = document.getElementById('trackModalOverlay');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
    const container = modal.querySelector('.modal-container');
    if (container) container.scrollTop = 0;
    requestAnimationFrame(() => {
      modal.scrollTop = 0;
      if (container) container.scrollTop = 0;
    });
  }
}

function closeTrackModal() {
  const modal = document.getElementById('trackModalOverlay');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   CV SUBMISSION ENGINE (DUAL OPTIONS: FILE UPLOAD & E-CV BUILDER)
   ========================================================================== */
function initCvSubmissionEngine() {
  const btnChooseUpload = document.getElementById('btnChooseUpload');
  const btnChooseCreateEcv = document.getElementById('btnChooseCreateEcv');
  const cvUploadPanel = document.getElementById('cvUploadPanel');
  const cvCreatePanel = document.getElementById('cvCreatePanel');

  const fileDropZone = document.getElementById('fileDropZone');
  const cvFileInput = document.getElementById('cvFileInput');
  const dropZoneContent = document.getElementById('dropZoneContent');
  const dropZoneSelected = document.getElementById('dropZoneSelected');
  const selectedFileName = document.getElementById('selectedFileName');
  const selectedFileSize = document.getElementById('selectedFileSize');
  const btnRemoveFile = document.getElementById('btnRemoveFile');

  const ecvPhotoInput = document.getElementById('ecvPhotoInput');
  const ecvPhotoPreview = document.getElementById('ecvPhotoPreview');
  const btnSaveAttachEcv = document.getElementById('btnSaveAttachEcv');
  const ecvPreviewCard = document.getElementById('ecvPreviewCard');

  if (btnChooseUpload && btnChooseCreateEcv) {
    btnChooseUpload.addEventListener('click', () => {
      playTone(500, 'sine', 0.05);
      btnChooseUpload.classList.add('active');
      btnChooseCreateEcv.classList.remove('active');
      cvUploadPanel.style.display = 'block';
      cvCreatePanel.style.display = 'none';
    });

    btnChooseCreateEcv.addEventListener('click', () => {
      playTone(550, 'sine', 0.05);
      btnChooseCreateEcv.classList.add('active');
      btnChooseUpload.classList.remove('active');
      cvCreatePanel.style.display = 'block';
      cvUploadPanel.style.display = 'none';
    });
  }

  if (fileDropZone && cvFileInput) {
    fileDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileDropZone.classList.add('dragover');
    });

    fileDropZone.addEventListener('dragleave', () => {
      fileDropZone.classList.remove('dragover');
    });

    fileDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      fileDropZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleSelectedCvFile(e.dataTransfer.files[0]);
      }
    });

    cvFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleSelectedCvFile(e.target.files[0]);
      }
    });
  }

  function handleSelectedCvFile(file) {
    if (file.size > 10 * 1024 * 1024) {
      showToast('File exceeds 10MB limit. Please choose a smaller file.', 'error');
      return;
    }

    uploadedCVFile = {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type
    };

    if (selectedFileName) selectedFileName.textContent = file.name;
    if (selectedFileSize) selectedFileSize.textContent = formatFileSize(file.size);

    if (dropZoneContent) dropZoneContent.style.display = 'none';
    if (dropZoneSelected) dropZoneSelected.style.display = 'flex';

    playTone(650, 'sine', 0.06);
    showToast(`File attached: ${file.name}`);
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', (e) => {
      e.stopPropagation();
      uploadedCVFile = null;
      if (cvFileInput) cvFileInput.value = '';
      if (dropZoneContent) dropZoneContent.style.display = 'flex';
      if (dropZoneSelected) dropZoneSelected.style.display = 'none';
      playTone(350, 'sine', 0.04);
      showToast('File removed');
    });
  }

  if (ecvPhotoInput) {
    ecvPhotoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          ecvPhotoDataUrl = event.target.result;
          if (ecvPhotoPreview) ecvPhotoPreview.src = ecvPhotoDataUrl;
          const ecvCardPhoto = document.getElementById('ecvCardPhoto');
          if (ecvCardPhoto) ecvCardPhoto.src = ecvPhotoDataUrl;
          showToast('Profile photo attached');
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  if (btnSaveAttachEcv) {
    btnSaveAttachEcv.addEventListener('click', () => {
      const address = document.getElementById('ecvAddress').value.trim();
      const skills = document.getElementById('ecvSkills').value.trim();
      const experience = document.getElementById('ecvExperience').value.trim();
      const achievements = document.getElementById('ecvAchievements').value.trim();
      const name = document.getElementById('appName').value.trim() || 'Applicant';
      const intake = document.getElementById('appIntake').value || 'BBA Intake';

      if (!address) {
        showToast('Please enter your Permanent Address', 'error');
        document.getElementById('ecvAddress').focus();
        return;
      }
      if (!skills) {
        showToast('Please list your Key Skills', 'error');
        document.getElementById('ecvSkills').focus();
        return;
      }
      if (!experience) {
        showToast('Please describe your Work Experience or Extracurriculars', 'error');
        document.getElementById('ecvExperience').focus();
        return;
      }
      if (!achievements) {
        showToast('Please list your Achievements or Honors', 'error');
        document.getElementById('ecvAchievements').focus();
        return;
      }

      ecvProfileData = {
        address,
        skills,
        experience,
        achievements,
        photoAttached: !!ecvPhotoDataUrl
      };

      document.getElementById('ecvCardName').textContent = name;
      document.getElementById('ecvCardSub').textContent = `${intake} • AIBA Savar`;
      document.getElementById('ecvCardAddress').textContent = `📍 ${address}`;
      document.getElementById('ecvCardSkills').textContent = skills;
      document.getElementById('ecvCardExperience').textContent = experience;
      document.getElementById('ecvCardAchievements').textContent = achievements;

      if (ecvPreviewCard) {
        ecvPreviewCard.style.display = 'block';
      }

      playTone(700, 'sine', 0.08);
      showToast('E-CV successfully generated and attached!');
    });
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/* ==========================================================================
   STAGE 1: FORM VALIDATION & ADVANCEMENT
   ========================================================================== */
function initStage1FormEngine() {
  const form = document.getElementById('recruitmentForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('appName').value.trim();
    const studentId = document.getElementById('appStudentId').value.trim();
    const intake = document.getElementById('appIntake').value;
    const email = document.getElementById('appEmail').value.trim();
    const phone = document.getElementById('appPhone').value.trim();
    const sector = document.getElementById('appSector').value;
    const statement = document.getElementById('appStatement').value.trim();
    const portfolioUrl = document.getElementById('appPortfolio').value.trim();

    if (!name) {
      showToast('Please enter your Full Name', 'error');
      document.getElementById('appName').focus();
      return;
    }
    if (!studentId) {
      showToast('Please enter your AIBA Student ID', 'error');
      document.getElementById('appStudentId').focus();
      return;
    }
    if (!intake) {
      showToast('Please select your Intake (BBA 16 or BBA 17)', 'error');
      document.getElementById('appIntake').focus();
      return;
    }
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      document.getElementById('appEmail').focus();
      return;
    }
    if (!phone || phone.length < 10) {
      showToast('Please enter a valid contact number', 'error');
      document.getElementById('appPhone').focus();
      return;
    }
    if (!sector) {
      showToast('Please select your Preferred Working Sector', 'error');
      document.getElementById('appSector').focus();
      return;
    }
    if (!statement || statement.length < 15) {
      showToast('Please provide a brief statement of motivation (min 15 characters)', 'error');
      document.getElementById('appStatement').focus();
      return;
    }

    // Validate Mandatory CV / E-CV
    let cvSubmissionType = '';
    let cvDetailsString = '';

    if (ecvProfileData) {
      cvSubmissionType = '✨ Generated E-CV';
      cvDetailsString = `[E-CV Attached] Address: ${ecvProfileData.address} | Skills: ${ecvProfileData.skills} | Experience: ${ecvProfileData.experience} | Achievements: ${ecvProfileData.achievements}`;
    } else if (uploadedCVFile) {
      cvSubmissionType = '📁 Direct Device File Upload';
      cvDetailsString = `[File Uploaded] ${uploadedCVFile.name} (${uploadedCVFile.size})`;
      if (portfolioUrl) {
        cvDetailsString += ` | Link: ${portfolioUrl}`;
      }
    } else if (portfolioUrl && (portfolioUrl.startsWith('http://') || portfolioUrl.startsWith('https://'))) {
      cvSubmissionType = '🌐 Drive / Portfolio Link';
      cvDetailsString = portfolioUrl;
    } else {
      showToast('CV / Portfolio is mandatory! Please upload a file, paste a link, or create an E-CV.', 'error');
      document.getElementById('btnChooseUpload').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const intakeCode = intake.replace(/\s+/g, '');
    const appId = `BITC-2026-${intakeCode}-${randomNum}`;

    candidateProfile = {
      appId,
      name,
      studentId,
      intake,
      email,
      phone,
      sector,
      statement,
      cvSubmissionType,
      cvDetailsString,
      ecvProfileData
    };

    closeApplyModal();
    switchStage('stagePsychological');
    showToast('Stage 1 Completed: Proceeding to Psychological Assessment');
  });
}

/* ==========================================================================
   STAGE 2: PSYCHOLOGICAL TESTING ENGINE
   ========================================================================== */
function initStage2PsychologicalEngine() {
  const psychForm = document.getElementById('psychForm');
  if (!psychForm) return;

  psychForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const q1 = document.getElementById('psychQ1').value.trim();
    const q2 = document.getElementById('psychQ2').value.trim();
    const q3 = document.getElementById('psychQ3').value.trim();

    if (!q1 || q1.length < 15) {
      showToast('Please answer Question 1 (minimum 15 characters)', 'error');
      document.getElementById('psychQ1').focus();
      return;
    }
    if (!q2 || q2.length < 15) {
      showToast('Please answer Question 2 (minimum 15 characters)', 'error');
      document.getElementById('psychQ2').focus();
      return;
    }
    if (!q3 || q3.length < 15) {
      showToast('Please answer Question 3 (minimum 15 characters)', 'error');
      document.getElementById('psychQ3').focus();
      return;
    }

    psychologicalAnswers = { q1, q2, q3 };

    switchStage('stageCognitive');
    showToast('Psychological Profiling Logged: Advancing to Cognitive Assessment');
  });
}

/* ==========================================================================
   STAGE 3: COGNITIVE ARROW CLEARANCE GAME ENGINE (5x5 COMPLEX 25-NODE MATRIX)
   ========================================================================== */
const ARROW_GRID_CONFIG = [
  ['up',    'left', 'down', 'left',  'up'   ],
  ['right', 'up',   'right','right', 'right'],
  ['left',  'up',   'left', 'right', 'right'],
  ['down',  'down', 'down', 'down',  'up'   ],
  ['down',  'left', 'down', 'left',  'left' ]
];

let activeArrowGrid = [
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true]
];

let totalArrowsCount = 25;
let clearedArrowsCount = 0;

function initStage3CognitiveEngine() {
  const btnStartChallenge = document.getElementById('btnStartCognitiveChallenge');
  const cognitiveRulesBox = document.getElementById('cognitiveRulesBox');
  const cognitiveActiveGame = document.getElementById('cognitiveActiveGame');

  if (btnStartChallenge) {
    btnStartChallenge.addEventListener('click', () => {
      playTone(700, 'sine', 0.1);
      cognitiveRulesBox.style.display = 'none';
      cognitiveActiveGame.style.display = 'block';

      startArrowGame();
      showToast('40-Second Countdown Started! Clear all 25 interlocking arrows.');
    });
  }
}

function startArrowGame() {
  const board = document.getElementById('arrowGameBoard');
  const clearedCountEl = document.getElementById('arrowsClearedCount');
  const accuracyEl = document.getElementById('gameAccuracyScore');
  const victoryBanner = document.getElementById('gameVictoryBanner');

  if (victoryBanner) victoryBanner.style.display = 'none';
  if (clearedCountEl) clearedCountEl.textContent = `0 / ${totalArrowsCount}`;
  if (accuracyEl) {
    accuracyEl.textContent = 'Active';
    accuracyEl.style.color = '#10B981';
  }

  clearedArrowsCount = 0;
  activeArrowGrid = [
    [true, true, true, true, true],
    [true, true, true, true, true],
    [true, true, true, true, true],
    [true, true, true, true, true],
    [true, true, true, true, true]
  ];

  // Generate 5x5 Arrow Tiles
  if (board) {
    board.innerHTML = '';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const dir = ARROW_GRID_CONFIG[r][c];
        const tile = document.createElement('div');
        tile.className = 'arrow-tile';
        tile.setAttribute('data-row', r);
        tile.setAttribute('data-col', c);
        tile.setAttribute('data-dir', dir);
        tile.setAttribute('title', `Arrow [${r+1},${c+1}] pointing ${dir.toUpperCase()}`);

        // SVG Arrow Icon
        tile.innerHTML = `
          <svg class="arrow-icon-svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        `;

        tile.addEventListener('click', () => {
          handleArrowTileClick(r, c, dir, tile);
        });

        board.appendChild(tile);
      }
    }
  }

  startCognitiveTimer();
}

function isArrowPathClear(row, col, dir) {
  if (dir === 'up') {
    for (let r = row - 1; r >= 0; r--) {
      if (activeArrowGrid[r][col]) return false;
    }
    return true;
  } else if (dir === 'down') {
    for (let r = row + 1; r < 5; r++) {
      if (activeArrowGrid[r][col]) return false;
    }
    return true;
  } else if (dir === 'left') {
    for (let c = col - 1; c >= 0; c--) {
      if (activeArrowGrid[row][c]) return false;
    }
    return true;
  } else if (dir === 'right') {
    for (let c = col + 1; c < 5; c++) {
      if (activeArrowGrid[row][c]) return false;
    }
    return true;
  }
  return false;
}

function handleArrowTileClick(row, col, dir, tileEl) {
  if (!activeArrowGrid[row][col]) return;

  const canClear = isArrowPathClear(row, col, dir);

  if (!canClear) {
    // Arrow is blocked by another tile
    playTone(220, 'sawtooth', 0.1);
    tileEl.classList.remove('shake-blocked');
    void tileEl.offsetWidth; // Trigger reflow
    tileEl.classList.add('shake-blocked');

    const accuracyEl = document.getElementById('gameAccuracyScore');
    if (accuracyEl) {
      accuracyEl.textContent = 'Path Blocked!';
      accuracyEl.style.color = '#EF4444';
      setTimeout(() => {
        if (accuracyEl && clearedArrowsCount < totalArrowsCount) {
          accuracyEl.textContent = 'Active';
          accuracyEl.style.color = '#10B981';
        }
      }, 700);
    }
    return;
  }

  // Arrow is FREE to fly away
  activeArrowGrid[row][col] = false;
  clearedArrowsCount++;

  // Play satisfying ascending pitch chime
  playTone(320 + clearedArrowsCount * 35, 'sine', 0.08);

  tileEl.classList.add(`fly-away-${dir}`);
  setTimeout(() => {
    tileEl.classList.add('cleared-empty');
  }, 440);

  // Update HUD stats
  const clearedCountEl = document.getElementById('arrowsClearedCount');
  if (clearedCountEl) clearedCountEl.textContent = `${clearedArrowsCount} / ${totalArrowsCount}`;

  // Check Victory Condition (All 16 Cleared)
  if (clearedArrowsCount >= totalArrowsCount) {
    clearInterval(cognitiveTimerInterval);

    const victoryBanner = document.getElementById('gameVictoryBanner');
    const accuracyEl = document.getElementById('gameAccuracyScore');
    const nextWrap = document.getElementById('cognitiveNextWrap');

    if (victoryBanner) victoryBanner.style.display = 'block';
    if (nextWrap) nextWrap.style.display = 'flex';
    if (accuracyEl) {
      accuracyEl.textContent = '100% Cleared!';
      accuracyEl.style.color = '#10B981';
    }

    playSuccessChime();
    showToast('🎉 All 16 Arrows Cleared! Proceeding to Project Showcase.');

    setTimeout(() => {
      recordCognitiveResults();
      switchStage('stageShowcase');
    }, 1800);
  }
}

function startCognitiveTimer() {
  cognitiveTimeLeft = 40;
  cognitiveStartTime = Date.now();

  const timerDisplay = document.getElementById('timerDisplay');
  const timerProgressBar = document.getElementById('timerProgressBar');

  if (timerDisplay) timerDisplay.textContent = '00:40';
  if (timerProgressBar) {
    timerProgressBar.style.width = '100%';
    timerProgressBar.classList.remove('urgent');
  }
  if (timerDisplay) timerDisplay.classList.remove('urgent');

  clearInterval(cognitiveTimerInterval);

  cognitiveTimerInterval = setInterval(() => {
    cognitiveTimeLeft--;

    const formattedSec = String(cognitiveTimeLeft).padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = `00:${formattedSec}`;

    const progressPercent = (cognitiveTimeLeft / 40) * 100;
    if (timerProgressBar) timerProgressBar.style.width = `${progressPercent}%`;

    if (cognitiveTimeLeft <= 10) {
      if (timerDisplay) timerDisplay.classList.add('urgent');
      if (timerProgressBar) timerProgressBar.classList.add('urgent');
      playTone(280, 'triangle', 0.04);
    }

    if (cognitiveTimeLeft <= 0) {
      clearInterval(cognitiveTimerInterval);
      playTone(240, 'sawtooth', 0.3);
      showToast('Time Expired! Advancing to Project & Work Showcase...', 'info');
      recordCognitiveResults();
      setTimeout(() => {
        switchStage('stageShowcase');
      }, 1000);
    }
  }, 1000);
}

function recordCognitiveResults() {
  clearInterval(cognitiveTimerInterval);
  const timeTaken = cognitiveStartTime ? Math.min(40, Math.round((Date.now() - cognitiveStartTime) / 1000)) : 40;
  const isVictory = clearedArrowsCount >= totalArrowsCount;
  const outcomeText = isVictory ? `Victory (16/16 Cleared in ${timeTaken}s)` : `${clearedArrowsCount}/16 Cleared (Time Expired at 40s)`;

  cognitiveResponse = {
    arrowsCleared: `${clearedArrowsCount} / ${totalArrowsCount}`,
    timeTakenSeconds: timeTaken,
    outcome: outcomeText,
    isVictory
  };
}

// Next button listener from Cognitive stage
document.addEventListener('click', (e) => {
  if (e.target && (e.target.id === 'btnNextToShowcase' || e.target.closest('#btnNextToShowcase'))) {
    recordCognitiveResults();
    switchStage('stageShowcase');
  }
});

/* ==========================================================================
   STAGE 4: CREATIVE & TECHNICAL WORK SHOWCASE ENGINE (PROJECT ATTACHMENTS)
   ========================================================================== */
let attachedProjectFiles = [];

function initStage4ShowcaseEngine() {
  const projectDropZone = document.getElementById('projectDropZone');
  const projectFileInput = document.getElementById('projectFileInput');
  const showcaseForm = document.getElementById('showcaseForm');

  if (projectDropZone && projectFileInput) {
    projectDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      projectDropZone.classList.add('dragover');
    });

    projectDropZone.addEventListener('dragleave', () => {
      projectDropZone.classList.remove('dragover');
    });

    projectDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      projectDropZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleProjectFiles(Array.from(e.dataTransfer.files));
      }
    });

    projectFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleProjectFiles(Array.from(e.target.files));
      }
    });
  }

  function handleProjectFiles(files) {
    files.forEach(file => {
      if (file.size > 12 * 1024 * 1024) {
        showToast(`File ${file.name} exceeds 10MB limit`, 'error');
        return;
      }
      attachedProjectFiles.push({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type
      });
    });

    renderProjectFileList();
    playTone(600, 'sine', 0.06);
    showToast(`${files.length} project file(s) attached`);
  }

  if (showcaseForm) {
    showcaseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      finalizeAndSubmitAll();
    });
  }
}

function renderProjectFileList() {
  const listContainer = document.getElementById('projectFileList');
  if (!listContainer) return;

  listContainer.innerHTML = '';
  attachedProjectFiles.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'project-file-item';
    item.innerHTML = `
      <span class="project-file-name">
        <span>📎</span>
        <span>${escapeHtml(file.name)}</span>
        <span style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-sky); font-weight: 700;">(${file.size})</span>
      </span>
      <button type="button" class="btn-remove-project-file" data-idx="${index}" title="Remove file">&times;</button>
    `;

    const removeBtn = item.querySelector('.btn-remove-project-file');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      attachedProjectFiles.splice(index, 1);
      renderProjectFileList();
      playTone(350, 'sine', 0.04);
      showToast('File removed');
    });

    listContainer.appendChild(item);
  });
}

/* ==========================================================================
   FINAL COMPILATION & FORMSPREE DELIVERY
   ========================================================================== */
function finalizeAndSubmitAll() {
  clearInterval(cognitiveTimerInterval);

  if (!cognitiveResponse) {
    recordCognitiveResults();
  }

  const projectLinks = document.getElementById('showcaseProjectLinks') ? document.getElementById('showcaseProjectLinks').value.trim() : '';
  const projectDesc = document.getElementById('showcaseProjectDesc') ? document.getElementById('showcaseProjectDesc').value.trim() : '';

  let projectFilesString = 'No Files Attached';
  if (attachedProjectFiles.length > 0) {
    projectFilesString = attachedProjectFiles.map(f => `${f.name} (${f.size})`).join(' | ');
  }

  const now = new Date();
  const submittedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const fullApplicationPackage = {
    ...candidateProfile,
    psychologicalAnswers,
    cognitiveResponse,
    projectShowcase: {
      files: attachedProjectFiles,
      links: projectLinks || 'None Provided',
      description: projectDesc || 'None Provided'
    },
    submittedAt
  };

  // Save to localStorage
  try {
    const existing = JSON.parse(localStorage.getItem(APP_STORAGE_KEY) || '[]');
    existing.unshift(fullApplicationPackage);
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    // Ignore storage issues
  }

  // Dispatch complete assessment payload to Formspree endpoint
  if (WEBHOOK_URL && WEBHOOK_URL.trim() !== '') {
    const emailPayload = {
      'Application_ID': candidateProfile.appId,
      'Full_Name': candidateProfile.name,
      'Student_ID': candidateProfile.studentId,
      'Intake_Batch': candidateProfile.intake,
      'Email_Address': candidateProfile.email,
      'Contact_Number': candidateProfile.phone,
      'Preferred_Working_Sector': candidateProfile.sector,
      'Motivation_Statement': candidateProfile.statement,
      'CV_Submission_Type': candidateProfile.cvSubmissionType,
      'CV_Details_Or_Link': candidateProfile.cvDetailsString,
      'E_CV_Address': candidateProfile.ecvProfileData ? candidateProfile.ecvProfileData.address : 'N/A',
      'E_CV_Skills': candidateProfile.ecvProfileData ? candidateProfile.ecvProfileData.skills : 'N/A',
      'E_CV_Experience': candidateProfile.ecvProfileData ? candidateProfile.ecvProfileData.experience : 'N/A',
      'E_CV_Achievements': candidateProfile.ecvProfileData ? candidateProfile.ecvProfileData.achievements : 'N/A',
      
      // Stage 2: Psychological Answers
      'Psychological_Q1_Handling_Criticism': psychologicalAnswers ? psychologicalAnswers.q1 : 'N/A',
      'Psychological_Q2_Club_Expectations': psychologicalAnswers ? psychologicalAnswers.q2 : 'N/A',
      'Psychological_Q3_Stress_Leadership': psychologicalAnswers ? psychologicalAnswers.q3 : 'N/A',

      // Stage 3: Cognitive Arrow Game Results
      'Cognitive_Game_Score': cognitiveResponse ? cognitiveResponse.arrowsCleared : 'N/A',
      'Cognitive_Time_Taken': cognitiveResponse ? `${cognitiveResponse.timeTakenSeconds}s` : 'N/A',
      'Cognitive_Game_Outcome': cognitiveResponse ? cognitiveResponse.outcome : 'N/A',

      // Stage 4: Project & Creative Work Attachments
      'Project_Showcase_Files': projectFilesString,
      'Project_Showcase_Links': projectLinks || 'None Provided',
      'Project_Showcase_Description': projectDesc || 'None Provided',

      'Submission_Time': submittedAt
    };

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    }).then(res => {
      console.log('Complete Application delivered to Formspree:', res.status);
    }).catch(err => {
      console.log('Formspree dispatch error:', err);
    });
  }

  playSuccessChime();

  // Populate Stage 5 Confirmation Receipt Table
  document.getElementById('receiptAppId').textContent = candidateProfile.appId;
  document.getElementById('receiptName').textContent = candidateProfile.name;
  document.getElementById('receiptStudentId').textContent = candidateProfile.studentId;
  document.getElementById('receiptIntake').textContent = candidateProfile.intake;
  document.getElementById('receiptSector').textContent = candidateProfile.sector;
  document.getElementById('receiptCvType').textContent = candidateProfile.cvSubmissionType;
  document.getElementById('receiptCognitiveStatus').textContent = `✓ ${cognitiveResponse ? cognitiveResponse.outcome : 'Recorded'}`;
  
  const projectsSummary = attachedProjectFiles.length > 0 
    ? `✓ ${attachedProjectFiles.length} file(s) attached ${projectLinks ? '+ Links' : ''}`
    : (projectLinks ? `✓ Portfolio Links Provided` : 'None Attached (Optional)');
  document.getElementById('receiptProjectsStatus').textContent = projectsSummary;
  
  document.getElementById('receiptDate').textContent = submittedAt;

  switchStage('stageConfirmation');
  showToast('Application Submitted Successfully!');
}

function resetAllAssessments() {
  candidateProfile = null;
  uploadedCVFile = null;
  ecvProfileData = null;
  ecvPhotoDataUrl = null;
  psychologicalAnswers = null;
  cognitiveResponse = null;
  attachedProjectFiles = [];

  clearInterval(cognitiveTimerInterval);

  const recruitmentForm = document.getElementById('recruitmentForm');
  const psychForm = document.getElementById('psychForm');
  const showcaseForm = document.getElementById('showcaseForm');
  if (recruitmentForm) recruitmentForm.reset();
  if (psychForm) psychForm.reset();
  if (showcaseForm) showcaseForm.reset();

  const projectFileList = document.getElementById('projectFileList');
  if (projectFileList) projectFileList.innerHTML = '';

  const cognitiveRulesBox = document.getElementById('cognitiveRulesBox');
  const cognitiveActiveGame = document.getElementById('cognitiveActiveGame');
  const victoryBanner = document.getElementById('gameVictoryBanner');
  const nextWrap = document.getElementById('cognitiveNextWrap');

  if (cognitiveRulesBox) cognitiveRulesBox.style.display = 'block';
  if (cognitiveActiveGame) cognitiveActiveGame.style.display = 'none';
  if (victoryBanner) victoryBanner.style.display = 'none';
  if (nextWrap) nextWrap.style.display = 'none';

  const dropZoneContent = document.getElementById('dropZoneContent');
  const dropZoneSelected = document.getElementById('dropZoneSelected');
  const ecvPreviewCard = document.getElementById('ecvPreviewCard');

  if (dropZoneContent) dropZoneContent.style.display = 'flex';
  if (dropZoneSelected) dropZoneSelected.style.display = 'none';
  if (ecvPreviewCard) ecvPreviewCard.style.display = 'none';
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') {
    toast.style.borderColor = '#F43F5E';
  }

  const icon = type === 'error' ? '⚠️' : '⚡';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
