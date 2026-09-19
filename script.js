// =========================================================
// CYBERSAFE CONNECT — MAIN SCRIPT
// =========================================================

// ---------- MOBILE NAV ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// =========================================================
// BADGES
// =========================================================

const badgeDefs = [
  { id: 'explorer', icon: '🛡️', label: 'Digital Safety Explorer' },
  { id: 'strategist', icon: '🧭', label: 'Scenario Strategist' },
  { id: 'learner', icon: '📚', label: 'Learning Hub Explorer' },
  { id: 'builder', icon: '🌍', label: 'Project Builder' }
];

function getEarnedBadges() {
  try { return JSON.parse(localStorage.getItem('csc-badges') || '[]'); }
  catch { return []; }
}

function earnBadge(id) {
  const earned = getEarnedBadges();
  if (!earned.includes(id)) {
    earned.push(id);
    localStorage.setItem('csc-badges', JSON.stringify(earned));
    renderBadges();
  }
}

function renderBadges() {
  const earned = getEarnedBadges();
  const container = document.getElementById('badgesInner');
  container.innerHTML = '';
  badgeDefs.forEach(b => {
    const chip = document.createElement('div');
    chip.className = 'badge-chip' + (earned.includes(b.id) ? ' earned' : '');
    chip.innerHTML = `<span class="badge-icon">${b.icon}</span><span>${b.label}</span>`;
    container.appendChild(chip);
  });
}
renderBadges();

// =========================================================
// 01 — DIGITAL SAFETY ASSESSMENT
// =========================================================

const categories = [
  {
    key: "Passwords",
    question: "How do you usually create passwords for your online accounts?",
    options: [
      { text: "I reuse the same password everywhere", score: 1 },
      { text: "I use a few different passwords for different sites", score: 2 },
      { text: "I use a unique, strong password for each account", score: 3 }
    ],
    advice: {
      1: "Start with your email and banking accounts — give each a unique password using a password manager.",
      2: "You're partway there. Extend unique passwords to every account, not just the important ones.",
      3: "Strong habit. Keep using a password manager so this stays easy as you add more accounts."
    }
  },
  {
    key: "Two-Factor Authentication",
    question: "Do you use two-factor authentication (2FA) on your important accounts?",
    options: [
      { text: "I've never heard of it or never set it up", score: 1 },
      { text: "I use it on some accounts", score: 2 },
      { text: "I use it on all my important accounts", score: 3 }
    ],
    advice: {
      1: "Turn on 2FA on your email first — it's the account attackers use to reset everything else.",
      2: "Good start — extend 2FA to your banking and social accounts too.",
      3: "This alone blocks most account takeovers. Keep it up."
    }
  },
  {
    key: "Phishing Awareness",
    question: "You receive a message saying you've won a new phone. It contains a link asking you to enter your personal information. What do you do?",
    options: [
      { text: "Click the link and fill in the details — I don't want to miss out", score: 1 },
      { text: "Feel unsure but click anyway just in case", score: 2 },
      { text: "Ignore it and check the sender's address before doing anything", score: 3 }
    ],
    advice: {
      1: "Unsolicited prizes asking for personal info are a classic phishing pattern — verify the sender before clicking anything.",
      2: "Trust that instinct — if something feels off, it usually is.",
      3: "Exactly right. Checking the sender before acting is the safest habit there is."
    }
  },
  {
    key: "Privacy Settings",
    question: "How often do you check the privacy settings on your social media accounts?",
    options: [
      { text: "Never — I use the default settings", score: 1 },
      { text: "Occasionally, when I remember", score: 2 },
      { text: "Regularly, I review them often", score: 3 }
    ],
    advice: {
      1: "Defaults are often more open than expected — spend 10 minutes reviewing who can see your posts and info.",
      2: "Set a recurring reminder every few months so this doesn't slip.",
      3: "Great habit — this alone prevents a lot of oversharing risk."
    }
  },
  {
    key: "Public Wi-Fi",
    question: "When you're on public Wi-Fi, what do you typically do?",
    options: [
      { text: "Use it normally for everything, including banking or payment apps", score: 1 },
      { text: "Use it for casual browsing only", score: 2 },
      { text: "Avoid sensitive activity or use a VPN", score: 3 }
    ],
    advice: {
      1: "Switch to mobile data before logging into anything sensitive on public networks.",
      2: "Good instinct — consider a VPN for the rare times you do need something sensitive.",
      3: "This is the safest approach — you're protecting the moments that matter most."
    }
  },
  {
    key: "Suspicious Links",
    question: "A friend's account sends you a strange link with no context. What's your reaction?",
    options: [
      { text: "Click it since it's from a friend", score: 1 },
      { text: "Hover over it to check, then decide", score: 2 },
      { text: "Message them separately to confirm before clicking", score: 3 }
    ],
    advice: {
      1: "Compromised accounts send links like this constantly — verify through another channel first.",
      2: "Checking the link helps, but confirming with the actual person is more reliable.",
      3: "This is the gold standard response — you're protecting both yourself and your friend."
    }
  },
  {
    key: "AI & Deepfakes",
    question: "You see a video of someone you know saying something completely out of character. What do you do?",
    options: [
      { text: "Believe it right away since the video looks real", score: 1 },
      { text: "Feel suspicious but share it anyway to ask others", score: 2 },
      { text: "Pause, check for other sources, and verify with the person directly if possible", score: 3 }
    ],
    advice: {
      1: "AI-generated video and voice can now look and sound convincing — video quality alone isn't proof anymore.",
      2: "Sharing before verifying spreads potential misinformation faster — check first, share after.",
      3: "Exactly the right instinct — verifying before believing or sharing is the core skill here."
    }
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
  const q = categories[currentQuestion];
  quizQuestionEl.textContent = q.question;
  quizCounterEl.textContent = `Question ${currentQuestion + 1} of ${categories.length}`;
  quizProgressBar.style.width = `${((currentQuestion + 1) / categories.length) * 100}%`;
  quizBackBtn.disabled = currentQuestion === 0;

  quizOptionsEl.innerHTML = '';
  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt.text;
    if (quizAnswers[currentQuestion] === index) btn.classList.add('selected');
    btn.addEventListener('click', () => selectAnswer(index));
    quizOptionsEl.appendChild(btn);
  });
}

