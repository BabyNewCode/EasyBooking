// Page d'inscription
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const messageDiv = document.getElementById('signupMessage');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                messageDiv.innerHTML = '<div class="alert alert-success">Compte créé avec succès!</div>';
                setTimeout(() => {
                    window.location.href = '/rooms';
                }, 1000);
            } else {
                const errorMsg = data.errors ? data.errors[0].msg : data.message;
                messageDiv.innerHTML = `<div class="alert alert-danger">${errorMsg}</div>`;
            }
        } catch (error) {
            messageDiv.innerHTML = '<div class="alert alert-danger">Erreur lors de l\'inscription</div>';
        }
    });
});
