# Real-Time Collaborative Notes

A collaborative note-taking application built with the MERN stack and Socket.io that allows multiple users to create, edit, and share notes in real-time.

## Features

- Create and join note rooms with unique IDs
- Real-time collaborative editing
- See who's currently online in your note room
- Receive notifications when users join or leave
- Simple, clean interface for distraction-free note-taking

## Technology Stack

- **Frontend**: React, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB
- **Deployment**: Vercel (frontend), Render (backend)

## Key Concepts

### WebSockets

WebSockets provide a persistent connection between client and server, allowing for real-time, bi-directional communication. This project uses Socket.io, which provides WebSocket functionality with fallbacks for older browsers.

### Rooms

Socket.io's concept of "rooms" allows us to group connections together. In this application, each collaborative note has its own room, ensuring that updates are only sent to users who are working on the same note.

### Event-Driven Architecture

The application uses an event-driven approach where:
- Clients emit events when they make changes to a note
- The server broadcasts these events to other clients in the same room
- Clients listen for these events and update their UI accordingly

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/real-time-notes.git
   cd real-time-notes
   ```

2. Install server dependencies
   ```
   cd server
   npm install
   ```

3. Install client dependencies
   ```
   cd ../client
   npm install
   ```

4. Create environment variables
   
   Server (.env in server folder):
   ```
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:3000
   PORT=5000
   ```
   
   Client (.env in client folder):
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

### Running the Application

1. Start the server
   ```
   cd server
   npm start
   ```

2. Start the client
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Testing

To test the real-time functionality:
1. Open the application in multiple browser tabs or windows
2. Create a new note in one tab or join the same note using the room ID
3. Make changes in one tab and observe them appear in the other tab in real-time

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to `npm install`
4. Set the start command to `node server.js`
5. Add environment variables (MONGODB_URI, CLIENT_URL, NODE_ENV)

### Frontend (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the root directory to `client`
4. Add environment variables (REACT_APP_API_URL pointing to your Render deployment)

## Project Structure

```
real-time-notes/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── context/         # React context for socket management
│       ├── pages/           # React components for routes
│       ├── App.js           # Main application component
│       └── index.js         # Entry point
├── server/                  # Express.js backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   └── server.js            # Server entry point
└── README.md                # Project documentation
```

## License

MIT

## Acknowledgements

This project was created as part of a web development course assignment.