function selectAnswer(index) {
  quizAnswers[currentQuestion] = index;
  if (currentQuestion < categories.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResults();
  }
}

quizBackBtn.addEventListener('click', () => {
  if (currentQuestion > 0) { currentQuestion--; renderQuestion(); }
});

function showResults() {
  quizCard.hidden = true;
  resultsCard.hidden = false;
  earnBadge('explorer');

  const totalScore = quizAnswers.reduce((sum, ai, i) => sum + categories[i].options[ai].score, 0);
  const percentage = Math.round((totalScore / (categories.length * 3)) * 100);
  document.getElementById('scoreNumber').textContent = percentage;

  let level;
  if (percentage >= 80) level = "Excellent";
  else if (percentage >= 60) level = "Good";
  else if (percentage >= 40) level = "Needs Improvement";
  else level = "At Risk";
  document.getElementById('resultsLevel').textContent = level;

  const compareEl = document.getElementById('resultsCompare');
  const previous = localStorage.getItem('csc-previous-score');
  if (previous !== null) {
    const prev = parseInt(previous, 10);
    const diff = percentage - prev;
    let diffText;
    if (diff > 0) diffText = `up ${diff} points`;
    else if (diff < 0) diffText = `down ${Math.abs(diff)} points`;
    else diffText = `unchanged`;
    compareEl.hidden = false;
    compareEl.textContent = `Previous attempt: ${prev}% → This attempt: ${percentage}% (${diffText})`;
  } else {
    compareEl.hidden = true;
  }
  localStorage.setItem('csc-previous-score', percentage);

  const grid = document.getElementById('categoryGrid');
  grid.innerHTML = '';
  categories.forEach((cat, i) => {
    const score = cat.options[quizAnswers[i]].score;
    const pct = (score / 3) * 100;
    const card = document.createElement('div');
    card.className = 'category-card ' + (score === 1 ? 'weak' : score === 3 ? 'strong' : '');
    card.innerHTML = `
      <p class="category-name">${cat.key}</p>
      <div class="category-bar-track"><div class="category-bar-fill" style="width:${pct}%"></div></div>
      <p class="category-advice">${cat.advice[score]}</p>
    `;
    grid.appendChild(card);
  });
}

document.getElementById('retakeQuiz').addEventListener('click', () => {
  currentQuestion = 0; quizAnswers = [];
  resultsCard.hidden = true; quizCard.hidden = false;
  renderQuestion();
});

renderQuestion();

// =========================================================
// 02 — WHAT WOULD YOU DO?
// =========================================================

