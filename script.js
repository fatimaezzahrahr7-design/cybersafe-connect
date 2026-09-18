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
// 01 — DIGITAL SAFETY SCORE
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
    question: "You get an urgent email saying your account will be suspended unless you click a link immediately. What do you do?",
    options: [
      { text: "Click the link right away to fix it", score: 1 },
      { text: "Feel unsure but click anyway just in case", score: 2 },
      { text: "Go directly to the official website instead of clicking", score: 3 }
    ],
    advice: {
      1: "Urgency is the biggest phishing signal. Practice pausing before clicking anything urgent.",
      2: "Trust that instinct — if something feels off, it usually is. Verify through the official site instead.",
      3: "Exactly right. Going direct instead of clicking through is the safest habit there is."
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
      { text: "Use it normally for everything, including banking", score: 1 },
      { text: "Use it for casual browsing only", score: 2 },
      { text: "Avoid sensitive activity or use a VPN", score: 3 }
    ],
    advice: {
      1: "Switch to mobile data or a VPN before logging into anything sensitive on public networks.",
      2: "Good instinct — consider a VPN for the rare times you do need something sensitive.",
      3: "This is the safest approach — you're already protecting the moments that matter most."
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
    key: "App Permissions",
    question: "When installing a new app, how do you handle permission requests (camera, contacts, location)?",
    options: [
      { text: "Accept all permissions without checking", score: 1 },
      { text: "Skim through them quickly", score: 2 },
      { text: "Review each one and only allow what's necessary", score: 3 }
    ],
    advice: {
      1: "Go into your settings now and review what apps you've already granted broad access to.",
      2: "Slow down slightly — a quick skim can miss an unnecessary camera or location request.",
      3: "This minimizes your exposure if any single app is ever compromised."
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

  const totalScore = quizAnswers.reduce((sum, ai, i) => sum + categories[i].options[ai].score, 0);
  const percentage = Math.round((totalScore / (categories.length * 3)) * 100);
  document.getElementById('scoreNumber').textContent = percentage;

  let level;
  if (percentage >= 80) level = "Excellent";
  else if (percentage >= 60) level = "Good";
  else if (percentage >= 40) level = "Needs Improvement";
  else level = "At Risk";
  document.getElementById('resultsLevel').textContent = level;

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
      { text: "Read them the code so they can secure your account", best: false, feedback: "Real banks never ask you to read back a verification code — that code is proof of identity meant only for you. Sharing it hands over control of your account." },
      { text: "Stay on the call but ask them to email you proof first", best: false, feedback: "Staying engaged with an unverified caller still risks being pressured into sharing something. Verify independently instead." },
      { text: "Hang up and call your bank directly using the number on your card or app", best: true, feedback: "Verifying through a channel you already know is legitimate — never the one that contacted you — is the safest response to any urgent account request." }
    ]
  },
  {
    situation: "A friend's account sends you a link with no context — just \"check this out\".",
    options: [
      { text: "Click it right away since it's from a friend you trust", best: false, feedback: "Friends' accounts get hijacked constantly — a link with zero context should be treated as suspicious until confirmed." },
      { text: "Message your friend on a different app or in person to ask if they sent it", best: true, feedback: "Confirming through a separate channel is the safest move — if their account is compromised, you'll find out before clicking anything." },
      { text: "Ignore it completely and never mention it", best: false, feedback: "Ignoring it doesn't help your friend — if their account is hacked, telling them helps them regain control faster." }
    ]
  },
  {
    situation: "You're locked out of your social media account, and weird posts you didn't make start appearing.",
    options: [
      { text: "Wait a day to see if it fixes itself", best: false, feedback: "Every hour a compromised account stays active, it can scam your contacts or post more damaging content — speed matters." },
      { text: "Use the platform's official 'account hacked' recovery flow immediately and warn close contacts", best: true, feedback: "Acting fast through the real recovery process, plus warning people who might get targeted, limits the damage." },
      { text: "Post publicly asking your followers what's going on", best: false, feedback: "Public posts don't recover your account and can tip off the attacker to change your recovery info first." }
    ]
  },
  {
    situation: "You discover someone has created a fake account pretending to be you.",
    options: [
      { text: "Message the fake account asking them to stop", best: false, feedback: "Engaging directly rarely works and can escalate things — impersonators are reported and removed, not negotiated with." },
      { text: "Report the account to the platform with proof of your identity, and let close contacts know", best: true, feedback: "Reporting through official channels gets it removed, and a heads-up prevents people who know you from being fooled." },
      { text: "Do nothing since it will probably go away on its own", best: false, feedback: "Impersonation accounts are often used to scam people who trust you — waiting gives them more time." }
    ]
  },
  {
    situation: "You accidentally share something meant to be private in a public post.",
    options: [
      { text: "Delete it and hope no one saw it", best: false, feedback: "Deleting helps, but screenshots can spread before you notice — check who may have already seen it." },
      { text: "Delete it immediately, check who interacted with it, and adjust the privacy setting that caused it", best: true, feedback: "Removing it fast, checking the damage, and fixing the setting prevents the same mistake from happening again." },
      { text: "Leave it up since it's already out there", best: false, feedback: "Leaving it up only increases how many people see it — removing it fast always limits the spread." }
    ]
  },
  {
    situation: "You receive a threatening or manipulative message demanding you send money or images.",
    options: [
      { text: "Pay or comply immediately to make it stop", best: false, feedback: "Complying rarely ends it — it often signals you're willing to pay, which can lead to repeated demands." },
      { text: "Don't respond, save evidence, and tell a trusted adult or report it", best: true, feedback: "Saving evidence and involving someone who can help is the safest path — you are not obligated to respond." },
      { text: "Respond angrily to make them leave you alone", best: false, feedback: "Engaging at all, even to push back, confirms the account is active and can escalate things." }
    ]
  },
  {
    situation: "Someone you don't know well sends you a file and says \"you have to see this.\"",
    options: [
      { text: "Download and open it to see what it is", best: false, feedback: "Unknown files are one of the most common ways malware spreads — opening one can silently compromise your device." },
      { text: "Ask the sender what it is and why, through a separate channel if anything feels off", best: true, feedback: "Confirming intent before opening anything unexpected is the safest way to avoid malware." },
      { text: "Forward it to a friend to open first and see if it's safe", best: false, feedback: "This just moves the risk to someone else — an unknown file isn't safer for another person to open." }
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
  {
    icon: "🔐", title: "Passwords & MFA",
    learn: "A strong password is long, unique, and different for every account. Multi-factor authentication (MFA) adds a second proof of identity — like a code sent to your phone — so a stolen password alone isn't enough to get in.",
    try: { question: "Which of these is the strongest password practice?", options: [
      { text: "One strong password, reused everywhere", correct: false, feedback: "Reusing even a strong password means one breach exposes every account that shares it." },
      { text: "A unique password for every account, stored in a password manager", correct: true, feedback: "This is what security professionals recommend — uniqueness limits damage, and a manager makes it practical." },
      { text: "Changing your password every week", correct: false, feedback: "Frequent forced changes often lead to weaker, predictable passwords — uniqueness and length matter more." }
    ]},
    challenge: { question: "You get a new banking app. What's the single most effective addition beyond a strong password?", options: [
      { text: "A password hint question", correct: false, feedback: "Hint questions are often guessable or findable on social media." },
      { text: "Two-factor authentication (2FA)", correct: true, feedback: "2FA means even a stolen password isn't enough — the attacker also needs your phone or authenticator." },
      { text: "A longer but easy-to-remember password", correct: false, feedback: "Length helps, but doesn't stop an attacker who already has the password from a breach or phishing." }
    ]}
  },
  {
    icon: "🎣", title: "Phishing & Scams",
    learn: "Phishing tricks you into giving up information or money by faking urgency, authority, or trust — a fake bank alert, a fake prize, or a message pretending to be someone you know.",
    try: { question: "What's the biggest red flag in most phishing messages?", options: [
      { text: "A professional-looking logo", correct: false, feedback: "Attackers can copy logos perfectly — visuals alone don't prove legitimacy." },
      { text: "Urgent pressure to act immediately", correct: true, feedback: "Urgency is designed to stop you from thinking it through — it's the most consistent phishing signal." },
      { text: "Being sent by email instead of text", correct: false, feedback: "Phishing happens over every channel — email, text, social media, and calls." }
    ]},
    challenge: { question: "A message says your package couldn't be delivered and asks for a small redelivery fee. What should you do?", options: [
      { text: "Pay the small fee since it's cheap", correct: false, feedback: "Small fees are a common trick to harvest card details." },
      { text: "Check your delivery status directly through the courier's official app or site", correct: true, feedback: "Checking through a channel you trust avoids the scam entirely." },
      { text: "Reply asking for more details", correct: false, feedback: "Replying confirms your contact info is active, which can invite more attempts." }
    ]}
  },
  {
    icon: "📱", title: "Social Media Privacy",
    learn: "Default privacy settings are often more open than people expect. What you post, tag, and allow to be public can be seen by far more people than just your followers.",
    try: { question: "Which setting change has the biggest privacy impact?", options: [
      { text: "Changing your profile picture", correct: false, feedback: "This doesn't affect who can see your information." },
      { text: "Setting your account to private and reviewing who can see your posts", correct: true, feedback: "This directly controls your actual audience, which is the core of privacy." },
      { text: "Adding a bio description", correct: false, feedback: "This doesn't change visibility of your content." }
    ]},
    challenge: { question: "You're tagged in a friend's public post that reveals your location. What's the safest move?", options: [
      { text: "Leave it, it's not a big deal", correct: false, feedback: "Location details in public posts can be used for stalking or targeted scams." },
      { text: "Ask your friend to remove the location or make the post private, and check your own tag settings", correct: true, feedback: "Addressing both the post and your own settings limits future exposure too." },
      { text: "Delete your own account", correct: false, feedback: "An extreme reaction to a fixable setting issue." }
    ]}
  },
  {
    icon: "🕵️", title: "Digital Footprints",
    learn: "Everything you post, like, and search builds a permanent picture of you that others — including future employers or schools — can find. Your digital footprint often outlives the moment you created it.",
    try: { question: "What best describes a 'digital footprint'?", options: [
      { text: "Just your search history", correct: false, feedback: "Search history is only one part — footprints include posts, comments, tags, and old accounts." },
      { text: "The trail of data and content you leave across the internet over time", correct: true, feedback: "This is the accurate definition — it accumulates from everything you do online." },
      { text: "Something only visible to hackers", correct: false, feedback: "Most of it is visible to anyone who looks, not just attackers." }
    ]},
    challenge: { question: "A program says it may review your public online presence. What's the most useful step?", options: [
      { text: "Delete every social account right before applying", correct: false, feedback: "Sudden deletion can look suspicious and erases genuinely good content too." },
      { text: "Search your own name, review what's public, and clean up anything you wouldn't want a reviewer to see", correct: true, feedback: "Auditing your own footprint gives you control over the impression it creates." },
      { text: "Assume nobody actually checks", correct: false, feedback: "Many programs do check — assuming otherwise is a risky bet." }
    ]}
  },
  {
    icon: "💻", title: "Device Security",
    learn: "Your phone and laptop hold more personal information than almost anything else you own. Updates, screen locks, and careful app permissions are your first line of defense if a device is lost or compromised.",
    try: { question: "Why do security updates matter so much?", options: [
      { text: "They add new features", correct: false, feedback: "That's not their security purpose, even if updates sometimes include extras." },
      { text: "They patch security holes that attackers actively exploit", correct: true, feedback: "Delayed updates leave known, exploitable weaknesses open on your device." },
      { text: "They're optional and mostly unnecessary", correct: false, feedback: "Skipping them leaves your device vulnerable to known attacks." }
    ]},
    challenge: { question: "Your phone is lost in a public place. What matters most for limiting the damage?", options: [
      { text: "Hoping whoever finds it is honest", correct: false, feedback: "Luck isn't a security strategy." },
      { text: "Having a screen lock, remote-wipe, and encrypted storage set up beforehand", correct: true, feedback: "These need to be set up in advance — they're what actually prevents access to your data." },
      { text: "Having a colorful phone case", correct: false, feedback: "This doesn't affect data security at all." }
    ]}
  },
  {
    icon: "🌐", title: "Public Wi-Fi",
    learn: "Open Wi-Fi networks — cafes, airports, libraries — can expose your traffic to others on the same network. It's not that public Wi-Fi is always dangerous, but sensitive activity deserves extra caution there.",
    try: { question: "What's the safest way to check your bank balance on public Wi-Fi?", options: [
      { text: "Log in through the cafe's Wi-Fi normally", correct: false, feedback: "Unencrypted or shared networks can expose login sessions to others nearby." },
      { text: "Use your phone's mobile data or a trusted VPN instead", correct: true, feedback: "Both avoid exposing sensitive traffic to a shared, unsecured network." },
      { text: "Use Wi-Fi but in 'incognito' browser mode", correct: false, feedback: "Incognito hides local history — it does nothing to protect traffic on the network itself." }
    ]},
    challenge: { question: "A public network has no password but a name nearly identical to a real cafe's network. What should you do?", options: [
      { text: "Connect to whichever has a stronger signal", correct: false, feedback: "Signal strength says nothing about legitimacy — fake networks are made to look identical." },
      { text: "Ask staff which network is official before connecting", correct: true, feedback: "Confirming with staff is the only reliable way to avoid a fake, traffic-intercepting network." },
      { text: "Connect to both to compare", correct: false, feedback: "Connecting to an unverified network still exposes your device, even briefly." }
    ]}
  },
  {
    icon: "🤖", title: "AI Scams & Deepfakes",
    learn: "AI tools can now generate convincing fake voices, videos, and messages. This doesn't mean distrusting everything — it means urgent, unusual requests from people you know deserve a quick, separate-channel check.",
    try: { question: "A voice message sounding exactly like family urgently asks for money. What's the smart first step?", options: [
      { text: "Send the money right away since it sounds exactly like them", correct: false, feedback: "AI voice cloning can convincingly mimic real voices from just seconds of audio." },
      { text: "Call or message them through a number/app you already know is theirs", correct: true, feedback: "Verifying through a channel you know is genuinely theirs defeats almost every impersonation attempt." },
      { text: "Ask the message a personal question and trust the answer", correct: false, feedback: "An attacker doing real-time research or using leaked info could still answer correctly — not a reliable test." }
    ]},
    challenge: { question: "A viral video shows a public figure saying something out of character. What's the best response?", options: [
      { text: "Share it immediately since it's already popular", correct: false, feedback: "Popularity doesn't verify authenticity — deepfakes spread fast precisely because they're shocking." },
      { text: "Check if reputable news sources are reporting the same statement first", correct: true, feedback: "Cross-checking with reliable sources is the most effective way to catch synthetic media." },
      { text: "Assume it's real because the video quality looks good", correct: false, feedback: "High video quality is no longer a reliable sign of authenticity." }
    ]}
  },
  {
    icon: "💳", title: "Online Financial Safety",
    learn: "Shopping, banking, and payment apps are prime targets for scams. Legitimate services don't ask for full card details or one-time codes over chat, email, or phone.",
    try: { question: "A text says your card was declined, with a link to 're-enter your details.' What should you do?", options: [
      { text: "Click the link and re-enter your card info", correct: false, feedback: "This is one of the most common scam formats — real declines are shown in the app, not fixed by text link." },
      { text: "Open your banking app directly to check your account status", correct: true, feedback: "Going straight to the source avoids exposing your details to a fake page." },
      { text: "Reply to the text asking if it's legitimate", correct: false, feedback: "Scammers will simply confirm it's real — replying doesn't verify anything." }
    ]},
    challenge: { question: "A secondhand seller online asks for a personal money transfer instead of the platform's payment system. What's safest?", options: [
      { text: "Pay that way since it's more convenient", correct: false, feedback: "Personal transfers usually have no buyer protection if the seller doesn't deliver." },
      { text: "Insist on the platform's built-in payment system, or walk away", correct: true, feedback: "Official payment systems typically include dispute resolution that personal transfers don't." },
      { text: "Send half the payment first as a compromise", correct: false, feedback: "Partial payment doesn't protect you — you can still lose that amount." }
    ]}
  },
  {
    icon: "👥", title: "Cyberbullying & Digital Boundaries",
    learn: "Cyberbullying includes harassment, exclusion, or humiliation carried out through messages, comments, or shared content. Setting digital boundaries — and knowing how to respond — protects you and people around you.",
    try: { question: "A classmate keeps sending mean comments online. What's the most effective first step?", options: [
      { text: "Respond with something equally harsh", correct: false, feedback: "Escalating rarely stops the behavior and can make things worse for both people." },
      { text: "Block them, save evidence, and tell a trusted adult or report it", correct: true, feedback: "This removes the contact while creating a record and involving someone who can help." },
      { text: "Ignore it and hope it stops on its own", correct: false, feedback: "This can work for one-off comments, but sustained harassment usually needs reporting to actually stop." }
    ]},
    challenge: { question: "A group chat is excluding and mocking one classmate. What's the most constructive thing you can do?", options: [
      { text: "Stay in the chat but say nothing", correct: false, feedback: "Silent presence doesn't stop the harm and can feel like tacit agreement." },
      { text: "Leave the chat and, if safe, reach out to the classmate or tell a trusted adult", correct: true, feedback: "Removing yourself and supporting the person affected actually interrupts the pattern." },
      { text: "Screenshot it to laugh about later", correct: false, feedback: "This adds to the harm and spreads the content further." }
    ]}
  }
];

const hubGrid = document.getElementById('hubGrid');
const hubDetail = document.getElementById('hubDetail');
const hubDetailTitle = document.getElementById('hubDetailTitle');
const hubTabContent = document.getElementById('hubTabContent');
let activeHubTopic = null;
let activeHubTab = 'learn';

hubTopics.forEach((topic, i) => {
  const tile = document.createElement('div');
  tile.className = 'hub-tile';
  tile.innerHTML = `<div class="hub-tile-icon">${topic.icon}</div><p class="hub-tile-title">${topic.title}</p>`;
  tile.addEventListener('click', () => openHubTopic(i));
  hubGrid.appendChild(tile);
});

function openHubTopic(i) {
  activeHubTopic = i;
  activeHubTab = 'learn';
  hubDetail.hidden = false;
  hubDetailTitle.textContent = hubTopics[i].icon + ' ' + hubTopics[i].title;
  setHubTab('learn');
  hubDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('hubClose').addEventListener('click', () => { hubDetail.hidden = true; });

['tabLearn', 'tabTry', 'tabChallenge'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    setHubTab(document.getElementById(id).dataset.tab);
  });
});

