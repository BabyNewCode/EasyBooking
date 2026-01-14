# EasyBooking - Application de Gestion de Réservations de Chambres

## 📋 Description

EasyBooking est une application web permettant la gestion efficace des réservations de chambres. Les utilisateurs peuvent créer un compte, se connecter, consulter les chambres disponibles et réserver des créneaux horaires.

## 🎯 Fonctionnalités Principales

- **Authentification** : Inscription et connexion sécurisées
- **Gestion des chambres** : 9 chambres réparties sur 3 étages
  - Étage 1 : 3 chambres pour 1 personne
  - Étage 2 : 3 chambres pour 2 personnes
  - Étage 3 : 3 chambres pour 4 personnes
- **Réservations** : Réservation de chambres pour des créneaux horaires spécifiques
- **Historique** : Consultation des réservations passées et à venir
- **Annulation** : Possibilité d'annuler les réservations

## 🏗️ Architecture

```
EasyBooking/
├── src/
│   ├── backend/          # API Node.js/Express
│   │   ├── models/       # Schémas MongoDB (User, Room, Reservation)
│   │   ├── routes/       # Routes API
│   │   ├── controllers/  # Logique métier
│   │   ├── middleware/   # Authentification, validation
│   │   ├── config/       # Configuration
│   │   └── server.js     # Serveur principal
│   └── frontend/         # Interface utilisateur
│       ├── css/          # Styles (Bootstrap, custom)
│       ├── js/           # Scripts client
│       └── pages/        # Pages HTML
├── tests/                # Tests automatisés
│   ├── unit/            # Tests unitaires
│   ├── integration/      # Tests d'intégration
│   ├── security/         # Tests de sécurité
│   └── performance/      # Tests de performance
├── docs/                 # Documentation
├── package.json
├── .env.example
└── README.md
```

## 💻 Stack Technologique

- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB (Atlas)
- **Frontend** : HTML5, CSS3, Bootstrap, JavaScript
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : bcryptjs (password hashing), Helmet
- **Tests** : Jest, Supertest, MongoDB Memory Server
- **Validation** : express-validator

## 🚀 Installation et Démarrage

### Prérequis

- Node.js v16+
- npm ou yarn
- MongoDB Atlas account (base de données cloud)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/BabyNewCode/EasyBooking.git
   cd EasyBooking
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos identifiants MongoDB
   ```

4. **Démarrer le serveur**
   ```bash
   # Mode développement (avec auto-reload)
   npm run dev

   # Mode production
   npm start
   ```

5. **Accéder à l'application**
   ```
   http://localhost:5000
   ```

## 🧪 Tests

### Exécuter tous les tests
```bash
npm test
```

### Exécuter les tests par type
```bash
npm run test:unit          # Tests unitaires
npm run test:integration   # Tests d'intégration
npm run test:security      # Tests de sécurité
npm run test:performance   # Tests de performance
```

## 📊 Spécifications des Chambres

| Étage | Nom de la chambre | Capacité | Nombre |
|-------|------------------|----------|--------|
| 1     | Mercure, Vénus, Terre | 1 personne | 3 |
| 2     | Mars, Jupiter, Saturne | 2 personnes | 3 |
| 3     | Uranus, Neptune, Pluton | 4 personnes | 3 |

## 📚 API Documentation

### Endpoints Principaux

#### Authentification
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/logout` - Déconnexion

#### Chambres
- `GET /api/rooms` - Liste toutes les chambres
- `GET /api/rooms/:id` - Détails d'une chambre
- `GET /api/rooms/availability/:id` - Disponibilité d'une chambre

#### Réservations
- `POST /api/reservations` - Créer une réservation
- `GET /api/reservations` - Lister les réservations de l'utilisateur
- `GET /api/reservations/:id` - Détails d'une réservation
- `PUT /api/reservations/:id` - Modifier une réservation
- `DELETE /api/reservations/:id` - Annuler une réservation

## 🎨 Charte Graphique

- **Couleur dominante** : Anthracite (#2C3E50)
- **Couleur secondaire** : Violet (#9B59B6)
- **Texte** : Blanc (#FFFFFF)
- **Fond** : Anthracite (#2C3E50)
- **Police** : Bootstrap standard (Segoe UI, sans-serif)

## ✅ Critères d'Évaluation

- ✓ Minimum 4 types de tests (Unitaires, Intégration, Sécurité, Performance)
- ✓ Minimum 10 cas de test par type
- ✓ Tests automatisés avec couverture de code
- ✓ Plan de test complet
- ✓ Rapport de synthèse qualité
- ✓ Code source versionné sur Git

## 📝 Livrables

- [x] Structure du projet
- [x] Code des tests automatisés
- [ ] Plan de test complet
- [ ] Fiche de tests + captures d'exécution
- [ ] Rapport de synthèse qualité

## 👥 Équipe

Projet réalisé dans le cadre du cours "Test Logiciel" - Master 1 EFREI

## 📄 Licence

MIT

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub.

---

**Dernière mise à jour** : Janvier 2026
