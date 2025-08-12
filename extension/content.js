// Asculta mesaje de la pagina web pentru actualizare
window.addEventListener('message', (event) => {
    
    if (event.data.type === 'UPDATE_BLOCK_LIST'){
        console.log("SALUT")
        // chrome.storage.sync.set({ blockList : event.data.blockList }, () => {
        //     console.log("Date salvate în sync storage!");
        // });
    }
    // if (event.data.type === 'UPDATE_PROGRESS') {
    //     const { habits, tasks } = event.data.data;
        
    //     // Salveaza in chrome.storage.sync
    //     

    // // Asculta mesaje pentru setarea flag-ului finish
    // if (event.data.type === 'SET_FINISH_FLAG') {
    //     const { finish } = event.data.data;
        
    //     // Salveaza in chrome.storage.sync
    //     chrome.storage.sync.set({ finish: finish }, () => {
    //         console.log('Flag finish setat in chrome.storage.sync:', finish);
    //     });
    // }
});