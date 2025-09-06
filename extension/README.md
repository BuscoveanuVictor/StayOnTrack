# Configurare Extensie StayOnTrack

## Schimbarea intre Dev si Productie

Pentru a schimba intre mediul de dezvoltare si productie, editeaza fisierul `config.js`:

### Pentru Development (localhost):
```javascript
const CONFIG = {
  ENV: 'dev', // Schimba aici
  // ...
};
```

### Pentru Productie (stayontrack.site):
```javascript
const CONFIG = {
  ENV: 'prod', // Schimba aici
  // ...
};
```

## Configurari disponibile:

- **dev**: 
- **prod**: `http://stayontrack.site` (frontend + API)

## Dupa schimbare:

1. Salveaza fisierul `config.js`
2. Mergi la `chrome://extensions/`
3. Apasa "Reload" pe extensia StayOnTrack
4. Testeaza functionalitatea

## Verificare configuratie:

Deschide Console-ul din extensie (chrome://extensions/ → Details → Inspect views: background page) si verifica ca variabilele au valori corecte.
