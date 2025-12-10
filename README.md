# 🏨 Hotel Booking System (MERN Stack)

This is the repository for the Hotel Booking System Group Project.

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine.

### 1️⃣ Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (Latest LTS version)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)

---

### 2️⃣ Clone the Repository

Open your terminal and run:

```bash
git clone <YOUR_GITHUB_REPO_LINK_HERE>
cd Hotel-Booking-System


3️⃣ Backend Setup (Server)
1.Navigate to the backend folder:

#Bash
cd backend

2.Install dependencies:

#Bash
npm install

3.Setup Environment Variables (.env):

*Create a new file named .env inside the backend folder.
*Ask the Team Lead for the MONGO_URI connection string.
*Paste the following content into .env:

#Code snippet
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hotel_booking_db?retryWrites=true&w=majority
JWT_SECRET=hotel_booking_secret_key_123

4.Start the Backend Server:

#Bash
npm run dev
#(You should see: "Server running on port 5000" & "MongoDB Connected")

4️⃣ Frontend Setup (Client)

1.Open a new terminal (keep backend running) and navigate to the frontend folder:

#Bash
cd frontend

2.Install dependencies:

#Bash
npm install

3.Start the React App:

#Bash
npm run dev

4.Open the link shown in the terminal (e.g., http://localhost:5173) in your browser.

🔑 Login Credentials (Admin)
Username: admin

Password: password123

################################################
🛠️ Git Workflow for Team Members
DO NOT push directly to the main branch!

1.Pull the latest code before starting:

#Bash
git pull origin main

2.Create your own branch (Name it by feature, e.g., rooms-feature):

#Bash
git checkout -b <your-branch-name>

3.Do your work & Save:

#Bash
git add .
git commit -m "Added room management feature"

4.Push your branch:

#Bash
git push origin <your-branch-name>
```
