<h1 align="center">📍 TrackIn – Real-Time Location Tracker</h1>

<p align="center">
  Live, secure, and modern location tracking using Leaflet.js + Socket.IO + Node.js
  <br><br>
  <a href="https://trackin-brwd.onrender.com" target="_blank"><strong>🌐 Live Demo</strong></a> | 
  <a href="https://github.com/ayushmanmishra18/TrackIn" target="_blank"><strong>📦 GitHub Repo</strong></a>
</p>

---

## 🛰️ About

**TrackIn** is a real-time location tracking web app that allows users to see their live position on a map.  
The **admin** can see all users who are currently using the app — with accurate coordinates, timestamps, and more.

> Great for learning geolocation, socket-based communication, and admin-only access systems.

---

## 🔥 Features

- 🌍 Live map with location markers using **Leaflet.js**
- 🔁 Real-time updates using **Socket.IO**
- 🔐 **Admin-only** access to track all users
- 📌 Sidebar to show active user locations
- ⚙️ Configurable secret via `.env`
- 📱 Mobile-first and responsive design
- ⚡ Deployed on **Render**

---

## 🧪 Live Demo

🟢 [https://trackin-brwd.onrender.com](https://trackin-brwd.onrender.com)

> Visit as a user or add `?admin=your_secret` to access admin mode.

---

## 🧑‍💻 Tech Stack

| Tech         | Usage                        |
|--------------|------------------------------|
| **Node.js**  | Backend runtime              |
| **Express.js** | HTTP server                |
| **Socket.IO** | Real-time WebSocket updates |
| **Leaflet.js** | Interactive map rendering  |
| **EJS**        | HTML templating engine     |
| **Render**     | Cloud deployment           |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/ayushmanmishra18/TrackIn.git

cd TrackIn
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup `.env` file
```env
ADMIN_SECRET=your_custom_secret
```

### 4. Start the server
```bash
node app.js
```

> Visit: `http://localhost:4000`  
> For admin: `http://localhost:4000/?admin=your_custom_secret`

---

## 🔐 Admin Access

Only the **admin** can view all users' locations.

✅ **How?**  
Pass the secret key in the URL as a query parameter:

```
https://trackin-brwd.onrender.com/?admin=your_custom_secret
```

You can change this secret inside your `.env` file like this:
```env
ADMIN_SECRET=mySuperSecret
```

---

## 📁 Project Structure

```text
TrackIn/
│
├── public/                 # Static frontend files
│   ├── css/
│   │   └── styles.css      # App styling
│   └── js/
│       └── scripts.js      # Client-side JS logic
│
├── views/
│   └── index.ejs           # HTML rendered with Leaflet and Socket.IO
│
├── app.js                  # Main Express + Socket.IO server
├── .env                    # Environment variables (secret keys, ports)
├── package.json            # Project metadata and dependencies
└── README.md               # You're reading it :)
```

---


---

## 📌 To-Do / Ideas

- [ ] Save location history per user  
- [ ] Add user/device names or avatars  
- [ ] Path drawing with polylines  
- [ ] Map clustering for scalability  
- [ ] Convert to PWA for mobile support  

---

## ✨ Author

Made with ❤️ by [Ayushman Mishra](https://github.com/ayushmanmishra18)

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---