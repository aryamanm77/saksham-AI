<div align="center">
<pre>
███████╗ █████╗ ██╗  ██╗███████╗██╗  ██╗ █████╗ ███╗   ███╗    █████╗ ██╗
██╔════╝ ██╔══██╗██║ ██╔╝██╔════╝██║  ██║██╔══██╗████╗ ████║   ██╔══██╗██║
███████╗ ███████║█████╔╝ ███████╗███████║███████║██╔████╔██║   ███████║██║
╚════██║ ██╔══██║██╔═██╗ ╚════██║██╔══██║██╔══██║██║╚██╔╝██║   ██╔══██║██║
███████║ ██║  ██║██║  ██╗███████║██║  ██║██║  ██║██║ ╚═╝ ██║   ██║  ██║██║
╚══════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝  ╚═╝╚═╝
</pre>
  
  <h1>🚀 Saksham AI</h1>
  <p><strong>Learn, Build, and Connect in the AI Era</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor" />
  </p>
</div>

---

## 🌟 About The Project

**Saksham AI** is a next-generation social learning platform designed to bridge the gap between AI enthusiasts, developers, and learners. It features a TikTok-style endless video feed where users can share educational reels, attach resources (PDFs, PPTs), and interact with a vibrant community.

Built with performance and cross-platform compatibility in mind, Saksham AI runs beautifully on the web and seamlessly on Android via native Capacitor integration.

### ✨ Key Features

- **📱 Endless Video Feed:** Swipe through a highly optimized, auto-playing video feed (similar to TikTok/Instagram Reels).
- **🔐 Multi-Auth System:** Secure login using Email/Password or Native Google Sign-In.
- **📚 Resource Attachments:** Creators can attach PDFs, Word Docs, and PowerPoints directly to their video lessons.
- **💬 Community Interaction:** Real-time comments, likes, and post sharing powered by Firebase Realtime Database.
- **☁️ Cloud Storage:** Secure, lightning-fast video and document hosting via Cloudinary.
- **🤖 AI Mentor:** Built-in AI assistant to help users with coding, learning, and platform navigation.
- **📱 Native Android Ready:** Fully configured as an Android APK using Capacitor.

---

## 🏗️ Architecture

Saksham AI is built on a modern, serverless stack:

*   **Frontend:** React 19 + Vite for ultra-fast HMR and building.
*   **Styling:** Pure CSS with a custom Glassmorphism design system.
*   **Backend/Database:** Firebase Realtime Database for instantaneous state syncing.
*   **Authentication:** Firebase Auth + Google OAuth 2.0 (Web & Native).
*   **Media Storage:** Cloudinary API for direct-from-browser unsigned uploads.
*   **Mobile Container:** Ionic Capacitor for bridging the web app to native Android.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or higher)
*   npm
*   Android Studio (for building the APK)

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your-username/saksham-ai-clone.git
   ```
2. **Install NPM packages**
   ```sh
   npm install
   ```
   *(Note: If you encounter peer dependency errors with Capacitor plugins, use `npm install --legacy-peer-deps`)*

3. **Start the Development Server**
   ```sh
   npm run dev
   ```

### Building for Android

To compile the React app into a native Android APK:

1. Build the web assets:
   ```sh
   npm run build
   ```
2. Sync the assets to the Android project:
   ```sh
   npx cap sync
   ```
3. Open Android Studio, select `Build > Build Bundle(s) / APK(s) > Build APK(s)`, and locate your generated APK!

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <p>Built with ❤️ by the Saksham AI Team</p>
</div>
