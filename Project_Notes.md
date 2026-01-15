# Instructions de mission EasyBooking

Bienvenue dans la mission EasyBooking ! Dans cette tâche vous créerez une mini-application web qui permettra aux différents utilisateurs de gérer efficacement les réservations de chambres. Voici les étapes à suivre pour réaliser le devoir. Assurez-vous de lire chaque section attentivement pour comprendre ce qu'on attend de vous.


## Critères d'évalutation :

L'évalutaion du projet portera sur la mise en place de tests unitaires, des tests d'intégration, des tests de performances et des tests de sécurités.
    Il faut réaliser au minimum 4 types de tests selon votre choix.
    Minimum 10 cas de test par type de test.
    Max 95-100 tests au global, prioriser les tests essentiels ou importants.



## Aperçu d'EasyBooking

L'application EasyBooking permettra aux utilisateurs d'effectuer les fonctions clés suivantes :
- Créer un compte : Les utilisateurs devront s'inscrire pour utiliser l'application.
- Connexion : Une fois inscrits, les utilisateurs peuvent se connecter pour accéder à leur compte. • Voir la liste des chambres disponibles : Les utilisateurs peuvent voir quelles chambres sont disponibles à la réservation.
- Réserver une chambre pour un créneau horaire spécifique : Les utilisateurs peuvent sélectionner une chambre et la réserver pour l'heure souhaitée.
- Voir leurs réservations: Les utilisateurs peuvent consulter la liste de leurs réservations actuelles.


## Étapes pour terminer la mission

1. Créez un compte :
- Créer un formulaire d'inscription :
    - Inclure des champs pour le nom d'utilisateur, l'adresse e-mail et le mot de passe.
    - Valider l'entrée pour s'assurer que l'email est dans le format correct et que le mot de passe répond aux exigences de sécurité (par exemple, longueur minimale).
- Ajouter un bouton Envoi : Créer un bouton permettant aux utilisateurs de soumettre leurs informations.
- Fournir un retour: Après la soumission, affichez un message de réussite si le compte est créé avec succès. S'il y a des erreurs (comme un e-mail existant), informez l'utilisateur de ce qui a mal tourné.

2. Connexion :
- Créer un formulaire de connexion :
    - Inclure des champs pour l'email et le mot de passe.
- Implémenter l'authentification:
    - Vérifier les identifiants saisis par rapport aux données utilisateur stockées. Si c'est exact, autoriser l'accès à l'application; sinon, affichez un message d'erreur.
- Gérer les sessions utilisateur: Assurez-vous qu'une fois qu'un utilisateur se connecte, sa session est maintenue jusqu'à sa déconnexion.

3. Consultez la liste des chambres disponibles
- Créer une base de données de salle:
    - Liste ou base de données des chambres avec des détails tels que le nom de la chambre, la capacité et l'état de disponibilité.
- Salles d'exposition:
    - Concevoir une interface conviviale pour afficher la liste des pièces disponibles. Utilisez des graphiques ou des cartes pour plus de clarté.
- Ajouter des options de filtre: Envisagez d'ajouter des filtres (par exemple, par capacité ou commodités) pour aider les utilisateurs à trouver facilement la bonne pièce.

4. Réservez une chambre pour un créneau horaire précis
- Permettre la sélection de salle : Permettre aux utilisateurs de sélectionner une pièce parmi la liste des chambres disponibles.
- Fournir la sélection du créneau horaire :
    - Offrir aux utilisateurs la possibilité de choisir une date et une heure pour leur réservation. Vérifiez la disponibilité de la chambre à l'heure choisie.
- Demander une confirmation : Après avoir sélectionné une chambre et une heure, demandez aux utilisateurs de confirmer leur réservation. Mettez à jour le statut de disponibilité de la chambre dans votre base de données après confirmation.

5. Vérifiez leurs réservations
- Créer une section Historique des réservations: Permettre aux utilisateurs de consulter la liste de leurs réservations passées et à venir.
- Inclure des détails importants: Afficher des détails tels que le nom de la chambre, la date de réservation et le créneau horaire.
- Ajouter une option d'annulation: Envisagez d'inclure une fonctionnalité permettant aux utilisateurs d'annuler leurs réservations si nécessaire.


## Interface utilisateur et API
- Concevoir une interface simple: Utilisez une mise en page propre avec une navigation facile. Assurez-vous que les boutons et les liens sont clairement indiqués.
- Intégration API de documents: Si votre application utilise une API, documentez comment elle interagit avec l'interface, y compris comment les données sont récupérées et envoyées au serveur.


## Conclusion
En suivant ces instructions étape par étape, vous pourrez créer une application EasyBooking fonctionnelle qui répond aux exigences définies. N'oubliez pas de tester chaque fonctionnalité en profondeur pour vous assurer que tout fonctionne comme prévu.


## Architectutres & technos utilisées :

Pour mener à bien ce devoir vous utiliserez :
1. les technos suivantes :
    - Utilisation de Mongo Compass & Mongo Atlass pour la BDD / lien : mongodb+srv://samiamokrane_db_user:mjWJ6YknZwmadx06@easybooking.tq2wnra.mongodb.net/
    - Utilisation de Boostrap pour le CSS frontend
    - Utilisation de JavaScript pour le backend
    - Utiliser les technos et outils les plus simple pour développer l'appication web

2. Ainsi que l'architecture suivante :
    - 9 salles, portant le nom des 9 planètes du système solaire (Platon inclu)
    - Pour choisir la chambre, affichage par box, chaque salle est réservable en cliquant dessus ouverture d'un formulaire avec calendrier et heures
    - Nombre de place par chambre :
        - 3 chambres avec 1 personne
        - 3 chambres avec 2 personnes
        - 3 chambres avec 4 personnes

3. Mise en page :
    - navbar unique pour une navigation facile (logo, Chambres, Connexion)
    - fond anthracite / navbar violet / texte blanc
    - couleur dominante : anthracite & violet
    - style de mise en page propre, soigné et moderne
    - utilisé la même mise en page et les mêmes couleurs pour chaque page


## Livrables attendues :

    Plan de test complet
    Fiche de tests + captures ou export d'exécution
    Code des tests automatisés (Git)
    Rapport de synthèse qualité
    Lien Git du projet