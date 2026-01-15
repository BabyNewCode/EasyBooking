// Page de connexion
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                messageDiv.innerHTML = '<div class="alert alert-success">Connexion réussie!</div>';
                setTimeout(() => {
                    window.location.href = '/rooms';
                }, 1000);
            } else {
                messageDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
            }
        } catch (error) {
            messageDiv.innerHTML = '<div class="alert alert-danger">Erreur de connexion</div>';
        }
    });
});
