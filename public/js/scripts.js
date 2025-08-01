const socket = io();
const map = L.map('map').setView([20.5937, 78.9629], 5); // Default to India

const userListEl = document.getElementById('user-list');
const isAdmin = window.location.search.includes(`admin=${window.ADMIN_SECRET}`);

const markers = {}; // Store markers for all users

// Set up the map with OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Get user location with permission
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      socket.emit('locationUpdate', data);
    },
    (error) => {
      alert('Location access denied or error fetching location');
      console.error(error);
    },
    { enableHighAccuracy: true }
  );
} else {
  alert('Geolocation is not supported by your browser.');
}

// Listen for updated location data from server
socket.on('locationData', (userInfo) => {
  renderUserList(userInfo);

  Object.entries(userInfo).forEach(([id, info]) => {
    const { latitude, longitude } = info;

    // If marker exists, just update position
    if (markers[id]) {
      markers[id].setLatLng([latitude, longitude]);
    } else {
      // Create a new marker
      markers[id] = L.marker([latitude, longitude], {
        title: id === socket.id ? 'You' : `User ${id}`,
        icon: L.icon({
          iconUrl: id === socket.id
            ? 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png' // user icon
            : 'https://cdn-icons-png.flaticon.com/512/684/684908.png',   // others
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        })
      }).addTo(map);
    }
  });
});

// Render user list (only for admin)
function renderUserList(userInfo) {
  if (!isAdmin) {
    // Regular user should not see others
    userListEl.innerHTML = '';
    const info = userInfo[socket.id];
    if (info) {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>You</strong><br>
        📍 ${info.latitude}, ${info.longitude}<br>
        🎯 Accuracy: ${info.accuracy}m<br>
        🕒 ${info.lastUpdated}
      `;
      userListEl.appendChild(li);
    }
    return;
  }

  // Admin sees all users
  userListEl.innerHTML = '';
  Object.entries(userInfo).forEach(([id, info]) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${id === socket.id ? "You" : id}</strong><br>
      📍 ${info.latitude}, ${info.longitude}<br>
      🎯 Accuracy: ${info.accuracy}m<br>
      🕒 ${info.lastUpdated}
    `;
    userListEl.appendChild(li);
  });
}
