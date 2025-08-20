import React, { useEffect, useState }from 'react';
import styles from './BlockList.module.css';
import Modal from './Modal';
import useListManager from './ListManager';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const WEB_URL = process.env.REACT_WEB_URL || "http://localhost:3000"

export default function BlockList() {
    
    // client blockList
    const [blockList, setBlockList ] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockedDomain, setBlockedDomain] = useState('');
    
    const { loadList , updateList } = useListManager({
        list : blockList, 
        setList : setBlockList,
        page : "block-list"
    });

    async function addToBlockList (domain) {
        if (!domain) {
            alert('Te rog introdu un domeniu!');
            return;
        }

        if (blockList.includes(domain)) {
            alert('Acest domeniu este deja in lista!');
            return;
        }
        updateList([...blockList, domain]);
    }

    const removeDomain = (domain)=> { 
        updateList(blockList.filter(site => site !== domain));     
    }

    useEffect(()=> {
        // atentie mare aici
        // in functiile din loadList exista setList care modifica list si
        // re randeaza pagina prin urmare daca tu nu punea linia de mai jos
        // in useEffect care se realiazeaza o singura data datorita arg []
        // de fiecare data cand se apela setList se randa pagina si
        // iar se apela functia din window.onload( bucla infinita )
        window.onload = loadList;
    },[]);
    

    const handleSave = () => {
      addToBlockList(blockedDomain);
      setIsModalOpen(false);
    };

    function BlockList({ children }) {
        return (
          <ul id="blockedItems" className={styles.blockedList}>
            {React.Children.map(children, (child) => (
                <li
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "4px 0"
                    }}
                >

                {child}
                
                <span
                    onClick={() => removeDomain(child)}
                    style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "transform 0.1s ease"
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.85)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    🗑️
                </span>
                </li>
            ))}
          </ul>
        );
    }

    return (

    <div>
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Block List</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2>Gestionare Site-uri Blocate</h2>

                    <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                        + Adauga Site Blocat
                    </button>

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        
                        <input
                        type="text"
                        placeholder="Introdu domeniul de blocat"
                        value={blockedDomain}
                        onChange={(e) => setBlockedDomain(e.target.value)}
                        style={{ padding: '8px', width: '100%', marginBottom: '12px' }}
                        />

                        <button onClick={handleSave}>Blochează domeniul</button>
                    </Modal>
                   
                </div>

                <div className={styles.section}>
                    <h2>Site-uri Blocate</h2>
                    <BlockList>
                    {
                        blockList
                    }   
                    </BlockList>
                </div>
            </div>
        </div>
    </div>

  );
}

