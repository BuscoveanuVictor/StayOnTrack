import React, { useEffect, useState } from "react";

export default function Dashboard() {

  const [isAuth, setIsAuth] = useState(undefined);

  useEffect(() => {
    if(isAuth == undefined)
      fetch("/auth/check", {
        method: "GET",
        credentials: "include", 
        headers:{
                'Content-Type': 'application/json'
            },
      })
      .then(res => res.json())
      .then((data) => {
        setIsAuth(data.auth);
      })
      .catch((error) => {
        console.error("Eroare la verificarea autentificarii:", error);
      });
  },[])


  const buttons = [
    { href: "task-list", label: "Tasks" },
    { href: "block-list", label: "Block list" },
    { href: "auth", label: "Authentificate"}
  ]

  const handleNavigation = (href) => {
    window.location.href = href;
  };

  // Stiluri CSS inline
  const containerStyle = {

    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #bfdbfe 0%, #c084fc 100%)",
  };

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    alignItems: "center",
  };

  const buttonStyle = {
    width: "224px",
    padding: "12px 0",
    borderRadius: "10px",
    backgroundColor: "#2563eb", // blue-600
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    boxShadow: "0 5px 10px rgba(37, 99, 235, 0.5)",
    cursor: "pointer",
    transition: "transform 0.1s ease, box-shadow 0.1s ease, background-color 0.2s ease",
    userSelect: "none",
  };

  // Efect la apăsare (active)
  const buttonActiveStyle = {
    transform: "scale(0.95)",
    boxShadow: "inset 0 3px 5px rgba(0,0,0,0.2)",
    backgroundColor: "#1e40af", // blue-700
  };

  // Pentru a aplica active la click fără Tailwind, putem folosi onMouseDown/onMouseUp
  const [activeIndex, setActiveIndex] = React.useState(null);

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e293b", marginBottom: "32px" }}>
        Dashboard
      </h1>
      <div style={buttonContainerStyle}>
        {buttons.map((btn, index) =>
        { 
          if(btn.href.includes("auth") && isAuth){
            btn.href = `/api/auth/google/logout`;
            btn.label = "Logout"
          }
          
          return(
            <button
              key={btn.href}
              onClick={() => handleNavigation(btn.href)}
              onMouseDown={() => setActiveIndex(index)}
              onMouseUp={() => setActiveIndex(null)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                ...buttonStyle,
                ...(activeIndex === index ? buttonActiveStyle : {}),
              }}
            >
              { btn.label}
            </button>
          ) 
        }
       )}
      </div>
    </div>
  );
}

