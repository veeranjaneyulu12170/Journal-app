
# 📔 Daily Bloom

A clean and intuitive journaling app built using React Native with Expo. Designed with usability and minimalism in mind, it lets users create, view, and reflect on daily entries. It also offers **AI-generated inspirations** and visual **insights** based on journal content.

---

## 🚀 Features

### ✅ Core Functionality
- Home (Journal Entry):Create daily entries with a simple text box and save button.
- History:Browse past journal entries by date using a calendar view.
- Insights: See emotional trends and patterns visualized from your entries using free AI tools.
- Profile: View and edit user profile information including name, bio, and daily quote.

### 🧠 Powered by AI
- Use free AI tools (like OpenAI or Hugging Face APIs) to:
  - Generate emotional insights from journal text.
  - Suggest motivational quotes and daily inspirations.

---

## 🧩 Technologies Used

- React Native via Expo SDK
- TypeScript for type safety
- expo-router for navigation
- Tailwind CSS (via NativeWind) or styled Components styling
- React Native Calendars for calendar view
- AsyncStorage for local data persistence

---

## 📁 Folder Structure

```
/JournalApp
├── app/
│   ├── _layout.tsx         # Tab navigation with expo-router
│   ├── index.tsx           # Home Screen (journal entry)
│   ├── history.tsx         # Calendar & past entries
│   ├── insights.tsx        # Emotional insights & charts
│   ├── profile.tsx         # User profile edit
├── components/             # Reusable UI components
├── utils/                  # Storage, analysis, AI utils
├── assets/                 # Fonts, icons, images
├── app.json                # Expo config
├── package.json
└── README.md
```

---

## 🔄 How to Run

### 1. Clone the repository
```bash
git clone https://github.com/your-username/journal-app.git
cd journal-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npx expo start
```

> Make sure Expo CLI is installed (`npm install -g expo-cli`) if using `expo start`.

---

## 📦 EAS Build (iOS & Android)

To build the app:
```bash
npx eas build --platform android
npx eas build --platform ios
```

---

## 📌 To-Do

- [ ] Add image/audio note support
- [ ] Push notifications for daily journaling reminder
- [ ] Secure notes with biometric lock
- [ ] Sync entries with cloud storage

---

## 🧑‍🎨 UX Principles Applied

This app adheres to **Jakob Nielsen’s 10 Usability Heuristics**:
- Visibility of system status
- Match between system and the real world
- User control and freedom
- Consistency and standards
- Error prevention
- Recognition over recall
- Flexibility and efficiency of use
- Aesthetic and minimalist design
- Help users recognize, diagnose, and recover from errors
- Help and documentation

![image](https://github.com/user-attachments/assets/22e47c02-d151-4a17-b8b4-94835021623e)
![image](https://github.com/user-attachments/assets/898d0afa-18d2-40bb-a23c-861a85a2f9b8)
![image](https://github.com/user-attachments/assets/a8571bb1-23ed-475f-8fc3-c2b9664a4f5c)