function setHubTab(tab) {
  activeHubTab = tab;
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

function renderChipGroup(containerId, items, key, labelFn) {
  const container = document.getElementById(containerId);
  items.forEach((item, i) => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = labelFn ? labelFn(item) : item;
    chip.addEventListener('click', () => {
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      sdgSel[key] = i;
      checkSdgComplete();
    });
    container.appendChild(chip);
  });
}
renderChipGroup('sdgProblemChips', sdgProblems, 'problem', p => p.text);
renderChipGroup('sdgContributionChips', sdgContributions, 'contribution');
renderChipGroup('sdgPartnerChips', sdgPartners, 'partner');
renderChipGroup('sdgReachChips', sdgReaches, 'reach');

const sdgGenerateBtn = document.getElementById('sdgGenerate');
function checkSdgComplete() {
  sdgGenerateBtn.disabled = !(sdgSel.problem !== null && sdgSel.contribution !== null && sdgSel.partner !== null && sdgSel.reach !== null);
}

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

renderChipGroup('campAudienceChips', campAudiences, 'audienceIdx');
renderChipGroup('campTopicChips', campTopics, 'topicIdx');
renderChipGroup('campFormatChips', campFormats, 'formatIdx');
renderChipGroup('campGoalChips', campGoals, 'goalIdx');

// map custom keys back onto campSel (renderChipGroup writes to sdgSel by default via closure key,
// so we re-bind these specific groups with their own selection object)
function bindCampChips(containerId, items, key) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach((item, i) => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = item;
    chip.addEventListener('click', () => {
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      campSel[key] = i;
      checkCampComplete();
    });
    container.appendChild(chip);
  });
}
bindCampChips('campAudienceChips', campAudiences, 'audience');
bindCampChips('campTopicChips', campTopics, 'topic');
bindCampChips('campFormatChips', campFormats, 'format');
bindCampChips('campGoalChips', campGoals, 'goal');

const campGenerateBtn = document.getElementById('campGenerate');
function checkCampComplete() {
  campGenerateBtn.disabled = !(campSel.audience !== null && campSel.topic !== null && campSel.format !== null && campSel.goal !== null);
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