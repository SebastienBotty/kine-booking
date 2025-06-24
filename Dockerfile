# Base Node légère
FROM node:18-alpine

# Dossier de travail dans le container
WORKDIR /usr/src/app

# Copier package.json & package-lock.json à la racine
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm install

# Copier tout le projet (incluant /src, /prisma, /messages, etc.)
COPY . .

# Générer client Prisma (le schema est dans /prisma)
RUN npx prisma generate

# Exposer le port Next.js
EXPOSE 3000

# Lancer l'app Next.js en mode dev
CMD ["npm", "run", "dev"]
