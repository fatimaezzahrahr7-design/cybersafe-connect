// =========================================================
// CYBERSAFE CONNECT — MAIN SCRIPT
// =========================================================

// ---------- MOBILE NAV TOGGLE ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// =========================================================
// SECTION 1: DIGITAL SAFETY CHECK (QUIZ)
// =========================================================

const quizQuestions = [
  {
    category: "Passwords",
    question: "How do you usually create passwords for your online accounts?",
    options: [
      { text: "I reuse the same password everywhere", score: 1 },
      { text: "I use a few different passwords for different sites", score: 2 },
      { text: "I use a unique, strong password for each account", score: 3 }
    ]
  },
  {
    category: "Two-Factor Authentication",
    question: "Do you use two-factor authentication (2FA) on your important accounts?",
    options: [
      { text: "I've never heard of it or never set it up", score: 1 },
      { text: "I use it on some accounts", score: 2 },
      { text: "I use it on all my important accounts", score: 3 }
    ]
  },
  {
    category: "Phishing Awareness",
    question: "You get an urgent email saying your account will be suspended unless you click a link immediately. What do you do?",
    options: [
      { text: "Click the link right away to fix it", score: 1 },
      { text: "Feel unsure but click anyway just in case", score: 2 },
      { text: "Go directly to the official website instead of clicking", score: 3 }
    ]
  },
  {
    category: "Privacy Settings",
    question: "How often do you check the privacy settings on your social media accounts?",
    options: [
      { text: "Never — I use the default settings", score: 1 },
      { text: "Occasionally, when I remember", score: 2 },
      { text: "Regularly, I review them often", score: 3 }
    ]
  },
  {
    category: "Public Wi-Fi",
    question: "When you're on public Wi-Fi, what do you typically do?",
    options: [
      { text: "Use it normally for everything, including banking", score: 1 },
      { text: "Use it for casual browsing only", score: 2 },
      { text: "Avoid sensitive activity or use a VPN", score: 3 }
    ]
  },
  {
    category: "Suspicious Links",
    question: "A friend's account sends you a strange link with no context. What's your reaction?",
    options: [
      { text: "Click it since it's from a friend", score: 1 },
      { text: "Hover over it to check, then decide", score: 2 },
      { text: "Message them separately to confirm before clicking", score: 3 }
    ]
  },
  {
    category: "App Permissions",
    question: "When installing a new app, how do you handle permission requests (camera, contacts, location)?",
    options: [
      { text: "Accept all permissions without checking", score: 1 },
      { text: "Skim through them quickly", score: 2 },
      { text: "Review each one and only allow what's necessary", score: 3 }
    ]
  }
];

let currentQuestion = 0;
let quizAnswers = [];

const quizQuestionEl = document.getElementById('quizQuestion');
const quizOptionsEl = document.getElementById('quizOptions');
const quizCounterEl = document.getElementById('quizCounter');
const quizProgressBar = document.getElementById('quizProgressBar');
const quizBackBtn = document.getElementById('quizBack');
const quizCard = document.getElementById('quizCard');
const resultsCard = document.getElementById('resultsCard');

function renderQuestion() {
  const q = quizQuestions[currentQuestion];
  quizQuestionEl.textContent = q.question;
  quizCounterEl.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  quizProgressBar.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
  quizBackBtn.disabled = currentQuestion === 0;

  quizOptionsEl.innerHTML = '';
  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt.text;
    if (quizAnswers[currentQuestion] === index) {
      btn.classList.add('selected');
    }
    btn.addEventListener('click', () => selectAnswer(index));
    quizOptionsEl.appendChild(btn);
  });
}

function selectAnswer(index) {
  quizAnswers[currentQuestion] = index;

  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResults();
  }
}

quizBackBtn.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

