# EasyBooking - Guide de Démarrage

## Prérequis
- Node.js v22+
- MongoDB Atlas (avec IP whitelistée)
- npm

## Installation & Démarrage

### 1. Installer les dépendances
```powershell
npm install
```

### 2. Initialiser la base de données (IMPORTANT !)
```powershell
node initDb.js
```

Vous devriez voir:
```
✅ Connecté à MongoDB
✅ 9 chambres créées avec succès !
✅ Base de données initialisée avec succès !
```

### 3. Lancer le serveur
```powershell
npm start
```

Le serveur devrait afficher:
```
✅ Serveur démarré sur le port 5000
📍 Accédez à http://localhost:5000
✅ MongoDB connecté: ...
```

### 4. Accéder à l'application
```
http://localhost:5000
```

## Flux d'utilisation

1. **Page d'accueil** → http://localhost:5000
2. **S'inscrire** → http://localhost:5000/register.html
3. **Se connecter** → http://localhost:5000/login.html
4. **Voir les chambres** → http://localhost:5000/rooms.html
5. **Mes réservations** → http://localhost:5000/reservations.html

## Exécuter les tests

```powershell
# Tous les tests
npm test

# Tests spécifiques
npm run test:unit
npm run test:integration
npm run test:security
npm run test:performance
```

## Architecture

### 9 Chambres disponibles:

**Étage 1** (1 personne):
- Mercure
- Vénus
- Terre

**Étage 2** (2 personnes):
- Mars
- Jupiter
- Saturne

**Étage 3** (4 personnes):
- Uranus
- Neptune
- Pluton

### Fonctionnalités

✅ Inscription & Connexion (JWT)
✅ Affichage des chambres par étage
✅ Réservation avec sélection de date/heure
✅ Protection contre les double-réservations
✅ Gestion des réservations (voir, modifier, annuler)
✅ 204 tests automatisés (87.3% coverage)

## Dépannage

### Aucune chambre n'apparaît
→ Assurez-vous d'avoir exécuté `node initDb.js`

### "MongoDB connecté" n'apparaît pas
→ Vérifiez que votre IP est whitelistée sur MongoDB Atlas
→ Allez sur https://cloud.mongodb.com → Network Access → Ajouter votre IP

### Port déjà en utilisation
→ Modifiez le PORT dans `.env`

## Fichier .env

Assurez-vous d'avoir un fichier `.env` avec:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/easybooking
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=7d
```
