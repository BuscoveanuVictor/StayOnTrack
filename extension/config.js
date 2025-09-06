// Configurare extensie - schimba intre dev si productie
const CONFIG = {
  // Schimba la 'dev' pentru localhost sau 'prod' pentru stayontrack.site
  ENV: 'dev', // 'dev' | 'prod'
  
  // Configurari pentru fiecare environment
  environments: {
    dev: {
      WEB_SERVER_URL: 'http://localhost',
      allowedOrigins: ['http://localhost']
    },
    prod: {
      WEB_SERVER_URL: 'http://stayontrack.site',
      allowedOrigins: ['http://stayontrack.site']
    }
  }
};

// Exporta configuratia activa
const activeConfig = CONFIG.environments[CONFIG.ENV];
const WEB_SERVER_URL = activeConfig.WEB_SERVER_URL;

// Verifica daca origin-ul este permis
function isAllowedOrigin(origin) {
  return CONFIG.environments[CONFIG.ENV].allowedOrigins.some(allowed => 
    origin.includes(allowed.replace(/^https?:\/\//, ''))
  );
}

// Debug info
console.log(`[StayOnTrack] Environment: ${CONFIG.ENV}`);
console.log(`[StayOnTrack] Web Server: ${WEB_SERVER_URL}`);
