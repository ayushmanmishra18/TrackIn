#device tracker 

RoadMap of this project---------->

Check if the browser supports geolocation.

Set options for high accuracy, a 5-second timeout, and no caching. Use watchPosition to track the user's location continuously. Emit the latitude and longitude via a socket with "send-location". Log any errors to the console.

Initialize a map centered at coordinates (0, 0) with a zoom level of 15 using Leaflet. Add OpenStreetMap tiles to the map.

Create an empty object markers.

When receiving location data via the socket, extract id, latitude, and longitude, and center the map on the new coordinates.

If a marker for the id exists, update its position, otherwise, create a new marker at the given coordinates and add it to the map. When a user disconnects, remove their marker from the map and delete it from markers.


# 🌍 Real-Time Location Tracker

This is a real-time web application that tracks users' geographic location on a map using **Leaflet**, **Socket.io**, and **Node.js**. Only the **admin (you)** can see the live location of all connected users, while regular users can only see their own location.

## 📸 Features

- 📍 Tracks user location in real time via browser geolocation API.
- 🗺️ Displays all users on an interactive Leaflet map.
- 👁️ Admin-only view: See everyone’s location and details.
- 🧍 Others see only their own position.
- 🧾 Side panel shows active users with details like:
  - Latitude/Longitude
  - Accuracy (meters)
  - Last update time
- 🔌 Real-time updates using WebSockets.

---

## ⚙️ Tech Stack

| Tech        | Role                         |
|-------------|------------------------------|
| Node.js     | Backend server               |
| Express     | Web framework                |
| EJS         | Templating engine            |
| Socket.io   | Real-time communication      |
| Leaflet.js  | Interactive mapping          |
| HTML/CSS    | Frontend structure and style |







```text
## 📁 Project Structure

├── public/
│ ├── css/
│ │ └── styles.css
│ └── js/
│ └── scripts.js
├── views/
│ └── index.ejs
├── app.js
├── package.json
└── README.md
```


## 🚀 How to Run Locally

### 1. Clone the Repository

git clone https://github.com/ayushmanmishra18/TrackIn.git

2. Install Dependencies

npm install
3. Start the Server

node app.js
The app will run on http://localhost:4000 by default.

🌐 Deploy on Render (Free Hosting)
Push your code to GitHub.

Go to https://render.com and log in.

Create a new Web Service.

Connect your GitHub repo.

Set the following:

Build Command: npm install

Start Command: node app.js

Environment: Node

Click Deploy.

Done! Your site is live.

📦 Example .env (Optional)
You can optionally use a .env file if you're storing secret keys or switching between dev/prod:


PORT=4000
🔐 Privacy Notes
Users must allow location access in their browser.

Only the admin (you) can view everyone's location.

All data is cleared when a user disconnects.

No personal info is stored beyond real-time use.


✍️ Author
Ayushman Mishra
 ✉️ ayushmanmishraji@gmail.com

 📜 License
This project is open-source under the MIT License.  


*********************lets Contribute ************