const scenarios = [
  {
    situation: "Someone calls claiming to be from your bank's security team. They say there's suspicious activity and ask you to read them the verification code just texted to your phone.",
    options: [
      { text: "Read them the code so they can secure your account", best: false, feedback: "Real banks never ask you to read back a verification code — that code is proof of identity meant only for you." },
      { text: "Stay on the call but ask them to email you proof first", best: false, feedback: "Staying engaged with an unverified caller still risks being pressured into sharing something. Verify independently instead." },
      { text: "Hang up and call your bank directly using the number on your card or app", best: true, feedback: "Verifying through a channel you already know is legitimate — never the one that contacted you — is the safest response." }
    ]
  },
  {
    situation: "A friend's account sends you a link with no context — just \"check this out\".",
    options: [
      { text: "Click it right away since it's from a friend you trust", best: false, feedback: "Friends' accounts get hijacked constantly — treat a link with zero context as suspicious until confirmed." },
      { text: "Message your friend on a different app or in person to ask if they sent it", best: true, feedback: "Confirming through a separate channel is the safest move." },
      { text: "Ignore it completely and never mention it", best: false, feedback: "Ignoring it doesn't help your friend — if their account is hacked, telling them helps them regain control faster." }
    ]
  },
  {
    situation: "You're locked out of your social media account, and posts you didn't make start appearing.",
    options: [
      { text: "Wait a day to see if it fixes itself", best: false, feedback: "Every hour a compromised account stays active, it can scam your contacts or post more damaging content." },
      { text: "Use the platform's official 'account hacked' recovery flow immediately and warn close contacts", best: true, feedback: "Acting fast through the real recovery process, plus warning people who might get targeted, limits the damage." },
      { text: "Post publicly asking your followers what's going on", best: false, feedback: "Public posts don't recover your account and can tip off the attacker to change your recovery info first." }
    ]
  },
  {
    situation: "You discover someone has created a fake account pretending to be you.",
    options: [
      { text: "Message the fake account asking them to stop", best: false, feedback: "Engaging directly rarely works — impersonators are reported and removed, not negotiated with." },
      { text: "Report the account to the platform with proof of your identity, and let close contacts know", best: true, feedback: "Reporting through official channels gets it removed, and a heads-up prevents people who know you from being fooled." },
      { text: "Do nothing since it will probably go away on its own", best: false, feedback: "Impersonation accounts are often used to scam people who trust you — waiting gives them more time." }
    ]
  },
  {
    situation: "You get a QR code from a stranger at a public event offering a free gift if you scan it.",
    options: [
      { text: "Scan it right away — free gifts are worth trying", best: false, feedback: "Malicious QR codes can send you to fake login pages or trigger downloads without you realizing what happened." },
      { text: "Scan it but don't enter any information on the page it opens", best: false, feedback: "Even opening the page can expose your device to a malicious redirect — the safest move is not scanning unverified codes at all." },
      { text: "Skip it — unknown QR codes from strangers aren't worth the risk", best: true, feedback: "QR codes hide their destination until you scan them, which is exactly why unsolicited ones from strangers deserve skepticism." }
    ]
  },
  {
    situation: "You receive a message on WhatsApp saying you've won a scholarship from an organization you've never heard of, asking for a small 'processing fee' to claim it.",
    options: [
      { text: "Pay the fee since scholarships are competitive and it seems worth the risk", best: false, feedback: "Legitimate scholarships never require payment to receive them — this is one of the most common youth-targeted scams worldwide." },
      { text: "Share the message with friends so they can apply too", best: false, feedback: "Sharing before verifying spreads the scam further before anyone's had a chance to check if it's real." },
      { text: "Research the organization independently and don't send any payment", best: true, feedback: "Verifying the organization exists — and remembering real opportunities never charge you to receive them — is the safest response." }
    ]
  },
  {
    situation: "Someone in a game or app you use asks you to download an unknown file to 'unlock a feature.'",
    options: [
      { text: "Download and open it to see what it is", best: false, feedback: "Unknown files are one of the most common ways malware spreads — opening one can silently compromise your device." },
      { text: "Ask them what it is and why, through a separate channel if anything feels off", best: true, feedback: "Confirming intent before opening anything unexpected is the safest way to avoid malware." },
      { text: "Forward it to a friend to open first and see if it's safe", best: false, feedback: "This just moves the risk to someone else — an unknown file isn't safer for another person to open." }
    ]
  },
  {
    situation: "You receive a threatening or manipulative message demanding you send money or personal images.",
    options: [
      { text: "Comply immediately to make it stop", best: false, feedback: "Complying rarely ends it — it often signals you're willing to pay, which can lead to repeated demands." },
      { text: "Don't respond, save evidence, and tell a trusted adult or report it", best: true, feedback: "Saving evidence and involving someone who can help is the safest path — you are not obligated to respond." },
      { text: "Respond angrily to make them leave you alone", best: false, feedback: "Engaging at all, even to push back, confirms the account is active and can escalate things." }
    ]
  }
];