function showResults() {
  quizCard.hidden = true;
  resultsCard.hidden = false;

  const totalScore = quizAnswers.reduce((sum, answerIndex, i) => {
    return sum + quizQuestions[i].options[answerIndex].score;
  }, 0);

  const maxScore = quizQuestions.length * 3;
  const percentage = Math.round((totalScore / maxScore) * 100);

  document.getElementById('scoreNumber').textContent = percentage;

  let level;
  if (percentage >= 80) level = "Excellent";
  else if (percentage >= 60) level = "Good";
  else if (percentage >= 40) level = "Needs Improvement";
  else level = "At Risk";

  document.getElementById('resultsLevel').textContent = level;

  // Category breakdown
  const breakdownEl = document.getElementById('resultsBreakdown');
  breakdownEl.innerHTML = '';
  quizQuestions.forEach((q, i) => {
    const score = q.options[quizAnswers[i]].score;
    const pct = (score / 3) * 100;
    const row = document.createElement('div');
    row.className = 'breakdown-row';
    row.innerHTML = `
      <span>${q.category}</span>
      <div class="breakdown-bar-track"><div class="breakdown-bar-fill" style="width:${pct}%"></div></div>
      <span>${score}/3</span>
    `;
    breakdownEl.appendChild(row);
  });

  // Recommendations based on weak areas (score of 1)
  const recommendationsMap = {
    "Passwords": "Use a unique password for each account — a password manager makes this easy.",
    "Two-Factor Authentication": "Turn on 2FA for your email, banking, and social accounts — it blocks most account takeovers.",
    "Phishing Awareness": "Never click links in urgent-sounding messages. Go to the site directly instead.",
    "Privacy Settings": "Review your social media privacy settings at least every few months.",
    "Public Wi-Fi": "Avoid logging into sensitive accounts on public Wi-Fi, or use a VPN.",
    "Suspicious Links": "Confirm with the sender through another channel before clicking unexpected links.",
    "App Permissions": "Only grant app permissions that are actually necessary for it to function."
  };

  const recList = document.getElementById('recommendationsList');
  recList.innerHTML = '';
  const weakAreas = quizQuestions.filter((q, i) => q.options[quizAnswers[i]].score <= 2);

  if (weakAreas.length === 0) {
    const li = document.createElement('li');
    li.textContent = "You're following strong digital safety habits across the board. Keep it up!";
    recList.appendChild(li);
  } else {
    weakAreas.forEach(q => {
      const li = document.createElement('li');
      li.textContent = recommendationsMap[q.category];
      recList.appendChild(li);
    });
  }
}

document.getElementById('retakeQuiz').addEventListener('click', () => {
  currentQuestion = 0;
  quizAnswers = [];
  resultsCard.hidden = true;
  quizCard.hidden = false;
  renderQuestion();
});

renderQuestion();

// =========================================================
// SECTION 2: CAN YOU SPOT THE SCAM?
// =========================================================

const scamMessages = [
  {
    text: "Subject: Urgent Account Verification Needed\n\nDear User,\n\nWe detected unusual activity on your account. Click the link below within 24 hours or your account will be permanently suspended.\n\n[Verify Now]",
    isSuspicious: true,
    explanation: "Urgency, vague threats, and a generic greeting ('Dear User') are classic phishing signs. Legitimate companies rarely threaten immediate suspension via email."
  },
  {
    text: "Hi! Just following up on the notes from our study group meeting yesterday. I've attached the summary doc we agreed on — let me know if you want any changes before Friday.",
    isSuspicious: false,
    explanation: "This message has specific, verifiable context (a meeting, an agreed-upon document, a real deadline) — no urgency, no request for credentials or money."
  },
  {
    text: "CONGRATULATIONS! You've been selected to receive a $500 gift card. Claim your prize now by entering your card details at the link below. Offer expires in 1 hour!",
    isSuspicious: true,
    explanation: "Unsolicited prizes combined with a countdown and a request for card details are a textbook scam pattern — legitimate giveaways don't ask for payment card info to 'claim' anything."
  },
  {
    text: "Reminder from your school portal: Your assignment 'Intro to Chemistry — Lab Report 3' is due tomorrow at 11:59 PM. Log in to the portal directly to submit.",
    isSuspicious: false,
    explanation: "This message references a specific, plausible academic task and tells you to log in directly through the portal rather than clicking an embedded link — a safer pattern."
  },
  {
    text: "Hey, it's your cousin, I lost my phone and I'm messaging from a friend's number. I need you to send money urgently through this app, I'll explain later, please hurry!",
    isSuspicious: true,
    explanation: "Impersonation of a relative, urgency, an unfamiliar contact method, and a request for money are strong scam indicators. Always verify through a known, separate channel first."
  }
];

