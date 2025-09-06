# StayOnTrack

**StayOnTrack** este o aplicație disponibilă ca extensie de browser, aplicație mobilă și web app.
Scopul său este să reducă distragerile zilnice, prin blocarea site-urilor și aplicațiilor introduse de utilizator (pe calculator sau telefon), până la finalizarea task-urilor din ziua respectivă.

**Important:** Aplicația mobilă urmează să fie implementata.

---

## 🚀 Tehnologii folosite
- **Frontend (Web):** React  
- **Backend:** Node.js cu Express  
- **Bază de date:** MongoDB  
- **Containerizare:** Docker + Docker Compose  
- **Orchestrare:** Kubernetes (k3s)  
- **CI/CD:** GitHub Actions + Git

---

## 🏗️ Arhitectura generală
Aplicația urmează modelul **client-server**:
- **Client:** aplicația React Web care oferă interfața utilizatorului.
- **Server:** aplicația Node.js cu Express care expune un set de API-uri REST și gestionează logica aplicației.
- **Bază de date:** MongoDB, pentru stocarea utilizatorilor, task-urilor și listelor de site-uri blocate.

---

## 📊 Diagrama interacțiunilor
Următoarea diagramă prezintă principalele fluxuri ale aplicației StayOnTrack: adăugarea unui domeniu în block-list, editarea listei, accesarea unui domeniu blocat în browser și redirecționarea aplicațiilor mobile către StayOnTrack.

![Diagrama interacțiunilor StayOnTrack](./assets/uml_diagram.png)

---

## 🔧 Instalare și rulare (local)

