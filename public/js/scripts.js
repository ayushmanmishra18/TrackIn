const socket =io();


if (navigator.geolocation) {
  const geoOptions = {
    enableHighAccuracy: true,  // Use GPS if available
    timeout: 5000,            // 5 seconds (in milliseconds)
    maximumAge: 0             // No cached position
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const accuracy = position.coords.accuracy; // Accuracy in meters
        
        console.log(`Position: ${latitude}, ${longitude} (±${accuracy}m)`);
        
        // Only send if accuracy is reasonable (under 100 meters)
        if (accuracy < 100) {
          socket.emit('send-location', { 
            latitude, 
            longitude,
            accuracy,
            timestamp: new Date().toISOString()
          });
        } else {
          console.warn('Position accuracy too low:', accuracy);
        }
      } catch (err) {
        console.error('Error processing position:', err);
      }
    },
    (error) => {
      // Detailed error handling
      let errorMessage;
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied. Please enable permissions.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
        default:
          errorMessage = `Unknown error: ${error.message}`;
      }
      
      console.error('Geolocation error:', errorMessage);
      alert(errorMessage); // Or show a user-friendly message
    },
    geoOptions
  );

  // Cleanup when needed (e.g., on page unload)
  window.addEventListener('beforeunload', () => {
    navigator.geolocation.clearWatch(watchId);
  });
} else {
  const message = "Geolocation is not supported by your browser";
  console.error(message);
  alert(message);
}

  const map = L.map('map').setView([0, 0], 16); // Start with zoom level 2 (world view)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "<h1>ayushman</h1>"
}).addTo(map);

const markers = {};
socket.on("Received location", (data) => {
  const { id, latitude, longitude } = data;

  if (id === socket.id) {
  map.setView([latitude, longitude], 15); 
}

  if(markers[id]){
    markers[id].setLatLng([latitude, longitude]);
  }
  else{
    markers[id] = L.marker([latitude, longitude]).addTo(map).bindPopup(`User: ${id}`);;
  }


});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});



    