import apiFetch from "./ApiFetch";

const WEB_SERVER_URL = process.env.REACT_APP_WEB_SERVER_URL || "http://localhost:3000";

export default function useListManager({ list, setList, label = "block-list" }) {
  
    function loadList() {
        apiFetch(`/api/${label}.json`)
        .then(result => {
            let resultList = result == undefined ? [] : result.list;
            setList(resultList);
            _updateLocalList(resultList);
        });
    }

    // setItem din diagrama UML (metoda privata)
    function _updateLocalList(newList){
        window.postMessage({ 
            type: `update-${label}-data`, 
            list: newList 
        }, WEB_SERVER_URL);
    }

    // fetch din diagrama UML
    function _updateRemoteList(newList){
        apiFetch(`/api/${label}/update`,'POST',{list : newList})
    }

    function updateList(newList){
        setList(newList);
        _updateLocalList(newList);
        _updateRemoteList(newList);
    }

    return { loadList, updateList };
}
