const TIMER_SECONDS = 5 * 60; // 5 minute
let seconds = TIMER_SECONDS;
let running = false;
let interval = null;

const timerText = document.getElementById('timerText');
const timerProgress = document.getElementById('timerProgress');
const breakBtn = document.getElementById('breakBtn');
const radius = 108;
const circumference = 2 * Math.PI * radius;

timerProgress.setAttribute('stroke-dasharray', circumference);
timerProgress.setAttribute('stroke-dashoffset', circumference);

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function updateTimer() {
    timerText.textContent = formatTime(seconds);
    const progress = 1 - seconds / TIMER_SECONDS;
    timerProgress.setAttribute('stroke-dashoffset', circumference * (1 - progress));
}

function startTimer() {
    if (running) return; // Nu porni din nou dacă deja rulează
    running = true;
    seconds = TIMER_SECONDS;
    updateTimer();
    breakBtn.textContent = "Break in progress...";
    breakBtn.disabled = true;
    interval = setInterval(() => {
    if (seconds > 0) {
        seconds--;
        updateTimer();
    } else {
        clearInterval(interval);
        running = false;
        breakBtn.textContent = "Start Break";
        breakBtn.disabled = false;
    }
    }, 1000);
}

breakBtn.addEventListener('click', startTimer);

// Inițial
updateTimer();