let scenarioIndex = 0;
let scenarioBestCount = 0;
let scenarioAnswered = false;

const scenarioSituationEl = document.getElementById('scenarioSituation');
const scenarioOptionsEl = document.getElementById('scenarioOptions');
const scenarioCounterEl = document.getElementById('scenarioCounter');
const scenarioFeedbackEl = document.getElementById('scenarioFeedback');
const scenarioNextBtn = document.getElementById('scenarioNext');
const scenarioCard = document.getElementById('scenarioCard');
const scenarioSummary = document.getElementById('scenarioSummary');

function renderScenario() {
  const s = scenarios[scenarioIndex];
  scenarioSituationEl.textContent = s.situation;
  scenarioCounterEl.textContent = `Scenario ${scenarioIndex + 1} of ${scenarios.length}`;
  scenarioFeedbackEl.hidden = true;
  scenarioNextBtn.hidden = true;
  scenarioAnswered = false;

  scenarioOptionsEl.innerHTML = '';
  s.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'scenario-option';
    btn.textContent = opt.text;
    btn.addEventListener('click', () => {
      if (scenarioAnswered) return;
      scenarioAnswered = true;
      if (opt.best) scenarioBestCount++;

      scenarioOptionsEl.querySelectorAll('.scenario-option').forEach(b => b.disabled = true);
      btn.classList.add(opt.best ? 'correct-pick' : 'wrong-pick');

      scenarioFeedbackEl.hidden = false;
      scenarioFeedbackEl.className = 'scenario-feedback ' + (opt.best ? 'best' : 'risky');
      scenarioFeedbackEl.textContent = opt.feedback;
      scenarioNextBtn.hidden = false;
    });
    scenarioOptionsEl.appendChild(btn);
  });
}

scenarioNextBtn.addEventListener('click', () => {
  scenarioIndex++;
  if (scenarioIndex < scenarios.length) {
    renderScenario();
  } else {
    scenarioCard.hidden = true;
    scenarioSummary.hidden = false;
    document.getElementById('scenarioSummaryText').textContent =
      `You chose the safest response ${scenarioBestCount} out of ${scenarios.length} times`;
    earnBadge('strategist');
  }
});

document.getElementById('scenarioRestart').addEventListener('click', () => {
  scenarioIndex = 0; scenarioBestCount = 0;
  scenarioSummary.hidden = true; scenarioCard.hidden = false;
  renderScenario();
});

renderScenario();

// =========================================================
// 03 — LEARNING HUB
// =========================================================

