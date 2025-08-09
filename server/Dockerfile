FROM node:16

# Setează directorul de lucru în container
WORKDIR /app

# Copiază restul fișierelor aplicației
COPY . .

# Instalează dependențele
RUN npm install

# Expune portul pe care rulează aplicația
EXPOSE 3000

# Comanda pentru a porni aplicația
CMD ["npm", "start"]