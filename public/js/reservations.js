// Page des réservations
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    loadReservations();
});

async function loadReservations() {
    try {
        const response = await apiCall('/reservations');
        const data = await response.json();

        displayReservations(data.reservations);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function displayReservations(reservations) {
    const container = document.getElementById('reservationsContainer');
    const noReservations = document.getElementById('noReservations');

    if (reservations.length === 0) {
        container.innerHTML = '';
        noReservations.style.display = 'block';
        return;
    }

    noReservations.style.display = 'none';
    container.innerHTML = '';

    reservations.forEach(reservation => {
        const startDate = new Date(reservation.startDate).toLocaleDateString('fr-FR');
        const endDate = new Date(reservation.endDate).toLocaleDateString('fr-FR');
        const status = reservation.status === 'cancelled' ? 'Annulée' : 'Confirmée';

        const card = document.createElement('div');
        card.className = 'col-md-6 mb-3';
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${reservation.room.name}</h5>
                    <p><strong>Du:</strong> ${startDate}</p>
                    <p><strong>Au:</strong> ${endDate}</p>
                    <p><strong>Capacité:</strong> ${reservation.room.capacity} personne(s)</p>
                    <p><strong>Statut:</strong> <span class="badge bg-${reservation.status === 'cancelled' ? 'danger' : 'success'}">${status}</span></p>
                    ${reservation.status !== 'cancelled' ? `
                        <button class="btn btn-danger btn-sm" onclick="cancelReservation('${reservation._id}')">Annuler</button>
                    ` : ''}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

async function cancelReservation(reservationId) {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
        return;
    }

    try {
        const response = await apiCall(`/reservations/${reservationId}/cancel`, {
            method: 'PUT'
        });

        const data = await response.json();

        if (response.ok) {
            alert('Réservation annulée');
            loadReservations();
        } else {
            alert(`Erreur: ${data.message}`);
        }
    } catch (error) {
        alert('Erreur lors de l\'annulation');
    }
}