const hubTopics = [
  { icon: "🔐", title: "Passwords & MFA",
    learn: "A strong password is long, unique, and different for every account. Multi-factor authentication (MFA) adds a second proof of identity so a stolen password alone isn't enough to get in.",
    try: { question: "Which is the strongest password practice?", options: [
      { text: "One strong password, reused everywhere", correct: false, feedback: "Reusing even a strong password means one breach exposes every account that shares it." },
      { text: "A unique password for every account, in a password manager", correct: true, feedback: "Uniqueness limits damage, and a manager makes it practical." },
      { text: "Changing your password every week", correct: false, feedback: "Frequent forced changes often lead to weaker, predictable passwords." }
    ]},
    challenge: { question: "What's the single most effective addition beyond a strong password?", options: [
      { text: "A password hint question", correct: false, feedback: "Hint questions are often guessable or findable on social media." },
      { text: "Two-factor authentication (2FA)", correct: true, feedback: "Even a stolen password isn't enough — the attacker also needs your phone or authenticator." },
      { text: "A longer but easy-to-remember password", correct: false, feedback: "Length helps, but doesn't stop an attacker who already has it from a breach." }
    ]}
  },
  { icon: "🎣", title: "Phishing & Scams",
    learn: "Phishing tricks you into giving up information or money by faking urgency, authority, or trust — check the sender's address before clicking any link.",
    try: { question: "What's the biggest red flag in most phishing messages?", options: [
      { text: "A professional-looking logo", correct: false, feedback: "Attackers can copy logos perfectly — visuals alone don't prove legitimacy." },
      { text: "Urgent pressure to act immediately", correct: true, feedback: "Urgency is designed to stop you from thinking it through." },
      { text: "Being sent by email instead of text", correct: false, feedback: "Phishing happens over every channel." }
    ]},
    challenge: { question: "A message says your package needs a small redelivery fee. What should you do?", options: [
      { text: "Pay the small fee since it's cheap", correct: false, feedback: "Small fees are a common trick to harvest card details." },
      { text: "Check delivery status through the courier's official app directly", correct: true, feedback: "Going straight to the source avoids the scam entirely." },
      { text: "Reply asking for more details", correct: false, feedback: "Replying confirms your contact info is active, inviting more attempts." }
    ]}
  },
  { icon: "📱", title: "Social Media Privacy",
    learn: "Default privacy settings are often more open than expected. What you post, tag, and allow to be public can reach far more people than just your followers.",
    try: { question: "Which setting change has the biggest privacy impact?", options: [
      { text: "Changing your profile picture", correct: false, feedback: "This doesn't affect who can see your information." },
      { text: "Setting your account to private and reviewing who can see posts", correct: true, feedback: "This directly controls your actual audience." },
      { text: "Adding a bio description", correct: false, feedback: "This doesn't change visibility of your content." }
    ]},
    challenge: { question: "A friend's public post tags you and reveals your location. Safest move?", options: [
      { text: "Leave it, it's not a big deal", correct: false, feedback: "Location details in public posts can be used for stalking or targeted scams." },
      { text: "Ask them to remove the location or make it private, and check your own tag settings", correct: true, feedback: "Addressing both the post and your own settings limits future exposure." },
      { text: "Delete your own account", correct: false, feedback: "An extreme reaction to a fixable setting issue." }
    ]}
  },
  { icon: "🕵️", title: "Digital Footprints",
    learn: "Everything you post, like, and search builds a permanent picture of you that others — including future employers or schools — can find.",
    try: { question: "What best describes a 'digital footprint'?", options: [
      { text: "Just your search history", correct: false, feedback: "Footprints include posts, comments, tags, and old accounts too." },
      { text: "The trail of data you leave across the internet over time", correct: true, feedback: "This is the accurate definition." },
      { text: "Something only visible to hackers", correct: false, feedback: "Most of it is visible to anyone who looks." }
    ]},
    challenge: { question: "A program may review your public presence. Most useful step?", options: [
      { text: "Delete every account right before applying", correct: false, feedback: "Sudden deletion can look suspicious and erases good content too." },
      { text: "Search your own name and clean up anything you wouldn't want a reviewer to see", correct: true, feedback: "Auditing your footprint gives you control over the impression it creates." },
      { text: "Assume nobody actually checks", correct: false, feedback: "Many programs do check — a risky assumption." }
    ]}
  },
  { icon: "💻", title: "Device Security",
    learn: "Your phone and laptop hold more personal information than almost anything else you own. Updates and screen locks are your first line of defense.",
    try: { question: "Why do security updates matter so much?", options: [
      { text: "They add new features", correct: false, feedback: "That's not their security purpose." },
      { text: "They patch security holes attackers actively exploit", correct: true, feedback: "Delayed updates leave known weaknesses open." },
      { text: "They're optional and mostly unnecessary", correct: false, feedback: "Skipping them leaves your device vulnerable." }
    ]},
    challenge: { question: "Your phone is lost in public. What matters most?", options: [
      { text: "Hoping whoever finds it is honest", correct: false, feedback: "Luck isn't a security strategy." },
      { text: "Having a screen lock and remote-wipe set up beforehand", correct: true, feedback: "These need to be set up in advance to prevent data access." },
      { text: "Having a colorful phone case", correct: false, feedback: "This doesn't affect data security." }
    ]}
  },
  { icon: "🌐", title: "Public Wi-Fi",
    learn: "Open Wi-Fi networks can expose your traffic to others on the same network — sensitive activity deserves extra caution there.",
    try: { question: "Safest way to check your bank balance on public Wi-Fi?", options: [
      { text: "Log in through the cafe's Wi-Fi normally", correct: false, feedback: "Shared networks can expose login sessions to others nearby." },
      { text: "Use mobile data or a trusted VPN instead", correct: true, feedback: "Both avoid exposing sensitive traffic to a shared network." },
      { text: "Use Wi-Fi but in 'incognito' mode", correct: false, feedback: "Incognito hides local history — it does nothing for network-level protection." }
    ]},
    challenge: { question: "A network name looks nearly identical to a real cafe's. What now?", options: [
      { text: "Connect to whichever has stronger signal", correct: false, feedback: "Signal strength says nothing about legitimacy." },
      { text: "Ask staff which network is official first", correct: true, feedback: "Confirming with staff is the only reliable way to avoid a fake network." },
      { text: "Connect to both to compare", correct: false, feedback: "Connecting to an unverified network still exposes your device." }
    ]}
  },
  { icon: "🤖", title: "AI Scams & Deepfakes",
    learn: "AI tools can now generate convincing fake voices, videos, and messages — urgent requests from people you know deserve a quick, separate-channel check.",
    try: { question: "A voice sounding exactly like family urgently asks for money. First step?", options: [
      { text: "Send money right away since it sounds exactly like them", correct: false, feedback: "AI voice cloning can convincingly mimic real voices from seconds of audio." },
      { text: "Call or message them through a number you already know is theirs", correct: true, feedback: "Verifying through a known channel defeats almost every impersonation attempt." },
      { text: "Ask a personal question and trust the answer", correct: false, feedback: "An attacker with leaked info could still answer correctly." }
    ]},
    challenge: { question: "A viral video shows someone saying something out of character. Best response?", options: [
      { text: "Share it immediately since it's already popular", correct: false, feedback: "Popularity doesn't verify authenticity." },
      { text: "Check if reputable sources report the same statement first", correct: true, feedback: "Cross-checking is the most effective way to catch synthetic media." },
      { text: "Assume it's real because the quality looks good", correct: false, feedback: "High quality is no longer a reliable sign of authenticity." }
    ]}
  },
  { icon: "💳", title: "Online Financial Safety",
    learn: "Legitimate services don't ask for full card details or one-time codes over chat, email, or phone.",
    try: { question: "A text says your card was declined, with a link to re-enter details. What should you do?", options: [
      { text: "Click the link and re-enter your info", correct: false, feedback: "Real declines are shown in the app, not fixed by text link." },
      { text: "Open your banking app directly to check", correct: true, feedback: "Going straight to the source avoids exposing your details." },
      { text: "Reply asking if it's legitimate", correct: false, feedback: "Scammers will simply confirm it's real." }
    ]},
    challenge: { question: "A seller asks for a personal transfer instead of the platform's payment system. Safest?", options: [
      { text: "Pay that way since it's more convenient", correct: false, feedback: "Personal transfers usually have no buyer protection." },
      { text: "Insist on the platform's payment system, or walk away", correct: true, feedback: "Official systems typically include dispute resolution." },
      { text: "Send half the payment as a compromise", correct: false, feedback: "Partial payment doesn't protect you." }
    ]}
  },
  { icon: "👥", title: "Cyberbullying & Boundaries",
    learn: "Cyberbullying includes harassment or exclusion through messages, comments, or shared content. Setting boundaries protects you and people around you.",
    try: { question: "A classmate keeps sending mean comments. Most effective first step?", options: [
      { text: "Respond with something equally harsh", correct: false, feedback: "Escalating rarely stops the behavior." },
      { text: "Block them, save evidence, and tell a trusted adult", correct: true, feedback: "This removes the contact while creating a record and involving help." },
      { text: "Ignore it and hope it stops", correct: false, feedback: "Sustained harassment usually needs reporting to actually stop." }
    ]},
    challenge: { question: "A group chat is excluding and mocking one classmate. Most constructive move?", options: [
      { text: "Stay in the chat but say nothing", correct: false, feedback: "Silent presence doesn't stop the harm." },
      { text: "Leave the chat and, if safe, support the classmate or tell an adult", correct: true, feedback: "This actually interrupts the pattern." },
      { text: "Screenshot it to laugh about later", correct: false, feedback: "This adds to the harm and spreads it further." }
    ]}
  },
  { icon: "🪪", title: "Digital Identity",
    learn: "Your digital identity is how platforms, and other people, recognize and verify you online. Protecting it means being deliberate about what you share and where.",
    try: { question: "What's the safest approach to your digital identity?", options: [
      { text: "Use the exact same profile info everywhere for consistency", correct: false, feedback: "Identical info everywhere makes it easier to link and target all your accounts at once." },
      { text: "Vary what personal info is visible depending on the platform's purpose", correct: true, feedback: "Limiting exposure per platform reduces how much any single breach can reveal about you." },
      { text: "Post your full details publicly so people trust it's really you", correct: false, feedback: "Public full details help both real contacts and attackers equally." }
    ]},
    challenge: { question: "A site you barely use asks you to verify your identity with a photo of your ID. What's smart?", options: [
      { text: "Send it immediately since they asked", correct: false, feedback: "Unnecessary ID requests from low-trust sites are a common data-harvesting tactic." },
      { text: "Check if the request is genuinely necessary and the site is reputable first", correct: true, feedback: "ID documents are sensitive — verify necessity and legitimacy before sharing." },
      { text: "Send a photo of a friend's ID instead", correct: false, feedback: "This creates a real problem for someone else and doesn't solve the actual risk." }
    ]}
  }
];

