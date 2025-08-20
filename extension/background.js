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
        // Daca nu este blocat
        if(!redirectIfBlocked(hostname, tab_id))
            // Il salvam in storageul extensiei
            // pentru al afisa in ext in caz ca
            // utilizatorul vrea sa l blocheaze
            chrome.storage.local.set({ currentSite: hostname });
    } catch (e) {
        chrome.storage.local.set({ currentSite: "Invalid url" });
    }
}

function redirectIfBlocked(hostname, tabId){
    chrome.storage.sync.get(['blockList'], (data) => {
        if(data.blockList.includes(hostname)){
            chrome.storage.sync.get(['taskList'], (data)=>{
                if(data && data.taskList.find(elem => elem.completed == false)){
                    chrome.tabs.update(tabId, { url: "http://localhost:3000"});
                    return true;
                }
            })
        }
    })
    return false;
}
