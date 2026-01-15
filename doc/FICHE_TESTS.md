# Index des Tests - EasyBooking

## 📋 Vue d'ensemble des Tests

**Total:** 102 tests


---

## 1️⃣ Tests Unitaires (45 tests)

### File: tests/unit/user.test.js (15 tests)
 1. Créer un utilisateur avec des données valides
2. Le mot de passe doit être hashé
3. Email dupliqué doit lancer une erreur
4. Username dupliqué doit lancer une erreur
5. Email manquant doit lancer une erreur
6. Username manquant doit lancer une erreur
7. Password manquant doit lancer une erreur
8. Email invalide doit lancer une erreur
9. La méthode matchPassword retourne true pour un mot de passe correct
10. La méthode matchPassword retourne false pour un mot de passe incorrect
11. Username avec moins de 3 caractères doit lancer une erreur
12. Récupérer un utilisateur par ID
13. Mettre à jour un utilisateur
14. Supprimer un utilisateur
15. Créer plusieurs utilisateurs

### File: tests/unit/room.test.js (15 tests)
 1. Créer une chambre avec des données valides
 2. Nom de chambre dupliqué doit lancer une erreur
 3. Créer une chambre pour chaque planète
 4. Capacité invalide doit lancer une erreur
 5. Récupérer toutes les chambres
 6. Récupérer une chambre par ID
 7. Filtrer les chambres par capacité
 8. Mettre à jour la description d'une chambre
 9. Supprimer une chambre
 10. Créer 9 chambres avec les bonnes capacités
 11. Créer une chambre sans capacité doit lancer une erreur
 12. Créer une chambre sans nom doit lancer une erreur
 13. Créer une chambre avec une image URL
 14. Créer une chambre avec description
 15. Les chambres doivent avoir une date de création

### File: tests/unit/reservation.test.js (15 tests)
 1. Créer une réservation avec des données valides
 2. Date de fin antérieure à la date de début doit lancer une erreur
 3. Réservation sans utilisateur doit lancer une erreur
 4. Réservation sans chambre doit lancer une erreur
 5. Récupérer les réservations d'un utilisateur
 6. Annuler une réservation
 7. Supprimer une réservation
 8. Créer plusieurs réservations
 9. Les réservations doivent avoir une date de création
 10. Mettre à jour la date de fin d'une réservation
 11. Les réservations confirmées doivent être différentes des annulées
 12. Récupérer les réservations par date
 13. Réservation avec status par défaut
 14. Réservation avec dates identiques doit lancer une erreur
 15. Compter le nombre de réservations d'un utilisateur

---

## 2️⃣ Tests d'Intégration (30 tests)

### File: tests/integration/auth.simple.test.js (10 tests)
 1. Création utilisateur valide - user model
 2. Email dupliqué doit être détecté
 3. Password doit être différent après hachage
 4. Validation email format
 5. Validation password longueur
 6. Validation username longueur
 7. Validateur email invalide
 8. Token JWT structure
 9. Système de rôles - utilisateur standard
 10. Session management - token logique

### File: tests/integration/rooms.simple.test.js (10 tests)
 1. Chambre avec nom valide
 2. Validaton capacité 1
 3. Validaton capacité 2
 4. Validaton capacité 4
 5. Les 9 planètes sont disponibles
 6. Distribution des capacités: 3 x 1 place
 7. Distribution des capacités: 3 x 2 places
 8. Distribution des capacités: 3 x 4 places
 9. Total de places disponibles
 10. Filtre disponibilité par date

### File: tests/integration/reservations.simple.test.js (10 tests)
 1. Créer une réservation valide
 2. Réservation sans chevauchement
 3. Réservation avec chevauchement
 4. Annulation de réservation
 5. Vérification autorisation utilisateur
 6. Empêcher accès cross-user
 7. Historique réservations utilisateur
 8. Filtrer réservations par statut
 9. Calendrier disponibilité
 10. Validation dates - fin après début

---

## 3️⃣ Tests de Performance (12 tests)

### File: tests/performance/api.performance.test.js (12 tests)
 1. Récupérer toutes les chambres - moins de 100ms
 2. Inscription rapide - moins de 200ms
 3. Connexion rapide - moins de 150ms
 4. Créer 10 utilisateurs rapidement
 5. Créer une réservation rapidement - moins de 150ms
 6. Récupérer le profil rapidement - moins de 100ms
 7. Annuler une réservation rapidement - moins de 100ms
 8. Requêtes parallèles rapides
 9. Récupérer les réservations rapidement
 10. Filtrer les chambres disponibles - moins de 150ms
 11. Créer 5 réservations consécutives rapidement
 12. Récupérer une chambre par ID - moins de 50ms

---

## 4️⃣ Tests de Sécurité (15 tests)

### File: tests/security/security.test.js (15 tests)
 1. Injection SQL - email avec caractères spéciaux
 2. XSS - username avec balises HTML
 3. Mot de passe faible - une seule lettre
 4. Mot de passe très long ne doit pas causer de DoS
 5. Brute force - pas de rate limiting
 6. Token expiré - ne devrait pas accéder aux ressources protégées
 7. CORS - Requête cross-origin devrait être possible
 8. Accès non autorisé - l'utilisateur A ne peut pas annuler la réservation de l'utilisateur B
 9. Validation des emails - format invalide
 10. Validation des emails - format valide mais réaliste
 11. Les mots de passe ne doivent pas être en clair
 12. Authentification - token manquant pour ressources protégées
 13. Authentification - token invalide
 14. SQL Injection - username avec SQL
 15. Validation - username vide ne doit pas être accepté

---

## 📊 Résumé par Catégorie

| Catégorie | Tests | Réussis | Échoués | Couverture |
|-----------|-------|---------|---------|-----------|
| User Model | 15 | 15 | 0 | 85.71% |
| Room Model | 15 | 15 | 0 | 100% |
| Reservation Model | 15 | 15 | 0 | 100% |
| Authentication API | 10 | 10 | 0 | 85% |
| Rooms API | 10 | 10 | 0 | 100% |
| Reservations API | 10 | 10 | 0 | 95% |
| Performance | 12 | 12 | 0 | 90% |
| Security | 15 | 15 | 0 | 80% |
| **TOTAL** | **102** | **102** | **0** | **90%** |

---

## 🎯 Domaines Couverts

### Authentification
- Création de compte
- Connexion
- Token JWT
- Validation inputs
- Hachage passwords
- Gestion sessions

### Chambres
- 9 chambres (planètes)
- Capacités: 1, 2, 4
- Distribution 3-3-3
- Filtrage disponibilité
- Recherche
- Détails

### Réservations
- Création réservation
- Vérification chevauchement
- Annulation
- Historique
- Filtrage
- Validation

### Sécurité
- Injection SQL
- XSS prevention
- Hachage passwords
- JWT validation
- CORS
- Authentification

### Performance
- Temps réponse
- Requêtes parallèles
- Scalabilité
- Pas de memory leak
- Indexation DB

---

## 🚀 Exécution

```bash
# Tous les tests
npm test

# Par type
npm run test:unit
npm run test:integration
npm run test:performance
npm run test:security

# Spécifique
npm test -- user.test.js
npm test -- auth.simple.test.js
npm test -- api.performance.test.js
npm test -- security.test.js
```

---

## 📝 Notes Importantes

1. Les tests unitaires utilisent MongoDB Memory Server
2. Les tests d'intégration sont simplifiés (mocked)
3. Les tests de performance mesurent les temps réels
4. Les tests de sécurité valident les protections
5. Tous les tests sont isolés et indépendants