const hubGrid = document.getElementById('hubGrid');
const hubDetail = document.getElementById('hubDetail');
const hubDetailTitle = document.getElementById('hubDetailTitle');
const hubTabContent = document.getElementById('hubTabContent');
let activeHubTopic = null;

function getOpenedTopics() {
  try { return JSON.parse(localStorage.getItem('csc-hub-opened') || '[]'); }
  catch { return []; }
}

hubTopics.forEach((topic, i) => {
  const tile = document.createElement('div');
  tile.className = 'hub-tile';
  tile.setAttribute('tabindex', '0');
  tile.setAttribute('role', 'button');
  tile.innerHTML = `<div class="hub-tile-icon">${topic.icon}</div><p class="hub-tile-title">${topic.title}</p>`;
  tile.addEventListener('click', () => openHubTopic(i));
  tile.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openHubTopic(i); } });
  hubGrid.appendChild(tile);
});

function openHubTopic(i) {
  activeHubTopic = i;
  hubDetail.hidden = false;
  hubDetailTitle.textContent = hubTopics[i].icon + ' ' + hubTopics[i].title;
  setHubTab('learn');
  hubDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const opened = getOpenedTopics();
  if (!opened.includes(i)) {
    opened.push(i);
    localStorage.setItem('csc-hub-opened', JSON.stringify(opened));
    if (opened.length >= 3) earnBadge('learner');
  }
}

