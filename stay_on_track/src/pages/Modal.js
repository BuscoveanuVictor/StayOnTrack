import React, { useState } from "react";


// Modal component cu stiluri adaptate
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const styles = {
    overlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    modal: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 25,
      width: 350,
      position: 'relative',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    },
    closeBtn: {
      position: 'absolute',
      top: 12,
      right: 12,
      background: 'transparent',
      border: 'none',
      fontSize: 24,
      fontWeight: 'bold',
      cursor: 'pointer',
      color: '#888',
    }
  };
  

export default Modal;
