let TIMER_SECONDS = 5 * 60;
let MAX_BREAKS_PER_DAY = null;
const API_URL = 'http://stayontrack.site/api';
const timerText = document.getElementById('timerText');
const timerProgress = document.getElementById('timerProgress');
const breakBtn = document.getElementById('breakBtn');
const breakInfo = document.getElementById('breakInfo');
const radius = 108;
const circumference = 2 * Math.PI * radius;

timerProgress.setAttribute('stroke-dasharray', circumference);
timerProgress.setAttribute('stroke-dashoffset', circumference);

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function updateTimer(seconds) {
    timerText.textContent = formatTime(seconds);
    const progress = 1 - seconds / TIMER_SECONDS;
    timerProgress.setAttribute('stroke-dashoffset', circumference * (1 - progress));
}

async function fetchBreakRules() {
    try {
        const resp = await fetch(`${API_URL}/rules`, { credentials: 'include' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        if (typeof data.breakTime === 'number' && data.breakTime > 0) {
            TIMER_SECONDS = data.breakTime * 60;
        }
        if (typeof data.breakCount === 'number' && data.breakCount > 0) {
            MAX_BREAKS_PER_DAY = data.breakCount;
        }
        // reflecta in UI
        if (MAX_BREAKS_PER_DAY != null) {
            breakBtn.title = `Pauze permise pe zi: ${MAX_BREAKS_PER_DAY}`;
        }
        updateTimer(TIMER_SECONDS);
    } catch (e) {
        console.warn('Nu pot incarca regulile pentru pauze:', e);
    }
}

function refreshBreakInfoUI(){
    chrome.runtime.sendMessage({ type: 'GET_BREAK_LIMITS' }, (limits) => {
        if (!breakInfo) return;
        if (limits && limits.breakCount != null) {
            breakInfo.textContent = `Pauze ramase azi: ${limits.remaining}/${limits.breakCount}`;
        } else {
            breakInfo.textContent = '';
        }
    });
}

function getStatusAndUpdate() {
    chrome.runtime.sendMessage({ type: "GET_BREAK_TIMER" }, (resp) => {
        updateTimer(resp.seconds);
        breakBtn.textContent = resp.running ? "Break in progress..." : "Start Break";
        breakBtn.disabled = !!resp.running;
    });
}

breakBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "START_BREAK_TIMER" }, (resp) => {
        if (resp && resp.error === 'limit') {
            alert(resp.message || 'Limita de pauze atinsa pentru azi.');
            return;
        }
        getStatusAndUpdate();
        refreshBreakInfoUI();
    });
});

// Ascultă tick-uri de la background
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "BREAK_TIMER_TICK") {
        updateTimer(msg.seconds);
        breakBtn.textContent = "Break in progress...";
        breakBtn.disabled = true;
    }
    if (msg.type === "BREAK_TIMER_END") {
        updateTimer(0);
        breakBtn.textContent = "Start Break";
        breakBtn.disabled = false;
        refreshBreakInfoUI();
    }
});

// Inițial
fetchBreakRules().then(() => {
    getStatusAndUpdate();
    refreshBreakInfoUI();
});

// Setează clasa pe body în funcție de mode-ul din chrome.storage.sync
if (chrome && chrome.storage && chrome.storage.sync) {
  chrome.storage.sync.get(['mode'], (data) => {
    if (data.mode === "allow") {
      document.body.classList.add('allow-mode');
    } else {
      document.body.classList.remove('allow-mode');
    }
  });
}