document.getElementById('hubClose').addEventListener('click', () => { hubDetail.hidden = true; });

['tabLearn', 'tabTry', 'tabChallenge'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    setHubTab(document.getElementById(id).dataset.tab);
  });
});

function setHubTab(tab) {
  document.querySelectorAll('.hub-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const topic = hubTopics[activeHubTopic];

  if (tab === 'learn') {
    hubTabContent.innerHTML = `<p>${topic.learn}</p>`;
    return;
  }

  const data = tab === 'try' ? topic.try : topic.challenge;
  hubTabContent.innerHTML = `<p><strong>${data.question}</strong></p><div class="hub-options"></div>`;
  const container = hubTabContent.querySelector('.hub-options');
  data.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = tab === 'try' ? 'hub-try-option' : 'hub-challenge-option';
    btn.textContent = opt.text;
    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => b.disabled = true);
      btn.classList.add(opt.correct ? 'correct-pick' : 'wrong-pick');
      const fb = document.createElement('div');
      fb.className = 'hub-feedback';
      fb.textContent = opt.feedback;
      hubTabContent.appendChild(fb);
    });
    container.appendChild(btn);
  });
}

// =========================================================
// 04 — SDG CONNECT PROJECT BUILDER
// =========================================================

const sdgProblems = [
  { text: "Cybersecurity awareness", tags: ["SDG 4", "SDG 16", "SDG 17"], solution: "a series of workshops and interactive resources that teach practical digital safety habits" },
  { text: "Digital literacy", tags: ["SDG 4", "SDG 9", "SDG 17"], solution: "a peer-led program that builds core digital skills through hands-on sessions" },
  { text: "Online privacy", tags: ["SDG 16", "SDG 10", "SDG 17"], solution: "a campaign and toolkit that helps people understand and control their digital footprint" },
  { text: "Youth opportunities", tags: ["SDG 8", "SDG 4", "SDG 17"], solution: "a mentorship and resource-sharing initiative connecting young people to opportunities" },
  { text: "Education", tags: ["SDG 4", "SDG 17"], solution: "a set of accessible learning resources built around a real community need" },
  { text: "Community safety", tags: ["SDG 11", "SDG 16", "SDG 17"], solution: "a community-driven awareness initiative focused on practical, everyday safety" }
];
const sdgContributions = ["Technology", "Research", "Communication", "Design", "Leadership", "Education"];
const sdgPartners = ["School", "Youth organization", "NGO", "University", "Local community", "Technology company"];
const sdgReaches = ["10–50 people (a classroom or club)", "50–200 people (a school or local community)", "200–1,000 people (multiple schools or organizations)", "1,000+ people (a regional or online campaign)"];

let sdgSel = { problem: null, contribution: null, partner: null, reach: null };

function bindChips(containerId, items, selObj, key, labelFn) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach((item, i) => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = labelFn ? labelFn(item) : item;
    chip.addEventListener('click', () => {
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selObj[key] = i;
      checkComplete();
    });
    container.appendChild(chip);
  });
}

let checkComplete = () => {};

bindChips('sdgProblemChips', sdgProblems, sdgSel, 'problem', p => p.text);
bindChips('sdgContributionChips', sdgContributions, sdgSel, 'contribution');
bindChips('sdgPartnerChips', sdgPartners, sdgSel, 'partner');
bindChips('sdgReachChips', sdgReaches, sdgSel, 'reach');

