// ==== Get Elements ====
const passwordInput = document.getElementById("passwordInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const togglePassword = document.getElementById("togglePassword");
const generateBtn = document.getElementById("generateBtn");
const resultDiv = document.getElementById("result");
const scoreSpan = document.getElementById("score");
const strengthSpan = document.getElementById("strength");
const explanationP = document.getElementById("explanation");
const strengthBar = document.getElementById("strengthBar");
const crackTimeSpan = document.getElementById("crackTime");
const entropySpan = document.getElementById("entropy");
const breachStatusSpan = document.getElementById("breachStatus");
const ruleLength = document.getElementById("rule-length");
const ruleUpper = document.getElementById("rule-upper");
const ruleLower = document.getElementById("rule-lower");
const ruleNumber = document.getElementById("rule-number");
const ruleSpecial = document.getElementById("rule-special");
const ruleSpace = document.getElementById("rule-space");
// ===== WORD LIST FOR MEANINGFUL PASSWORDS =====
const wordList = [
    "Blue", "Tiger", "Moon", "River", "Cloud",
    "Shadow", "Falcon", "Stone", "Wolf", "Storm",
    "Silent", "Golden", "Crimson", "Swift", "Iron"
];
// ===== COMMON / BREACHED PASSWORDS (DEMO LIST) =====
// ===== COMMON / BREACHED PASSWORDS (DEMO LIST) =====
const breachedPasswords = [
    // Very common
    "password",
    "password1",
    "password123",
    "passw0rd",
    "p@ssword",

    // Numeric only
    "123456",
    "1234567",
    "12345678",
    "123456789",
    "1234567890",
    "111111",
    "000000",
    "121212",

    // Keyboard patterns
    "qwerty",
    "qwerty123",
    "asdfgh",
    "asdf1234",
    "zxcvbnm",

    // Admin / defaults
    "admin",
    "admin123",
    "administrator",
    "root",
    "root123",

    // Common words
    "welcome",
    "letmein",
    "login",
    "guest",
    "default",

    // Pop culture / names
    "iloveyou",
    "monkey",
    "dragon",
    "football",
    "baseball",
    "superman",
    "batman",

    // Simple patterns
    "abc123",
    "abc12345",
    "abcd1234",
    "test",
    "test123",

    // Weak variations
    "password@123",
    "admin@123",
    "user123",
    "user@123"
];
// Add more as needed for demonstration purposes 

// ==== SAFETY CHECK ====
if (!passwordInput || !analyzeBtn) {
    console.error("Required DOM elements missing");
}

// ==== POLICY HELPERS ====
function updateRule(el, pass) {
    if (!el) return;
    const text = el.dataset.text;
    el.textContent = (pass ? "✔ " : "❌ ") + text;
    el.className = pass ? "pass" : "fail";
}

function checkPolicy(pwd) {
    updateRule(ruleLength, pwd.length >= 8);
    updateRule(ruleUpper, /[A-Z]/.test(pwd));
    updateRule(ruleLower, /[a-z]/.test(pwd));
    updateRule(ruleNumber, /\d/.test(pwd));
    updateRule(ruleSpecial, /[^A-Za-z0-9]/.test(pwd));
    updateRule(ruleSpace, !/\s/.test(pwd));
}
function generateSecurePassword(length = 14) {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    const allChars = lower + upper + numbers + special;

    let password = "";

    // Guarantee each category
    password += lower[Math.floor(Math.random() * lower.length)];
    password += upper[Math.floor(Math.random() * upper.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill remaining length
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle characters
    return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
}

// ==== CRACK TIME ====
function estimateCrackTime(pwd) {
    let size = 0;
    if (/[a-z]/.test(pwd)) size += 26;
    if (/[A-Z]/.test(pwd)) size += 26;
    if (/\d/.test(pwd)) size += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) size += 32;
    if (size === 0) return "Instantly";

    const guesses = Math.pow(size, pwd.length);
    const seconds = guesses / 1_000_000_000;

    if (seconds < 1) return "Instantly";
    if (seconds < 60) return `${Math.round(seconds)} sec`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hr`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    return "Years+";
}
function calculateEntropy(password) {
    let charsetSize = 0;

    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/\d/.test(password)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;

    if (charsetSize === 0) return 0;

    const entropy = Math.log2(Math.pow(charsetSize, password.length));
    return Math.round(entropy);
}
function checkBreach(password) {
    const normalized = password.toLowerCase();
    return breachedPasswords.includes(normalized);
}

// ===== MEANINGFUL PASSWORD GENERATOR =====
function generateMeaningfulPassword() {
    const word1 = wordList[Math.floor(Math.random() * wordList.length)];
    const word2 = wordList[Math.floor(Math.random() * wordList.length)];

    const number = Math.floor(10 + Math.random() * 90); // 2-digit number

    const symbols = ["!", "@", "#", "$", "%", "&"];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    const separators = ["", "_", "-"];
    const separator = separators[Math.floor(Math.random() * separators.length)];

    return `${word1}${separator}${word2}${number}${symbol}`;
}

function forceReset() {
    // Hide result section
    resultDiv.classList.add("hidden");

    // Reset score & text
    scoreSpan.textContent = "0";
    strengthSpan.textContent = "";
    explanationP.textContent = "";
    crackTimeSpan.textContent = "";

    // Reset strength bar
    strengthBar.style.width = "0%";
    strengthBar.style.background = "#334155";

    // Reset ALL policy rules (all ❌)
    updateRule(ruleLength, false);
    updateRule(ruleUpper, false);
    updateRule(ruleLower, false);
    updateRule(ruleNumber, false);
    updateRule(ruleSpecial, false);
    updateRule(ruleSpace, false);
}

// ==== MAIN ANALYSIS ====
function analyzePassword() {
    const pwd = passwordInput.value.trim();

    if (pwd === "") {
        alert("Please enter a password first");
        return;
    }

    // analysis continues here…


    checkPolicy(pwd);

    let checks = 0;
    if (pwd.length >= 8) checks++;
    if (/[A-Z]/.test(pwd)) checks++;
    if (/[a-z]/.test(pwd)) checks++;
    if (/\d/.test(pwd)) checks++;
    if (/[^A-Za-z0-9]/.test(pwd)) checks++;

    const score = checks * 20;

    let strength = "Weak";
    let color = "weak";
    let msg = "Weak password. Easily crackable.";

    if (score >= 80) {
        strength = "Strong";
        color = "strong";
        msg = "Strong password. Resistant to brute-force attacks.";
    } else if (score >= 40) {
        strength = "Moderate";
        color = "moderate";
        msg = "Moderate password. Can be improved.";
    }

    scoreSpan.textContent = score;
    strengthSpan.textContent = strength;
    strengthSpan.className = color;
    explanationP.textContent = msg;
    crackTimeSpan.textContent = estimateCrackTime(pwd);
    const entropy = calculateEntropy(pwd);

let entropyLabel = "Low";
if (entropy >= 60) entropyLabel = "High";
else if (entropy >= 40) entropyLabel = "Medium";

entropySpan.textContent = `${entropy} bits (${entropyLabel})`;
if (checkBreach(pwd)) {
    breachStatusSpan.textContent = "❌ Found in common breached passwords";
    breachStatusSpan.style.color = "#ef4444";
} else {
    breachStatusSpan.textContent = "✅ Not found in known breaches";
    breachStatusSpan.style.color = "#22c55e";
}
    strengthBar.style.width = score + "%";
    strengthBar.style.background =
        score >= 80 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

    resultDiv.classList.remove("hidden");
}
// ==== EVENTS ====
analyzeBtn.addEventListener("click", analyzePassword);

generateBtn.addEventListener("click", () => {
    const generatedPassword = generateMeaningfulPassword();
    passwordInput.value = generatedPassword;
    forceReset();
});

passwordInput.addEventListener("input", () => {
    if (passwordInput.value.trim() === "") {
        forceReset();
    }
});
togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "👁️";
    }
});
togglePassword.addEventListener("click", () => {
    if (passwordInput.value.length === 0) {
        resetUI();
    }
});
