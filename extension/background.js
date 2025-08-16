chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' || changeInfo.status === 'complete' && tab.active && tab.url) 
    {
        try {
            const urlObj = new URL(tab.url);
            const hostname = urlObj.hostname;
            //console.log(hostname)
            chrome.storage.sync.get(['blockList'], (data) => {
                if(data.blockList.includes(hostname)){
                    chrome.storage.sync.get(['taskList'], (data)=>{
                        if(data.taskList.find(elem => elem.completed == false)){
                            chrome.tabs.update(tabId, { url: "http://localhost:3000"});
                        }
                    })
                }
            })

        } catch (e) {
            console.error("Eroare la procesarea URL-ului:", e);
        }
    }
});