let scamIndex = 0;
let scamScore = 0;
let scamAnswered = false;

const scamMessageEl = document.getElementById('scamMessage');
const scamCounterEl = document.getElementById('scamCounter');
const scamFeedbackEl = document.getElementById('scamFeedback');
const scamNextBtn = document.getElementById('scamNext');
const scamActionButtons = document.querySelectorAll('#scamCard .scam-actions .btn');
const scamCard = document.getElementById('scamCard');
const scamSummary = document.getElementById('scamSummary');

function renderScam() {
  const msg = scamMessages[scamIndex];
  scamMessageEl.textContent = msg.text;
  scamCounterEl.textContent = `Message ${scamIndex + 1} of ${scamMessages.length}`;
  scamFeedbackEl.hidden = true;
  scamNextBtn.hidden = true;
  scamAnswered = false;
  scamActionButtons.forEach(btn => btn.disabled = false);
}

scamActionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (scamAnswered) return;
    scamAnswered = true;

    const choice = btn.getAttribute('data-choice'); // "safe" or "suspicious"
    const msg = scamMessages[scamIndex];
    const userSaidSuspicious = choice === 'suspicious';
    const correct = userSaidSuspicious === msg.isSuspicious;

    if (correct) scamScore++;

    scamFeedbackEl.hidden = false;
    scamFeedbackEl.className = 'scam-feedback ' + (correct ? 'correct' : 'incorrect');
    scamFeedbackEl.textContent = (correct ? "Correct! " : "Not quite. ") + msg.explanation;

    scamActionButtons.forEach(b => b.disabled = true);
    scamNextBtn.hidden = false;
  });
});

scamNextBtn.addEventListener('click', () => {
  scamIndex++;
  if (scamIndex < scamMessages.length) {
    renderScam();
  } else {
    scamCard.hidden = true;
    scamSummary.hidden = false;
    document.getElementById('scamScore').textContent = scamScore;
  }
});

document.getElementById('scamRestart').addEventListener('click', () => {
  scamIndex = 0;
  scamScore = 0;
  scamSummary.hidden = true;
  scamCard.hidden = false;
  renderScam();
});

renderScam();

// =========================================================
// SECTION 3: CYBERSECURITY LEARNING CARDS
// =========================================================

const learningCards = [
  {
    title: "Strong Passwords",
    text: "A strong password is long, unique, and hard to guess.",
    takeaway: "Use 12+ characters and a password manager to generate and store unique passwords for every account."
  },
  {
    title: "Two-Factor Authentication",
    text: "2FA adds a second layer of proof beyond your password.",
    takeaway: "Enable 2FA on your email first — it's the account attackers use to reset everything else."
  },
  {
    title: "Phishing",
    text: "Phishing tricks you into giving up information through fake urgency or impersonation.",
    takeaway: "Pause before clicking. Go to sites directly instead of following links in messages."
  },
  {
    title: "Account Security",
    text: "Your accounts are only as secure as your weakest habit.",
    takeaway: "Review your account activity and connected devices periodically to spot anything unfamiliar."
  },
  {
    title: "Public Wi-Fi",
    text: "Open networks can expose your data to others on the same network.",
    takeaway: "Avoid logging into sensitive accounts on public Wi-Fi, or use a trusted VPN."
  },
  {
    title: "Privacy Settings",
    text: "Default settings are often more open than you'd expect.",
    takeaway: "Check who can see your posts, location, and contact info at least a few times a year."
  },
  {
    title: "AI-Generated Scams & Deepfakes",
    text: "AI tools now make fake voices, videos, and messages easier to create convincingly.",
    takeaway: "If an urgent request from someone you know feels off, verify through a separate, known channel."
  }
];

