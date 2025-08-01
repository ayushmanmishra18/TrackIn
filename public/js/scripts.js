// Determine user role (admin or normal user) via URL query parameter
const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";

// Connect to server with role information
const socket = io({ query: { role: isAdmin ? "admin" : "user" } });

// Initialize Leaflet map with default zoom and center
const map = L.map('map').setView([0, 0], 16);

// Use OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "<h1>ayushman</h1>"
}).addTo(map);

// Object to track map markers by socket ID
const markers = {};

if (navigator.geolocation) {
  // Set geolocation options
  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  // Watch user's location continuously
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      console.log(`Position: ${latitude}, ${longitude} (±${accuracy}m)`);

      // Only send location if GPS accuracy is acceptable (< 100 meters)
      if (accuracy < 100) {
        socket.emit("send-location", {
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString()
        });

        // Update user’s own marker if not an admin
        if (!isAdmin) {
          if (markers[socket.id]) {
            markers[socket.id].setLatLng([latitude, longitude]);
          } else {
            markers[socket.id] = L.marker([latitude, longitude])
              .addTo(map)
              .bindPopup("You");
          }

          // Center the map to the user's location
          map.setView([latitude, longitude], 15);
        }
      } else {
        console.warn("Low GPS accuracy:", accuracy);
      }
    },
    (error) => {
      // Handle geolocation errors
      let message;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = "Location access denied.";
          break;
        case error.POSITION_UNAVAILABLE:
          message = "Location unavailable.";
          break;
        case error.TIMEOUT:
          message = "Location request timed out.";
          break;
        default:
          message = "Unknown geolocation error.";
      }
      console.error(message);
      alert(message);
    },
    geoOptions
  );

  // Cleanup geolocation watcher on window unload
  window.addEventListener("beforeunload", () => {
    navigator.geolocation.clearWatch(watchId);
  });

} else {
  // Handle unsupported geolocation
  alert("Geolocation is not supported by your browser.");
}

// ----- Receiving Locations from Server -----

socket.on("Received location", (data) => {
  const { id, latitude, longitude } = data;

  // If user is not admin, only allow them to see their own location
  if (!isAdmin && id !== socket.id) return;

  // Update marker if it already exists, otherwise create one
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    const label = id === socket.id ? "You" : `User: ${id}`;
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(label);
  }

  // Center map for the user on their own location
  if (id === socket.id) {
    map.setView([latitude, longitude], 15);
  }
});

// ----- Handle Disconnection of Users -----

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]); // Remove marker from map
    delete markers[id];           // Remove from tracking object
  }
});
