# EatWell - Personalized Meal Planning App

A full-featured meal planning mobile app built with **Ionic Angular** and **Capacitor**, with **Firebase** authentication and hosting.

## Features

- **Google Sign-In** via Firebase Authentication
- **3-step Onboarding** with slide navigation
- **6-step Profile Setup** (physical profile, diet, cuisine, food preferences, review)
- **Dashboard** with daily meals, calorie tracking, macros
- **Meal Swap** with cuisine-based and quick recipe options
- **Recipe Browser** with full ingredients and step-by-step instructions
- **Weekly Meal Planner** with 7-day schedule and PDF export
- **Grocery List** with category filters, progress tracking, and export
- **Profile Settings** with editable preferences and plan regeneration
- **Dark Mode** toggle with persistent preference
- **Meal Reminder Notifications** at breakfast, lunch, snack, and dinner times
- **Camera Food Scanner** to detect food and suggest healthier swaps

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Ionic 7 | UI Framework |
| Angular 17 | Frontend Framework |
| Capacitor 7 | Native Mobile Bridge |
| Firebase Auth | Google Sign-In |
| Firebase Hosting | Web Deployment |
| Android Studio | Android Build |

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production - stable releases |
| `dev` | Development - active feature work |
| `qas` | QA & Testing |
| `backup` | Safe backup copy |

## Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Ionic CLI** (`npm install -g @ionic/cli`)
- **Android Studio** (for Android builds)
- **Java JDK 21** (bundled with Android Studio)

## Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:Futurxai/EatWell4U.git
cd EatWell4U
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add Firebase config
Create `android/app/google-services.json` with your Firebase project config.

### 4. Run in browser
```bash
ionic serve
```

### 5. Build for Android
```bash
ionic build --prod
npx cap sync android
npx cap open android
```

### 6. Generate signed APK
```bash
# Set JAVA_HOME to Android Studio JBR
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr

# Build release APK
cd android
./gradlew assembleRelease
```
The signed APK will be at `android/app/build/outputs/apk/release/`

### 7. Deploy to Firebase Hosting
```bash
ionic build --prod
firebase deploy --only hosting
```

## Live Demo

**Web:** https://eatwell-5eaf0.web.app

## Project Structure

```
src/
  app/
    pages/
      login/           # Login with Google Auth
      onboarding/      # 3-slide intro
      profile-setup/   # 6-step wizard
      dashboard/       # Daily meals & calories
      weekly/          # 7-day meal planner
      grocery/         # Shopping list
      profile/         # Settings & preferences
    services/
      state.ts         # Global state management
      meal-data.ts     # Meal database & recipes
      grocery.ts       # Grocery categorization
      auth.ts          # Firebase Google Auth
      notification.ts  # Meal reminders
    tabs/              # Bottom tab navigation
  environments/        # Firebase config
  global.scss          # Theme & dark mode
android/               # Capacitor Android project
```

## License

Private - Futurxai