const learningCardsGrid = document.getElementById('learningCardsGrid');

learningCards.forEach(card => {
  const cardEl = document.createElement('div');
  cardEl.className = 'learning-card';
  cardEl.innerHTML = `
    <div>
      <p class="learning-card-title">${card.title}</p>
      <p class="learning-card-text">${card.text}</p>
    </div>
    <p class="learning-card-takeaway">${card.takeaway}</p>
  `;
  cardEl.addEventListener('click', () => {
    cardEl.classList.toggle('flipped');
  });
  learningCardsGrid.appendChild(cardEl);
});

// =========================================================
// SECTION 4: SDG CONNECT / PROJECT BUILDER
// =========================================================

const problems = ["Cybersecurity awareness", "Digital literacy", "Online privacy", "Youth opportunities", "Education", "Community safety"];
const contributions = ["Technology", "Research", "Communication", "Design", "Leadership", "Education"];
const partners = ["School", "Youth organization", "NGO", "University", "Local community", "Technology company"];

let selectedProblem = null;
let selectedContribution = null;
let selectedPartner = null;

function renderChips(containerId, items, onSelect) {
  const container = document.getElementById(containerId);
  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = item;
    chip.addEventListener('click', () => {
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      onSelect(item);
    });
    container.appendChild(chip);
  });
}

const generateBtn = document.getElementById('generateProject');

function checkBuilderComplete() {
  generateBtn.disabled = !(selectedProblem && selectedContribution && selectedPartner);
}

renderChips('problemChips', problems, (val) => { selectedProblem = val; checkBuilderComplete(); });
renderChips('contributionChips', contributions, (val) => { selectedContribution = val; checkBuilderComplete(); });
renderChips('partnerChips', partners, (val) => { selectedPartner = val; checkBuilderComplete(); });

const solutionTemplates = {
  "Cybersecurity awareness": "a series of workshops and interactive resources that teach practical digital safety habits",
  "Digital literacy": "a peer-led program that builds core digital skills through hands-on sessions",
  "Online privacy": "a campaign and toolkit that helps people understand and control their digital footprint",
  "Youth opportunities": "a mentorship and resource-sharing initiative connecting young people to opportunities",
  "Education": "a set of accessible learning resources built around a real community need",
  "Community safety": "a community-driven awareness initiative focused on practical, everyday safety"
};

document.getElementById('generateProject').addEventListener('click', () => {
  const projectName = `${selectedProblem} × ${selectedPartner} Initiative`;

  document.getElementById('projectName').textContent = projectName;
  document.getElementById('projectProblem').textContent =
    `Many young people and communities face challenges related to ${selectedProblem.toLowerCase()}, often without accessible resources to address them.`;
  document.getElementById('projectSolution').textContent =
    `Develop ${solutionTemplates[selectedProblem]}, led by youth and shaped by real community input.`;
  document.getElementById('projectContribution').textContent =
    `Bringing ${selectedContribution.toLowerCase()} skills to design, build, and drive the initiative forward.`;
  document.getElementById('projectPartner').textContent =
    `Partnering with a ${selectedPartner.toLowerCase()} to provide reach, resources, and credibility.`;
  document.getElementById('projectSDG').textContent =
    `This project reflects SDG 17 by combining youth-led action with an established partner, showing how collaboration across sectors turns awareness into real impact.`;

  document.getElementById('projectOutput').hidden = false;
});