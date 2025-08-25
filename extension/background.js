const blackList = [
    "localhost",
    "127.0.0.1",
    "StayOnTrack.site",
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

        if(blackList.includes(hostname)){ 
            chrome.storage.local.set({ currentSite: "Invalid url" });
            return;
        }

        const domain = urlObj.hostname.replace('www.', '');

        // Daca nu este blocat
        if(!redirectIfBlocked(domain, tab_id))
            // Il salvam in storage-ul extensiei
            // pentru a-l afisa in ext in caz ca
            // utilizatorul vrea sa-l blocheaze
            chrome.storage.local.set({ currentSite: domain });
    } catch (e) {
        console.error(e);
    }
}

function redirectIfBlocked(hostname, tabId){
    chrome.storage.sync.get(['mode'], (data) => {
        const mode = data.mode;
        if(mode === 'block'){
            return blockListMode(hostname, tabId);
        } else {
            return allowListMode(hostname, tabId);
        }
    });

}

function blockListMode(hostname, tabId){

    chrome.storage.sync.get(['blockList'], (data) => {
        if(data.blockList.includes(hostname)){
            chrome.storage.sync.get(['taskList'], (data)=>{
                if(data && data.taskList.find(elem => elem.completed == false)){
                    chrome.tabs.update(tabId, { url: "http://localhost:3000/task-list"});
                    return true;
                }
            })
        }
    })
    return false;
}

function allowListMode(hostname, tabId){
    chrome.storage.sync.get(['allowList'], (data) => {
        if(!data.allowList.includes(hostname)){
            chrome.storage.sync.get(['taskList'], (data)=>{
                if(data && data.taskList.find(elem => elem.completed == false)){
                    chrome.tabs.update(tabId, { url: "http://localhost:3000/task-list"});
                    return true;
                }
            })
        }
    })
    return false;
}

