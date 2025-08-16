import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function useListManager({ page }) {
    const [list, setList] = useState([]);

    async function apiFetch(url, method = "GET", data = null) {
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
            return undefined;
        }
    }

    async function loadList() {
        const result = await apiFetch(`${API_URL}/${page}/${page}.json`)
        return result;
    }

    //  const updateExtension = (newList) => {
    //     window.postMessage({ type: messageType, list: newList }, 'http://localhost:3000');
    // };

    // const updateLocal = (newList) => {
    //     setList(newList);
    //     updateExtension(newList);
    // };


//   useEffect(() => {
//     loadList();
//   }, []);

  return { loadList };
}

export default useListManager;
