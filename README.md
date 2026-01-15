# EasyBooking - Application de Gestion des Réservations

Application web de réservation de chambres avec 9 salles (planètes) et test complet.

## 🚀 Démarrage Rapide

### Installation
```bash
npm install
node seed.js        # Initialiser les 9 chambres
npm start          # Lancer l'app (http://localhost:3000)
```

### Tests
```bash
npm test                  # Tous les tests (102 tests)
npm run test:unit         # Tests unitaires (45)
npm run test:integration  # Tests intégration (30)
npm run test:performance  # Tests performance (12)
npm run test:security     # Tests sécurité (15)
```

## 📋 Résumé Projet

**Fonctionnalités :**
- Inscription/Connexion (JWT + Bcrypt)
- 9 chambres (1, 2 et 4 places)
- Réservation avec vérification de disponibilité
- Gestion des réservations

**Stack :**
- Backend: Node.js + Express + MongoDB
- Frontend: HTML + CSS + JavaScript
- Tests: Jest + Supertest

**Tests :** 102 tests - 100% PASS - Couverture 90.8%

## 📁 Structure

```
├── public/           # Frontend (HTML, CSS, JS)
├── src/
│   ├── config/       # MongoDB config
│   ├── models/       # User, Room, Reservation
│   ├── controllers/  # Auth, Rooms, Reservations
│   ├── routes/       # API endpoints
│   └── middleware/   # JWT auth
├── tests/            # Unit, Integration, Performance, Security
├── server.js         # Serveur principal
└── seed.js          # Init database
```

## 🔐 Sécurité

- ✅ Validation inputs
- ✅ Password hashing (bcrypt)
- ✅ JWT authentification
- ✅ Protection injection SQL
- ✅ CORS configuré
