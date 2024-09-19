This is a chat application built with React and Vite for the frontend, and Express.js with MongoDB Atlas for the backend. 

**Objective**: Build a chat application with auto response from BE using random quote

## Main stack

- **Frontend**: React, Vite, HTML, CSS
- **Backend**: Express.js, MongoDB (Atlas)

## Setup and Installation

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account

### Backend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Vitaliy-Mazurenko/chat.git
   cd chat/server

   ```

2. **Install backend dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env` file in the `server` directory and add your MongoDB URI**:

   ```env
   MONGO_URI=your_mongodb_uri
   PORT=5000
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to the `client` directory**:

   ```bash
   cd ../client
   ```

2. **Install frontend dependencies**:

   ```bash
   npm install
   ```

3. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

### Usage

- Open your browser and navigate to `http://localhost:5173/` to see the application.
- The backend server will run on `http://localhost:5000`.
