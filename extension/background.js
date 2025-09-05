// const WEB_SERVER_URL = 'http://localhost'; // dev

const WEB_SERVER_URL = 'http://stayontrack.site';

const blackList = [
    "localhost",
    "127.0.0.1",
    "stayontrack.site",
    "extensions",
    "newtab"
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' || changeInfo.status === 'complete' && tab.active && tab.url) 
        currentTabManager(tab, tabId);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    currentTabManager(tab, activeInfo.tabId)
  });
});

function currentTabManager(tab, tab_id){
    try {
        const urlObj = new URL(tab.url);
        const hostname = urlObj.hostname;

        verifyIfDataHaveBeenLoaded();

        if(blackList.includes(hostname)){ 
            chrome.storage.local.set({ currentSite: "Invalid url" });
            return;
        }

        const domain = urlObj.hostname.replace('www.', '');
        if(!onBreak)
            redirectIfBlocked(domain, tab_id);

        // Aici salvez domeniul curent al tab-ului pentru
        // a-l afisa in extensie pentru blocare
        chrome.storage.local.set({ currentSite: domain });
    } catch (e) {
        console.error(e);
    }
}

function redirectIfBlocked(hostname, tabId){
    chrome.storage.sync.get(['mode'], (data) => {
        const mode = data.mode;
        if(mode === 'allow') 
            allowListMode(hostname, tabId);
        else blockListMode(hostname, tabId);
        
    });
}

function verifyIfDataHaveBeenLoaded(){
    chrome.storage.sync.get(['hasBeenLoaded'],(data)=>{
        if(!data.hasBeenLoaded){
            fetch(`${WEB_SERVER_URL}/api/block-list.json`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                chrome.storage.sync.set({ blockList: data });
            });

            fetch(`${WEB_SERVER_URL}/api/allow-list.json`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                chrome.storage.sync.set({ allowList: data });
            });

            fetch(`${WEB_SERVER_URL}/api/task-list.json`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                chrome.storage.sync.set({ taskList: data });
            });

            fetch(`${WEB_SERVER_URL}/api/get-mode`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                chrome.storage.sync.set({ mode: data.mode || 'block' });
            });

            chrome.storage.sync.set({ hasBeenLoaded: true })
        }
    })
}

function blockListMode(hostname, tabId){
    chrome.storage.sync.get(['blockList'], (data) => {
        if(data.blockList.includes(hostname)){
            chrome.storage.sync.get(['taskList'], (data)=>{
                if(data && data.taskList.find(elem => elem.completed == false)){
                    chrome.tabs.update(tabId, { url: `${WEB_SERVER_URL}/task-list`});
                }
            })
        }
    })
}

function allowListMode(hostname, tabId){
    chrome.storage.sync.get(['allowList'], (data) => {
        if(!data.allowList.includes(hostname)){
            chrome.storage.sync.get(['taskList'], (data)=>{
                if(data && data.taskList.find(elem => elem.completed == false)){
                    chrome.tabs.update(tabId, { url: `${WEB_SERVER_URL}/task-list`});
                }
            })
        }
    })
}

let breakTimer = {
    running: false,
    seconds: 5 * 60,
    interval: null
};

let onBreak = false;
let breakRules = { breakTime: 5, breakCount: null };

function todayKey(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

async function fetchServerRules(){
    try{
        const resp = await fetch(`${WEB_SERVER_URL}/api/rules`, { credentials: 'include' });
        if(!resp.ok) return;
        const data = await resp.json();
        if(typeof data.breakTime === 'number' && data.breakTime > 0){
            breakRules.breakTime = data.breakTime;
        }
        if(typeof data.breakCount === 'number' && data.breakCount > 0){
            breakRules.breakCount = data.breakCount;
        }
    }catch(e){
        // silent
    }
}

async function getDailyBreaksUsed(){
    return new Promise((resolve)=>{
        chrome.storage.local.get(['dailyBreaks'], (data)=>{
            const key = todayKey();
            const daily = data.dailyBreaks && data.dailyBreaks.date === key ? data.dailyBreaks : { date: key, used: 0 };
            resolve(daily);
        })
    })
}

async function incDailyBreaksUsed(){
    const key = todayKey();
    const daily = await getDailyBreaksUsed();
    const next = { date: key, used: daily.used + 1 };
    return new Promise((resolve)=>{
        chrome.storage.local.set({ dailyBreaks: next }, ()=> resolve(next));
    })
}

// Preia regulile la pornire
fetchServerRules();
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "START_BREAK_TIMER") {
        (async () => {
            if (!breakTimer.running) {
                const daily = await getDailyBreaksUsed();
                if (breakRules.breakCount != null && daily.used >= breakRules.breakCount){
                    sendResponse({ error: 'limit', message: 'Ai atins numarul de pauze pentru azi.' });
                    return;
                }
                onBreak = true;
                breakTimer.running = true;
                breakTimer.seconds = (breakRules.breakTime || 5) * 60;
                await incDailyBreaksUsed();
                breakTimer.interval = setInterval(() => {
                    breakTimer.seconds--;
                    chrome.runtime.sendMessage({
                        type: "BREAK_TIMER_TICK",
                        seconds: breakTimer.seconds,
                        running: breakTimer.running
                    });
                    if (breakTimer.seconds <= 0) {
                        clearInterval(breakTimer.interval);
                        breakTimer.running = false;
                        chrome.runtime.sendMessage({
                            type: "BREAK_TIMER_END"
                        });
                        onBreak = false;
                    }
                }, 1000);
            }
            sendResponse({ running: true, seconds: breakTimer.seconds });
        })();
        return true;
    }
    if (msg.type === "GET_BREAK_TIMER") {
        sendResponse({
            running: breakTimer.running,
            seconds: breakTimer.seconds
        });
        return true;
    }
    if (msg.type === "GET_BREAK_LIMITS") {
        getDailyBreaksUsed().then((daily)=>{
            const remaining = breakRules.breakCount == null ? null : Math.max(0, breakRules.breakCount - daily.used);
            sendResponse({ breakTime: breakRules.breakTime, breakCount: breakRules.breakCount, used: daily.used, remaining });
        });
        return true;
    }
    if (msg.type === "STOP_BREAK_TIMER") {
        if (breakTimer.interval) clearInterval(breakTimer.interval);
        breakTimer.running = false;
        breakTimer.seconds = 5 * 60;
        sendResponse({ running: false, seconds: breakTimer.seconds });
        return true;
    }
});

