// Navbar component - Loaded on all pages
function initNavbar() {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">EasyBooking</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="/rooms">Chambres</a>
            </li>
            <li class="nav-item" id="reservationLink" style="display: none;">
              <a class="nav-link" href="/reservations">Mes Réservations</a>
            </li>
            <li class="nav-item" id="logoutLink" style="display: none;">
              <a class="nav-link" href="#" onclick="logout()">Déconnexion</a>
            </li>
            <li class="nav-item" id="loginLink">
              <a class="nav-link" href="/login">Connexion</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  // Insert navbar at the beginning of body
  const navContainer = document.createElement('div');
  navContainer.innerHTML = navbarHTML;
  document.body.insertBefore(navContainer.firstElementChild, document.body.firstChild);

  // Update navbar based on auth state
  updateNavbar();
}

function updateNavbar() {
  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('loginLink');
  const reservationLink = document.getElementById('reservationLink');
  const logoutLink = document.getElementById('logoutLink');

  if (token) {
    // User is logged in
    if (loginLink) loginLink.style.display = 'none';
    if (reservationLink) reservationLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'block';
  } else {
    // User is not logged in
    if (loginLink) loginLink.style.display = 'block';
    if (reservationLink) reservationLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// Initialize navbar when DOM is ready
document.addEventListener('DOMContentLoaded', initNavbar);
