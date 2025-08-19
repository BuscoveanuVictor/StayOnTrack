const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const WEB_URL = process.env.REACT_WEB_URL || "http://localhost:3000"


function useListManager({ list, setList, page }) {

    async function isAuth() {
        const result = await fetch(`${API_URL}/auth/check`).then(res => res.json())
        return Promise.resolve(result.auth)
    }
  
    async function apiFetch(url, method = "GET", data = null) {
        if(await isAuth())return;

        const options = {
            method,
            credentials: "include",
            headers: {}
        };

        // Daca exita data atunci setam head-ul si body-ul
        if (data) {
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(data);
        }else{
            delete options.headers;
        }

        try {
            const response = await fetch(url, options);
            // Nu exista probleme de retea, 
            // dar SERVERUL a raspuns NEGATIV
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            return result;
            // Aici exista PROBLEME DE RETEA
        } catch (error) {
            console.error("Fetch error: ",error);
            return null;
        }
    }

    async function loadRemoteList() {
        let result = []
        result = await apiFetch(`${API_URL}/${page}/${page}.json`)
    
        if(result)setList([...list, ...result.list]);
    }

    function loadLocalList(){
        window.addEventListener('load',()=>{
            window.postMessage({ type: `get-${page}-data` }, WEB_URL);
        })

        window.addEventListener('message', (event) => {
            if(event.data.type === `${page}-data`){
                setList([...list,...event.data.list]);
            }
        })
    }

    function loadList(){
        loadLocalList();
        loadRemoteList();
    }

    function updateLocalList(newList){
        window.postMessage({ type: `update-${page}-data`, list: newList }, WEB_URL);
    }

    function updateRemoteList(newList){
        apiFetch(`${API_URL}/${page}/update`,'POST',{list : newList})
    }

    function updateList(newList){
        setList(newList);
        updateLocalList(newList);
        updateRemoteList(newList);
    }


    return { loadList, updateList };
}

export default useListManager;