const sdgGenerateBtn = document.getElementById('sdgGenerate');
checkComplete = function checkSdgComplete() {
  sdgGenerateBtn.disabled = !(sdgSel.problem !== null && sdgSel.contribution !== null && sdgSel.partner !== null && sdgSel.reach !== null);
};

sdgGenerateBtn.addEventListener('click', () => {
  const problem = sdgProblems[sdgSel.problem];
  const contribution = sdgContributions[sdgSel.contribution];
  const partner = sdgPartners[sdgSel.partner];
  const reach = sdgReaches[sdgSel.reach];

  document.getElementById('sdgName').textContent = `${problem.text} × ${partner} Initiative`;
  document.getElementById('sdgTags').innerHTML = problem.tags.map(t => `<span>${t}</span>`).join('');
  document.getElementById('sdgProblemText').textContent = `Many young people and communities face challenges related to ${problem.text.toLowerCase()}, often without accessible resources to address them.`;
  document.getElementById('sdgSolutionText').textContent = `Develop ${problem.solution}, led by youth and shaped by real community input.`;
  document.getElementById('sdgContributionText').textContent = `Bringing ${contribution.toLowerCase()} skills to design, build, and drive the initiative forward.`;
  document.getElementById('sdgPartnerText').textContent = `Partnering with a ${partner.toLowerCase()} to provide reach, resources, and credibility.`;
  document.getElementById('sdgImpactText').textContent = `If run as planned, this could realistically reach ${reach}, directly building safer digital habits in that group.`;
  document.getElementById('sdgConnectionText').textContent = `This project reflects SDG 17 by combining youth-led action with an established partner, showing how collaboration across sectors turns awareness into real impact.`;

  document.getElementById('sdgOutput').hidden = false;
  earnBadge('builder');
});

// =========================================================
// 05 — CAMPAIGN BUILDER
// =========================================================

const campAudiences = ["Students", "Parents & families", "Teachers & educators", "General public"];
const campTopics = ["Phishing", "Password security", "Social media privacy", "Public Wi-Fi safety", "AI scams & deepfakes", "Cyberbullying"];
const campFormats = ["Workshop", "Poster campaign", "Social media series", "Peer-to-peer training session"];
const campGoals = ["25 participants", "50 participants", "100 participants", "A full class or school year group"];

const campDeliverables = {
  "Workshop": "a slide presentation, a live scam-spotting activity, and a printed takeaway checklist",
  "Poster campaign": "a set of 3–5 posters placed in high-traffic areas, plus a QR code linking to more resources",
  "Social media series": "a short series of posts or videos, one per key idea, scheduled over two weeks",
  "Peer-to-peer training session": "a trained group of peer leaders, a simple facilitation guide, and a short feedback survey"
};

let campSel = { audience: null, topic: null, format: null, goal: null };
let checkCampComplete = () => {};

bindChips('campAudienceChips', campAudiences, campSel, 'audience');
bindChips('campTopicChips', campTopics, campSel, 'topic');
bindChips('campFormatChips', campFormats, campSel, 'format');
bindChips('campGoalChips', campGoals, campSel, 'goal');

const campGenerateBtn = document.getElementById('campGenerate');
checkCampComplete = function () {
  campGenerateBtn.disabled = !(campSel.audience !== null && campSel.topic !== null && campSel.format !== null && campSel.goal !== null);
};
checkComplete = function () { checkSdgCompleteWrapper(); checkCampComplete(); };
function checkSdgCompleteWrapper() {
  sdgGenerateBtn.disabled = !(sdgSel.problem !== null && sdgSel.contribution !== null && sdgSel.partner !== null && sdgSel.reach !== null);
}

campGenerateBtn.addEventListener('click', () => {
  const audience = campAudiences[campSel.audience];
  const topic = campTopics[campSel.topic];
  const format = campFormats[campSel.format];
  const goal = campGoals[campSel.goal];

  document.getElementById('campName').textContent = `${topic} Awareness Campaign for ${audience}`;
  document.getElementById('campAudienceText').textContent = `Designed for ${audience.toLowerCase()}, tailored to their everyday digital habits and risks.`;
  document.getElementById('campTopicText').textContent = `Centered on ${topic.toLowerCase()}, addressing one of the most common real-world digital risks.`;
  document.getElementById('campFormatText').textContent = `Delivered as a ${format.toLowerCase()}, chosen to fit the audience and available resources.`;
  document.getElementById('campGoalText').textContent = `Aiming to reach ${goal.toLowerCase()}.`;
  document.getElementById('campDeliverablesText').textContent = `Suggested deliverables: ${campDeliverables[format]}.`;

  document.getElementById('campOutput').hidden = false;
});