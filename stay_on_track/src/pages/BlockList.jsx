import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import useListManager from './ListManager';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const WEB_URL = process.env.REACT_WEB_URL || "http://localhost:3000";

export default function BlockList() {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blockedDomain, setBlockedDomain] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [listType, setListType] = useState("block-list");
  const [mode, setMode] = useState("block");

  const { loadList, updateList } = useListManager({
    list: list,
    setList: setList,
    label: mode === "block" ? "block-list" : "allow-list"
  });

  useEffect(() => {
    window.postMessage({ type: "SET_MODE", mode: mode }, WEB_URL);
    window.onload = loadList();

  }, [mode]);

  function addToBlockList(domain) {
    if (!domain) {
      alert('Please enter a domain!');
      return;
    }
    if (list.includes(domain)) {
      alert('This domain is already in the list!');
      return;
    }
    updateList([...list, domain]);
  }

  const removeDomain = (domain) => {
    updateList(list.filter(site => site !== domain));
  };

  const handleSave = () => {
    addToBlockList(blockedDomain);
    setIsModalOpen(false);
    setBlockedDomain('');
  };

  const handleChangeMode = () => {
    setMode(mode === "block" ? "allow" : "block");
  };

  // Dynamic styles based on mode
  const isAllow = mode === "allow";
  const mainColor = isAllow
    ? 'linear-gradient(135deg, #06b6d4 0%, #818cf8 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const btnColor = isAllow
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #06b6d4 0%, #818cf8 100%)';

  return (
    <div style={{ ...styles.body, background: mainColor }}>
      <div style={styles.container}>
        <div style={{ ...styles.header, background: mainColor }}>
          <h1 style={styles.headerH1}>{isAllow ? "Allow List" : "Block List"}</h1>
        </div>
        <div style={styles.content}>
          <div style={styles.section}>
            <h2 style={styles.sectionH2}>{isAllow ? "Manage Allowed Sites" : "Manage Blocked Sites"}</h2>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <button
                style={{
                  ...styles.addBtn,
                  background: btnColor,
                  ...(hoveredIndex === 'add' ? styles.addBtnHover : {})
                }}
                onMouseEnter={() => setHoveredIndex('add')}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setIsModalOpen(true)}
              >
                {isAllow ? "+ Add allowed site" : "+ Add blocked site"}
              </button>
              <button
                style={{
                  ...styles.addBtn,
                  background: mainColor,
                  ...(hoveredIndex === 'mode' ? styles.addBtnHover : {})
                }}
                onMouseEnter={() => setHoveredIndex('mode')}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={handleChangeMode}
              >
                Change mode
              </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isAllow ? "Add allowed domain" : "Add blocked domain"}>
              <input
                type="text"
                placeholder={isAllow ? "Enter domain to allow" : "Enter domain to block"}
                value={blockedDomain}
                onChange={(e) => setBlockedDomain(e.target.value.replace('www.', ''))}
                style={{ padding: '8px', width: '100%', marginBottom: '12px' }}
              />
              <button onClick={handleSave}>{isAllow ? "Allow domain" : "Block domain"}</button>
            </Modal>
          </div>
          <div style={styles.section}>
            <h2 style={styles.sectionH2}>{isAllow ? "Allowed Sites" : "Blocked Sites"}</h2>
            <ul style={styles.blockedList}>
              {list.length === 0 && (
                <div style={styles.emptyState}>{isAllow ? "No allowed sites." : "No blocked sites."}</div>
              )}
              {list.map((domain, idx) => (
                <li
                  key={domain}
                  style={{
                    ...styles.blockedItem,
                    ...(hoveredIndex === idx ? styles.blockedItemHover : {})
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span style={styles.siteName}>{domain}</span>
                  <button
                    style={{
                      ...styles.removeBtn,
                      ...(hoveredIndex === `remove-${idx}` ? styles.removeBtnHover : {})
                    }}
                    onMouseEnter={() => setHoveredIndex(`remove-${idx}`)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => removeDomain(domain)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    margin: 0,
    padding: '20px',
    minHeight: '100vh',
    transition: 'background 0.3s'
  },
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    overflow: 'hidden',
    padding: '0',
    fontFamily: 'inherit',
  },
  header: {
    color: 'white',
    padding: '30px',
    textAlign: 'center',
    transition: 'background 0.3s'
  },
  headerH1: {
    margin: 0,
    fontSize: '2.5em',
    fontWeight: 300,
  },
  content: {
    padding: '30px',
  },
  section: {
    background: '#f8f9fa',
    borderRadius: '10px',
    padding: '25px',
    marginBottom: '30px',
    border: '2px solid #e9ecef',
  },
  sectionH2: {
    color: '#495057',
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 600,
  },
  addBtn: {
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '16px',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    marginBottom: '16px',
  },
  addBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
  },
  blockedList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  blockedItem: {
    background: 'white',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '15px 20px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  blockedItemHover: {
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
  siteName: {
    fontSize: '16px',
    color: '#495057',
    fontWeight: 500,
  },
  removeBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.3s ease',
  },
  removeBtnHover: {
    background: '#c82333',
    transform: 'scale(1.05)',
  },
  emptyState: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '16px',
    padding: '40px 20px',
  }
};
