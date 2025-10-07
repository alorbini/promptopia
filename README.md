# 📚 Promptopia

Promptopia is a bilingual (Arabic/English) mobile application designed to provide users with a curated collection of creative and technical prompts.  
It features a modern mobile UI, a powerful Filament admin panel, and a clean Laravel 12 API backend, all structured in a monorepo.

## 🖼️ Screenshots
(You can add screenshots of your app here.)
<!-- Example:
![Home Screen](screenshots/home.png)
![Prompt Modal](screenshots/modal.png)
-->

---

## ✨ Features

### 🧠 Backend (Laravel API & Filament CMS)
- ✅ **REST API**: A secure, read-only public API for fetching categories and prompts.  
- 🌐 **Bilingual Support**: Manage and serve all content in both English and Arabic.  
- 🛠️ **Filament Admin Panel**: A powerful CMS for managing all content with ease.  
- 🖼️ **Image Uploads**: Simple image uploading for prompt cover images.

### 📱 Frontend (Expo React Native)
- 🖤 **Modern UI**: A sleek, dark-themed, and professional mobile interface.  
- 🌐 **Bilingual & RTL Support**: Seamlessly switch between English and Arabic with RTL layout support.  
- 🔍 **Search Functionality**: Fast client-side search for categories.  
- 💬 **Interactive Modals**: Professional modal views for prompts with copy/share functionality.  
- 💰 **Monetization Ready**: Integrated with Google AdMob for full-screen interstitial ads.

---

## 🧰 Tech Stack

| Area          | Technology                                                            |
|---------------|-----------------------------------------------------------------------|
| **Backend**   | PHP 8.3+, Laravel 12, MySQL 8, Filament v3                             |
| **Frontend**  | Expo React Native, TypeScript, Zustand, React Native Paper, Expo Router v3 |

---

## 🗂️ Project Structure

This project uses a **monorepo** structure:

```
promptopia/
├── backend/    ← Laravel 11 API & Filament
└── frontend/   ← Expo React Native App
```

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

- PHP 8.3+
- Composer
- Node.js (LTS) + npm
- MySQL
- Android/iOS development environment

---

### 🖥️ 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies and set up the environment:

```bash
composer install
cp .env.example .env
php artisan key:generate
# Configure your .env file with database credentials
php artisan migrate --seed
php artisan storage:link
```

Run the Laravel development server:

```bash
php artisan serve --host=0.0.0.0
```

API will be available at:  
👉 `http://<your-computer-ip>:8000/api/v1`

---

### 📱 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `frontend` directory with the following:

```
EXPO_PUBLIC_API_BASE_URL=http://<your-computer-ip>:8000/api/v1
```

Start the Expo development server:

```bash
npx expo start --dev-client
```

---

## 🌍 Deployment

### Backend
- Deploy the backend to any PHP/MySQL compatible server (e.g., cPanel, VPS, Laravel Forge).  
- Run the following on the server:
```bash
php artisan migrate --seed
php artisan storage:link
```
- Update your `.env` file with production settings.

### Frontend
- Build the mobile app using Expo EAS:
```bash
eas build --platform android
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Developed by **Hasan Alorbini**  
🚀 Full-Stack Developer | Laravel ⚡ React Native

---

## ⭐ Contribute

If you like this project, give it a ⭐ on GitHub to support future development 🙌

