// Establish socket connection to server
const socket = io();

// Initialize Leaflet map and set default center to India
const map = L.map('map').setView([20.5937, 78.9629], 5);

// Reference to user list in the sidebar
const userListEl = document.getElementById('user-list');

// Check if current user is admin by verifying URL contains the secret key
const isAdmin = window.location.search.includes(`admin=${window.ADMIN_SECRET}`);

// Store markers for users by their socket IDs
const markers = {};

// Load OpenStreetMap tiles as map background
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Try to access user's location using browser's Geolocation API
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      // Emit live location data to server
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
    { enableHighAccuracy: true } // Use high accuracy GPS when possible
  );
} else {
  alert('Geolocation is not supported by your browser.');
}

// Listen for location updates from server for all users
socket.on('locationData', (userInfo) => {
  // Render sidebar user list
  renderUserList(userInfo);

  // For normal users, remove all other users' markers from the map
  if (!isAdmin) {
    for (const id in markers) {
      if (id !== socket.id) {
        map.removeLayer(markers[id]); // Remove from map
        delete markers[id];           // Remove from local memory
      }
    }
  }

  // Iterate through all users received from server
  Object.entries(userInfo).forEach(([id, info]) => {
    const { latitude, longitude } = info;

    // If not admin, skip showing others' markers
    if (!isAdmin && id !== socket.id) return;

    // Choose icon based on whether it's the current user
    const iconUrl = id === socket.id
      ? 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png' // You
      : 'https://cdn-icons-png.flaticon.com/512/684/684908.png';  // Others

    // If marker exists, update position; else create new one
    if (markers[id]) {
      markers[id].setLatLng([latitude, longitude]);
    } else {
      markers[id] = L.marker([latitude, longitude], {
        title: id === socket.id ? 'You' : `User ${id}`,
        icon: L.icon({
          iconUrl,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        })
      }).addTo(map);
    }
  });
});

// Function to render sidebar user list
function renderUserList(userInfo) {
  userListEl.innerHTML = '';

  if (!isAdmin) {
    // Show only own location for normal users
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

  // Admin view — list all users
  Object.entries(userInfo).forEach(([id, info]) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${id === socket.id ? 'You' : id}</strong><br>
      📍 ${info.latitude}, ${info.longitude}<br>
      🎯 Accuracy: ${info.accuracy}m<br>
      🕒 ${info.lastUpdated}
    `;
    userListEl.appendChild(li);
  });
}