### Cerințe
- [Docker](https://docs.docker.com/get-docker/) instalat  
- [Docker Compose](https://docs.docker.com/compose/) instalat

### Pași
1. Clonează proiectul:
```bash
git clone <repo-url>
cd STAYONTRACK
```
2. Rulează aplicația și așteaptă să pornească serverele:
```bash
docker compose up
```
3. Pentru utilizarea extensiei de browser: citește README-ul din directorul `extension`.

### 🔑 Configurare autentificare Google
Pentru a folosi opțiunea de **Login cu Google**, creează credențiale OAuth 2.0 din Google Cloud Console:
1. Accesează: [Google Cloud Console](https://console.cloud.google.com/auth/clients)  
2. Creează un proiect nou sau folosește unul existent.  
3. Mergi la **APIs & Services → Credentials** și adaugă un nou **OAuth 2.0 Client ID**.  
4. Configurează tipul aplicației ca **Web application** și adaugă:
   - Authorized JavaScript origins: `http://localhost:80`
   - Authorized redirect URIs: `http://localhost:80/api/auth/google/callback`
5. După crearea credențialelor, vei primi un **Client ID** și un **Client Secret**.  
Creează un fișier `.env` în directorul `server` și adaugă:
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

---

## 📂 Structura proiectului
```
.github         -> workflow-ul de deployment (GitHub Actions)
assets          -> resurse (diagrame, imagini)
client          -> aplicația React (frontend web)
server          -> backend Node.js + Express
extension       -> extensia de browser
k3s             -> fișierele de deployment pentru k3s
```

---

## 🗃️ Model de date
Toate datele sunt stocate într-o singură colecție `users`, care conține datele utilizatorului, task-urile și site-urile blocate. Denormalizarea permite obținerea rapidă a stării unui utilizator.

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

## 📋 User Stories

Proiectul StayOnTrack implementează funcționalități bazate pe user stories detaliate care acoperă toate aspectele aplicației.

### Epic-uri principale:
- 🔐 **Autentificare și Gestionare Utilizatori** - Google OAuth, sesiuni, logout
- 🚫 **Gestionare Lista de Blocare** - CRUD operations, moduri block/allow
- ✅ **Gestionare Task-uri** - creare, editare, ștergere, marcare completat
- ⏰ **Gestionare Pauze** - timer, reguli, monitorizare
- 🔧 **Configurări și Reguli** - parolă securitate, validare
- 🌐 **Extensie Browser** - blocare automată, sincronizare
- 📊 **Dashboard și Monitorizare** - statistici, insights

### 📖 Documentație completă User Stories
Pentru o vizualizare detaliată a tuturor user stories-urilor cu criterii de acceptare, story points și definiția de "Done", consultă:

**📋 [User Stories StayOnTrack - Notion](https://www.notion.so/266ba4e146978094b0fbfb89223da38a?v=266ba4e1469781c2b8c2000c88e2b50e&t=new)**

---

## 🤖 Prompt Engineering

În dezvoltarea acestui proiect, am folosit ChatGPT pentru a îmbunătăți calitatea și eficiența dezvoltării:

### 🔍 **Debugging și Înțelegere Erori**
- Analiza și înțelegerea erorilor complexe din cod
- Explicarea stack trace-urilor și identificarea cauzelor rădăcină
- Sugestii pentru rezolvarea problemelor de compatibilitate

### 🎨 **Stilizarea Paginilor Web**
- Generarea de cod CSS pentru design modern și responsive
- Optimizarea layout-urilor și componentelor UI
- Implementarea de animații și efecte vizuale
- Crearea de teme și scheme de culori consistente

### 🏗️ **Îmbunătățirea Calității Codului**
- Aplicarea design pattern-urilor moderne (Repository, Factory, Facade, etc.)
- Refactoring și optimizarea structurii codului
- Implementarea best practices pentru React, Node.js și JavaScript
- Sugestii pentru arhitectura aplicației

### 📚 **Documentație și Diagrame**
- Corectarea și reformularea documentației tehnice
- Crearea de diagrame UML și arhitecturale
- Generarea de README-uri structurate și clare
- Organizarea informațiilor în format markdown

### 🧠 **Învățare și Înțelegere Concepte**
- **Kubernetes:** Înțelegerea orchestrei containerelor, deployment-urilor și serviciilor
- **React:** Profundarea conceptelor de hooks, state management și component lifecycle
- **Extensii Web:** Comprehenderea arhitecturii Chrome Extensions și comunicării între componente
- **Docker:** Aprofundarea containerizării, Docker Compose și best practices
- **JavaScript:** Îmbunătățirea cunoașterii ES6+, async/await și module system

### 💡 **Beneficii Prompt Engineering**
- ✅ **Accelerarea dezvoltării** prin înțelegerea rapidă a conceptelor
- ✅ **Îmbunătățirea calității** codului prin aplicarea best practices
- ✅ **Reducerea timpului** petrecut pe debugging și research
- ✅ **Învățarea continuă** prin discuții interactive și exemple practice
- ✅ **Optimizarea procesului** de dezvoltare prin sugestii contextuale

---

## 🧪 Testare
Testele pot fi rulate cu Playwright:
```bash
npx playwright test
```
Testele verifică:
- Pornirea serverului
- Autentificarea
- Adăugarea unui site în block-list și persistența acestuia după refresh

---

## ☁️ Deployment
Proces automatizat cu **GitHub Actions**:
1. Se construiește aplicația React → build static servit de Nginx
2. Se creează o imagine Docker pentru backend (Node.js)
3. Ambele imagini sunt urcate pe Docker Hub
4. Pe serverul de producție: workflow-ul se conectează prin SSH, actualizează imaginile și clusterul k3s reîmprospătează pod-urile.

![Diagrama workflow deployment cu Github Actions](./assets/workflow_deployment.png)
![Diagrama arhitectura clusterului Kubernetes](./assets/cluster_arhitecture.png)


# 🏗️ Design Patterns

## 📋 Cuprins
- [MVC (Model-View-Controller)](#mvc-model-view-controller)
- [Repository Pattern](#repository-pattern)
- [Middleware Pattern](#middleware-pattern)
- [Custom Hooks Pattern](#custom-hooks-pattern)
- [Factory Pattern](#factory-pattern)
- [Facade Pattern](#facade-pattern)
- [Module Pattern](#module-pattern)
- [Dependency Injection](#dependency-injection)

---

## 🎭 MVC (Model-View-Controller)

**Locație:** Întregul proiect

### Backend (Node.js/Express)
- **Models:** `server/src/models/User.js` (Mongoose schemas)
- **Controllers:** `server/src/controllers/` (authController, listController, etc.)
- **Views:** Nu aplicabil (API REST)

### Frontend (React)
- **Models:** State management cu React hooks
- **Views:** `client/src/pages/` (BlockList.jsx, TaskTracker.jsx)
- **Controllers:** Custom hooks și event handlers

**Exemplu Controller:**
```javascript
// server/src/controllers/listController.js
exports.getBlockList = async (req, res) => {
  const user = await userRepo.findById(req.user._id);
  res.json({ list: user.block_list || [] });
};
```

**Beneficii:**
- ✅ Separarea responsabilităților
- ✅ Cod organizat și ușor de întreținut
- ✅ Reutilizarea componentelor

---

## 🗄️ Repository Pattern

**Locație:** `server/src/repositories/userRepository.js`

**Descriere:** Abstractizează logica de acces la date și centralizează operațiunile CRUD.

```javascript
const User = require('../models/User');

module.exports = {
  findById: (id) => User.findById(id),
  findByGoogleId: (gid) => User.findOne({ googleId: gid }),
  findByEmail: (email) => User.findOne({ email }),
  create: (data) => new User(data).save(),
  updateById: (id, data) => User.updateOne({ _id: id }, { $set: data }),
  getRules: (id) => User.findById(id, { rules: 1 })
};
```

**Beneficii:**
- ✅ Separarea logicii de acces la date
- ✅ Centralizarea operațiunilor CRUD
- ✅ Ușurința testării și mock-ului
- ✅ Reutilizarea codului în multiple controllers

---

## 🔧 Middleware Pattern

**Locație:** `server/src/middlewares/`

**Descriere:** Funcții care se execută între request și response, pentru autentificare, validare, etc.

```javascript
// ensureAuth.js
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Neautentificat' });
}

module.exports = ensureAuth;
```

**Utilizare:**
```javascript
// server/src/routes/authRoutes.js
router.get('/check', ensureAuth, check);
```

**Beneficii:**
- ✅ Reutilizarea codului
- ✅ Separarea responsabilităților
- ✅ Pipeline de procesare a request-urilor
- ✅ Ușurința testării

---

## 🎣 Custom Hooks Pattern

**Locație:** `client/src/pages/ListManager.jsx`

**Descriere:** Hook-uri personalizate pentru logica reutilizabilă în React.

```javascript
export default function useListManager({ list, setList, label = "block-list" }) {
  
  function loadList() {
    apiFetch(`/api/${label}.json`)
    .then(result => {
      let resultList = result == undefined ? [] : result.list;
      setList(resultList);
      _updateLocalList(resultList);
    });
  }

  function _updateLocalList(newList) {
    window.postMessage({ 
      type: `update-${label}-data`, 
      list: newList 
    }, window.location.origin);
  }

  function _updateRemoteList(newList) {
    apiFetch(`/api/${label}/update`, 'POST', { list: newList });
  }

  function updateList(newList) {
    setList(newList);
    _updateLocalList(newList);
    _updateRemoteList(newList);
  }

  return { loadList, updateList };
}
```

**Utilizare:**
```javascript
// TaskTracker.jsx
const { loadList, updateList } = useListManager({
  list: taskList, 
  setList: setTaskList,
  label: "task-list"
});
```

**Beneficii:**
- ✅ Logica reutilizabilă
- ✅ Separarea UI de business logic
- ✅ Testabilitate îmbunătățită
- ✅ Cod mai curat în componente

---

## 🏭 Factory Pattern

**Locație:** `extension/config.js`

**Descriere:** Crearea obiectelor bazate pe configurație.

```javascript
const CONFIG = {
  ENV: 'dev', // 'dev' | 'prod'
  
  environments: {
    dev: {
      WEB_SERVER_URL: 'http://localhost',
      API_BASE: 'http://localhost/api',
      allowedOrigins: ['http://localhost']
    },
    prod: {
      WEB_SERVER_URL: 'http://stayontrack.site',
      API_BASE: 'http://stayontrack.site/api',
      allowedOrigins: ['http://stayontrack.site']
    }
  }
};

// Exportă configurația activă
const activeConfig = CONFIG.environments[CONFIG.ENV];
const WEB_SERVER_URL = activeConfig.WEB_SERVER_URL;
const API_BASE = activeConfig.API_BASE;
```

**Beneficii:**
- ✅ Configurație centralizată
- ✅ Ușurința schimbării între medii
- ✅ Encapsularea logicii de creare
- ✅ Reutilizarea configurațiilor

---

## 🎭 Facade Pattern

**Locație:** `client/src/pages/ApiFetch.jsx`

**Descriere:** Interfață simplificată pentru operațiuni complexe.

```javascript
export default async function apiFetch(url, method = "GET", data = null) {
  const options = {
    method,
    credentials: "include",
    headers: {}
  };

  if (data) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  } else {
    delete options.headers;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error: ", error);
    return null;
  }
}
```

**Utilizare:**
```javascript
// Simplifică apelurile API
const result = await apiFetch('/api/block-list.json');
const updateResult = await apiFetch('/api/block-list/update', 'POST', { list: newList });
```

**Beneficii:**
- ✅ Interfață simplificată
- ✅ Encapsularea complexității
- ✅ Reutilizarea codului
- ✅ Ușurința testării

---

## 📦 Module Pattern

**Locație:** Toate fișierele `.js`

**Descriere:** Encapsularea codului în module cu interfețe publice.

```javascript
// server/src/controllers/authController.js
exports.googleCallback = (req, res) => {
  console.log('User authenticated:', req.user);
  res.redirect(process.env.WEB_SERVER_URL + '/');
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(process.env.WEB_SERVER_URL);
    });
  });
};

exports.check = (req, res) => {
  res.json({ auth: req.isAuthenticated() });
};
```

**Beneficii:**
- ✅ Encapsularea codului
- ✅ Namespace-uri clare
- ✅ Prevenirea poluării namespace-ului global
- ✅ Ușurința organizării codului

---

## 💉 Dependency Injection

**Locație:** Controllers folosesc repositories

**Descriere:** Injectarea dependențelor pentru a reduce cuplarea.

```javascript
// server/src/controllers/listController.js
const userRepo = require('../repositories/userRepository');

exports.getBlockList = async (req, res) => {
  const user = await userRepo.findById(req.user._id);
  res.json({ list: user.block_list || [] });
};

exports.updateBlockList = async (req, res) => {
  const { list } = req.body;
  await userRepo.updateById(req.user._id, { block_list: list });
  res.json({ message: 'List updated successfully' });
};
```

**Beneficii:**
- ✅ Reducerea cuplării
- ✅ Ușurința testării
- ✅ Flexibilitatea configurației
- ✅ Reutilizarea componentelor
