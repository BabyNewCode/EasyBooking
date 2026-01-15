// Fonctions d'authentification

const API_URL = 'http://localhost:3000/api';

// Stocker et récupérer le token
function setToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

// Vérifier si l'utilisateur est authentifié
function isAuthenticated() {
    return !!getToken();
}

// Rediriger si non authentifié
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login';
    }
}

// Faire des appels API avec authentification
async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = getToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        removeToken();
        window.location.href = '/login';
        return null;
    }

    return response;
}

// Gestion de la déconnexion
document.addEventListener('DOMContentLoaded', () => {
    const logoutButtons = document.querySelectorAll('#logoutBtn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            removeToken();
            window.location.href = '/';
        });
    });

    // Mettre à jour la navigation en fonction de l'authentification
    updateNavigation();
});

function updateNavigation() {
    const authNav = document.getElementById('authNav');
    const homeButtonsContainer = document.getElementById('homeButtonsContainer');
    const homeAuthContainer = document.getElementById('homeAuthContainer');

    if (isAuthenticated()) {
        if (authNav) {
            authNav.innerHTML = '<button id="logoutBtn" class="btn btn-outline-light">Déconnexion</button>';
            const newLogoutBtn = authNav.querySelector('#logoutBtn');
            newLogoutBtn.addEventListener('click', () => {
                removeToken();
                window.location.href = '/';
            });
        }
        if (homeButtonsContainer) homeButtonsContainer.style.display = 'none';
        if (homeAuthContainer) homeAuthContainer.style.display = 'block';
    } else {
        if (homeButtonsContainer) homeButtonsContainer.style.display = 'block';
        if (homeAuthContainer) homeAuthContainer.style.display = 'none';
    }
}
