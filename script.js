let money = 0;
let lifetimeEarnings = 0;
let clickValue = 1;
let totalClicks = 0;

let autoClickerEnabled = false;
let autoClickValue = 1;
let autoClickInterval = 3000;
let autoIntervalID = null;

let superAutoClickerEnabled = false;
let superAutoClickValue = 5;
let superAutoClickInterval = 2000;
let superAutoIntervalID = null;

let currentUpgradeIndex = 0;
let autoUpgradeIndex = 0;

const upgrades = [
  [50, 1.5],
  [100, 2],
  [200, 3.5],
  [400, 6],
  [800, 10],
  [1600, 15],
  [3200, 25],
  [6400, 40],
  [12800, 60],
  [25600, 100],
  [51200, 150],
  [102400, 250],
  [204800, 400],
  [409600, 700],
  [819200, 1000],
  [1000000, 1500],
];

const autoUpgrades = [
  [200, 1.5, 2500],
  [400, 2, 2000],
  [800, 3, 1500],
  [1600, 5, 1000],
  [3200, 10, 700],
  [6400, 15, 500],
  [12800, 20, 300]
];

// DOM elements
const moneyDisplay = document.getElementById("money");
const totalClicksDisplay = document.getElementById("totalClicks");
const lifetimeDisplay = document.getElementById("lifetimeEarnings");
const earningsPerSecDisplay = document.getElementById("earningsPerSec");

const clickBtn = document.getElementById("clickBtn");
const upgradeBtn = document.getElementById("upgradeBtn");
const autoClickerBtn = document.getElementById("autoClickerBtn");
const autoUpgradeBtn = document.getElementById("autoUpgradeBtn");
const superAutoClickerBtn = document.getElementById("superAutoClickerBtn");

const clickSound = document.getElementById("clickSound");
const upgradeSound = document.getElementById("upgradeSound");

// Dollar sign animation
const dollarSign = document.getElementById("dollarSign");

// Manual click
clickBtn.addEventListener("click", () => {
  money += clickValue;
  lifetimeEarnings += clickValue;
  totalClicks++;
  updateDisplay();
  animateDollarSign();
  clickSound.play();
  checkUpgradeAvailable();
  checkAutoUpgradeAvailable();
});

// Manual upgrade
upgradeBtn.addEventListener("click", () => {
  const [cost, newVal] = upgrades[currentUpgradeIndex];
  if (money >= cost) {
    money -= cost;
    clickValue = newVal;
    currentUpgradeIndex++;
    upgradeSound.play();
    updateDisplay();
    updateUpgradeButton();
  }
});

// Buy Auto Clicker
autoClickerBtn.addEventListener("click", () => {
  if (!autoClickerEnabled && money >= 150) {
    money -= 150;
    autoClickerEnabled = true;
    startAutoClicker();
    autoClickerBtn.textContent = "Auto Clicker: ON";
    autoClickerBtn.disabled = true;
    upgradeSound.play();
    updateDisplay();
    checkAutoUpgradeAvailable();
  }
});

// Super Auto Clicker
superAutoClickerBtn.addEventListener("click", () => {
  if (!superAutoClickerEnabled && money >= 500) {
    money -= 500;
    superAutoClickerEnabled = true;
    startSuperAutoClicker();
    superAutoClickerBtn.textContent = "Super Auto Clicker: ON";
    superAutoClickerBtn.disabled = true;
    upgradeSound.play();
    updateDisplay();
  }
});

// Auto click loop
function startAutoClicker() {
  autoIntervalID = setInterval(() => {
    money += autoClickValue;
    lifetimeEarnings += autoClickValue;
    updateDisplay();
    checkUpgradeAvailable();
    checkAutoUpgradeAvailable();
  }, autoClickInterval);
}

// Super auto click loop
function startSuperAutoClicker() {
  superAutoIntervalID = setInterval(() => {
    money += superAutoClickValue;
    lifetimeEarnings += superAutoClickValue;
    updateDisplay();
  }, superAutoClickInterval);
}

// Auto upgrade
autoUpgradeBtn.addEventListener("click", () => {
  const [cost, newVal, newInterval] = autoUpgrades[autoUpgradeIndex];
  if (money >= cost) {
    money -= cost;
    autoClickValue = newVal;
    autoClickInterval = newInterval;
    clearInterval(autoIntervalID);
    startAutoClicker();
    autoUpgradeIndex++;
    upgradeSound.play();
    updateDisplay();
    updateAutoUpgradeButton();
  }
});

function updateDisplay() {
  moneyDisplay.textContent = money.toFixed(1);
  lifetimeDisplay.textContent = lifetimeEarnings.toFixed(1);
  totalClicksDisplay.textContent = totalClicks;
}

function updateUpgradeButton() {
  if (currentUpgradeIndex < upgrades.length) {
    const [nextCost] = upgrades[currentUpgradeIndex];
    upgradeBtn.textContent = `Upgrade Click ($${nextCost})`;
    checkUpgradeAvailable();
  } else {
    upgradeBtn.disabled = true;
    upgradeBtn.textContent = "Maxed Out";
  }
}

function checkUpgradeAvailable() {
  if (currentUpgradeIndex < upgrades.length) {
    const [cost] = upgrades[currentUpgradeIndex];
    upgradeBtn.disabled = money < cost;
    upgradeBtn.classList.toggle("active", money >= cost);
  }
}

function updateAutoUpgradeButton() {
  if (autoUpgradeIndex < autoUpgrades.length) {
    const [nextCost] = autoUpgrades[autoUpgradeIndex];
    autoUpgradeBtn.textContent = `Upgrade Auto Clicker ($${nextCost})`;
    checkAutoUpgradeAvailable();
  } else {
    autoUpgradeBtn.disabled = true;
    autoUpgradeBtn.textContent = "Maxed Out";
  }
}

function checkAutoUpgradeAvailable() {
  if (autoClickerEnabled && autoUpgradeIndex < autoUpgrades.length) {
    const [cost] = autoUpgrades[autoUpgradeIndex];
    autoUpgradeBtn.disabled = money < cost;
    autoUpgradeBtn.classList.toggle("active", money >= cost);
  }
}

// Dollar sign animation
function animateDollarSign() {
  const newDollar = dollarSign.cloneNode(true);
  document.body.appendChild(newDollar);
  newDollar.style.animation = "moveDollar 1.5s forwards";
  newDollar.style.left = `${clickBtn.offsetLeft + clickBtn.offsetWidth / 2}px`;
  newDollar.style.top = `${clickBtn.offsetTop + clickBtn.offsetHeight / 2}px`;

  newDollar.addEventListener("animationend", () => {
    newDollar.remove();
  });
}

// Update earnings/sec every 0.5s
setInterval(() => {
  if (autoClickerEnabled) {
    const eps = (1000 / autoClickInterval * autoClickValue).toFixed(2);
    earningsPerSecDisplay.textContent = eps;
  } else {
    earningsPerSecDisplay.textContent = "0";
  }
}, 500);

// Init
updateUpgradeButton();
updateAutoUpgradeButton();
updateDisplay();
