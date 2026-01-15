// Page des chambres
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    loadRooms();
    setupEventListeners();
});

let allRooms = [];

async function loadRooms(startDate = null, endDate = null) {
    try {
        let endpoint = '/rooms';
        
        if (startDate && endDate) {
            endpoint = `/rooms/available?startDate=${startDate}&endDate=${endDate}`;
        }

        const response = await apiCall(endpoint);
        const data = await response.json();

        allRooms = data.rooms;
        displayRooms(data.rooms);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function displayRooms(rooms) {
    const container = document.getElementById('roomsContainer');
    container.innerHTML = '';

    if (rooms.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">Aucune chambre disponible.</div></div>';
        return;
    }

    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'col-md-4 mb-4';
        roomCard.innerHTML = `
            <div class="room-card" onclick="openReservationModal('${room._id}', '${room.name}', ${room.capacity})">
                <h3>${room.name}</h3>
                <p class="room-capacity">Capacité: <strong>${room.capacity} personne(s)</strong></p>
                <p class="text-muted">Cliquez pour réserver</p>
            </div>
        `;
        container.appendChild(roomCard);
    });
}

function setupEventListeners() {
    const filterBtn = document.getElementById('filterBtn');
    const resetBtn = document.getElementById('resetBtn');

    filterBtn.addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
            alert('Veuillez sélectionner les deux dates');
            return;
        }

        loadRooms(startDate, endDate);
    });

    resetBtn.addEventListener('click', () => {
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        loadRooms();
    });
}

function openReservationModal(roomId, roomName, capacity) {
    document.getElementById('roomId').value = roomId;
    document.getElementById('roomName').textContent = roomName;
    
    const modal = new bootstrap.Modal(document.getElementById('reservationModal'));
    modal.show();
}

document.getElementById('confirmReservation').addEventListener('click', async () => {
    const roomId = document.getElementById('roomId').value;
    const startDate = document.getElementById('reservStartDate').value;
    const endDate = document.getElementById('reservEndDate').value;

    if (!startDate || !endDate) {
        alert('Veuillez sélectionner les dates');
        return;
    }

    try {
        const response = await apiCall('/reservations', {
            method: 'POST',
            body: JSON.stringify({
                roomId,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString()
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Réservation créée avec succès!');
            bootstrap.Modal.getInstance(document.getElementById('reservationModal')).hide();
            loadRooms();
        } else {
            alert(`Erreur: ${data.message}`);
        }
    } catch (error) {
        alert('Erreur lors de la réservation');
    }
});
