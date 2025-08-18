# StayOnTrack

**StayOnTrack** este o aplicație disponibilă ca extensie de browser, aplicație mobilă și web app.  
Scopul său este să reducă distragerile zilnice, prin blocarea site-urilor și aplicațiilor introduse de utilizator (pe calculator sau telefon), 
până la finalizarea task-urilor din ziua respectivă.

---

## 🚀 Tehnologii folosite
- **Frontend (Web):** React  
- **Backend:** Node.js cu Express  
- **Bază de date:** MongoDB  
- **Containerizare:** Docker  

---

## 🏗️ Arhitectura generală
Aplicația urmează modelul **client-server**:  
- **Client:** aplicația React și extensia web care oferă interfața utilizatorului.  
- **Server:** aplicația Node.js cu Express care expune un set de API-uri REST și gestionează logica aplicației.  
- **Bază de date:** MongoDB, pentru stocarea utilizatorilor, task-urilor și listelor de site-uri blocate.  

---

---

## 📊 Diagrama interacțiunilor

Următoarea diagramă prezintă principalele fluxuri ale aplicației StayOnTrack: adăugarea unui domeniu în block-list, editarea listei, accesarea unui domeniu blocat în browser și redirecționarea aplicațiilor mobile către StayOnTrack.

![Diagrama interacțiunilor StayOnTrack](./assets/uml_diagram.png)

## 🔧 Instalare și rulare (local)

### Cerințe
- [Node.js & npm](https://nodejs.org/) instalate  
- MongoDB instanțiat local sau accesibil printr-un connection string  

### Pași
1. Clonează proiectul:  
   ```bash
   git clone <repo-url>
   ```

2. Instalează dependențele pentru **server**:  
   ```bash
   cd server
   npm install
   ```

3. Instalează dependențele pentru **frontend**:  
   ```bash
   cd ../stay_on_track
   npm install
   ```

4. Rulează serverul backend (Node.js):  
   ```bash
   cd server
   node app.js
   ```
   sau, pentru dezvoltare cu autoreload:  
   ```bash
   nodemon app.js
   ```

5. Rulează frontend-ul (React):  
   ```bash
   cd stay_on_track
   npm start
   ```

---

### ⚙️ Variabile de mediu
Fișierele `.env` (care urmează a fi adăugate) vor conține:  
```env
MONGO_URI=mongodb://localhost:27017/stay_on_track
OAUTH_CLIENT_ID=<client_id>
OAUTH_CLIENT_SECRET=<client_secret>
```

---

## 📂 Structura proiectului
```
/server          -> backend Node.js + Express
/stay_on_track   -> aplicația React (web frontend)
/extension       -> extensia de browser
```

---

## 🗃️ Model de date
Toate datele sunt stocate într-o singură colecție `users`.  
Aceasta conține atât datele utilizatorului, cât și listele de task-uri și site-uri blocate.  
Am ales denormalizarea pentru a putea obține rapid, printr-o singură interogare, întreaga stare a unui utilizator (task-uri + block list).  

Exemplu de document în `users`:
```json
{
  "userId": "abc123",
  "tasks": [
    { "id": 1, "title": "Finish report", "completed": false }
  ],
  "blockedSites": [
    "facebook.com",
    "youtube.com"
  ]
}
```

---

## 🧪 Testare
Teste unitare și de integrare – în curs de implementare.  

---

## ☁️ Deployment
Proces automatizat cu **GitHub Actions**:  
1. Se construiește aplicația React → build static servit de **Nginx**  
2. Se creează o imagine Docker pentru backend (Node.js)  
3. Ambele imagini sunt urcate pe **Docker Hub**  

Pe serverul de producție:  
- Un script rulează prin **SSH**, trage noile imagini și le pornește cu **Docker Compose**.  
