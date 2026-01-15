// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Utility functions
class APIClient {
  static getToken() {
    return localStorage.getItem('token');
  }

  static setToken(token) {
    localStorage.setItem('token', token);
  }

  static removeToken() {
    localStorage.removeItem('token');
  }

  static async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

  if (response.status === 401) {
    this.removeToken();
    window.location.href = '/login';
  }

    return response;
  }

  static async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  static async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Auth functions
async function login(email, password) {
  const response = await APIClient.post('/auth/login', { email, password });
  const data = await response.json();
  
  if (response.ok) {
    APIClient.setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { success: true, data };
  }
  
  return { success: false, message: data.message };
}

async function register(username, email, password, passwordConfirm) {
  const response = await APIClient.post('/auth/register', {
    username,
    email,
    password,
    passwordConfirm
  });
  const data = await response.json();
  
  if (response.ok) {
    APIClient.setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { success: true, data };
  }
  
  return { success: false, message: data.message };
}

function logout() {
  APIClient.removeToken();
  localStorage.removeItem('user');
  window.location.href = '/login';
}

function isLoggedIn() {
  return !!APIClient.getToken();
}

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Room functions
async function getAllRooms() {
  const response = await APIClient.get('/rooms');
  return await response.json();
}

async function getRoomById(id) {
  const response = await APIClient.get(`/rooms/${id}`);
  return await response.json();
}

async function checkAvailability(roomId, startTime, endTime) {
  const response = await APIClient.get(
    `/rooms/${roomId}/availability?startTime=${startTime}&endTime=${endTime}`
  );
  return await response.json();
}

// Reservation functions
async function createReservation(roomId, startTime, endTime, numberOfGuests, notes) {
  const response = await APIClient.post('/reservations', {
    roomId,
    startTime,
    endTime,
    numberOfGuests,
    notes
  });
  const data = await response.json();
  
  return { success: response.ok, data };
}

async function getUserReservations() {
  const response = await APIClient.get('/reservations');
  return await response.json();
}

async function getReservationById(id) {
  const response = await APIClient.get(`/reservations/${id}`);
  return await response.json();
}

async function updateReservation(id, updates) {
  const response = await APIClient.put(`/reservations/${id}`, updates);
  const data = await response.json();
  
  return { success: response.ok, data };
}

async function cancelReservation(id) {
  const response = await APIClient.delete(`/reservations/${id}`);
  const data = await response.json();
  
  return { success: response.ok, data };
}

// Utility functions for UI
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.setAttribute('role', 'alert');
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  const container = document.querySelector('.container-fluid') || document.body;
  container.insertBefore(alertDiv, container.firstChild);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatDateTime(date) {
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
