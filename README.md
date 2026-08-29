# QR Code Scanner App

## 1. Project Title & Description

**QR Code Scanner** is a mobile application built with React Native (Expo) that allows users to scan QR codes using their device camera, generate their own QR codes, and manage a history of scanned/generated codes. The app provides a clean, user‑friendly interface with theme support, local persistence, and useful settings to enhance the scanning experience.

The app runs on **Expo Go** using **SDK 54** and has been tested on **Android** devices.

---

## 2. Installation & Run Instructions

### Prerequisites
- Node.js and npm installed on your machine.
- Expo Go app installed on your Android device (available on Google Play Store).
- The device and development machine must be on the same Wi‑Fi network.

### Steps

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/QRCodeScannerApp.git
   cd QRCodeScannerApp
   ```

2. **Install dependencies**  
   All required packages are listed in `package.json`. Run:
   ```bash
   npm install
   ```

3. **Start the development server**  
   ```bash
   npx expo start
   ```

4. **Run on your Android device**  
   Scan the QR code shown in the terminal with the Expo Go app. The app will load and display a loading screen for at least 5 seconds before the main interface appears.

> **Note**: This app is tested only on Android. iOS compatibility is not guaranteed.

---

## 3. Feature List (with short explanations)

- **QR Code Scanning** – Uses the device camera to detect and decode QR codes in real time. A scan overlay with blue corner brackets guides the user.
- **Manual Flashlight** – Toggle the camera torch on/off directly from the scanner screen.
- **Scan Cooldown** – A 5‑second cooldown prevents duplicate scans of the same code.
- **Scan Confirmation Modal** – After scanning, a popup shows the decoded data, its type (URL, phone, text, etc.), and a **Copy** button. This popup can be disabled in Settings.
- **History** – All scanned and generated codes are saved locally with timestamps. Users can filter by **All**, **Scanned**, or **Generated** and clear the entire history.
- **History Detail** – Tap any history item to view its full information, **copy** the data, **edit** it, **delete** it, or **share** the QR code as an image.
- **QR Generator** – Generate QR codes for four types:
  - **Text** – plain text or notes.
  - **Phone** – creates a `contact:` QR that can dial a number.
  - **Geo** – creates a `location:` QR with latitude, longitude, and optional label (label appears on a new line).
  - **URL** – creates a web link QR.
- **Settings** – Configure:
  - **Vibration on Scan** – enable/disable haptic feedback.
  - **Auto‑save to History** – automatically store scanned codes.
  - **Auto‑open URLs** – immediately open detected URLs in the browser.
  - **Scan Confirmation Popup** – show/hide the modal after scanning.
  - **Theme** – choose between **Light**, **Dark**, or **Auto** (based on time of day).
- **Dark Mode** – Supports dynamic light/dark themes with constant blue navigation bars (`#396491`).
- **Persistence** – All history and settings are saved locally using AsyncStorage, so they survive app restarts.
- **Loading Screen** – A polished startup screen with a large QR icon and spinner, displayed for a minimum of 5 seconds.

---

## 4. Screenshots

> **Note**: Replace the file names below with your actual screenshot files placed in the `screenshots/` directory.

### Scanner Screen
![Scanner Screen](screenshots/scanner.png)

### Scan Result Modal
![Scan Modal](screenshots/modal.png)

### History Screen
![History Screen](screenshots/history.png)

### History Detail Screen
![History Detail](screenshots/history-detail.png)

### QR Generator Screen
![Generator Screen](screenshots/generator.png)

### Settings Screen
![Settings Screen](screenshots/settings.png)

### Loading Screen
![Loading Screen](screenshots/loading.png)

---

## 5. Technologies Used

- **React Native** – core framework for building the mobile app.
- **Expo SDK 54** – provides camera, clipboard, sharing, and other native APIs.
- **React Navigation** – bottom tabs and native stack for screen navigation.
- **React Context API** – global state management.
- **AsyncStorage** – local persistence for history and settings.
- **expo-camera** – camera access and barcode scanning.
- **expo-clipboard** – copy to clipboard.
- **expo-sharing** – share QR images.
- **react-native-qrcode-svg** – render QR codes as SVG.
- **react-native-svg** – SVG support for QR rendering.
- **react-native-view-shot** – capture QR code view for sharing.
- **@expo/vector-icons** – icons for UI elements.

---

## 6. Known Issues or Future Improvements

### Known Issues
- **iOS Compatibility** – The app has not been tested on iOS devices; some modules (e.g., flashlight) may behave differently.
- **Beep Sound** – The beep option was removed; only vibration is available. Could be re‑added using `expo‑av`.
- **Auto Flashlight** – An automatic flashlight mode based on ambient light was removed due to complexity; manual toggle remains.
- **Save to Gallery** – Direct saving to the gallery was removed because of permission limitations in Expo Go; users can use the Share button to save via the share sheet.

### Future Improvements
- Add deep linking to open scanned content directly (e.g., maps for geo, dialer for phone).
- Export history as CSV or backup/restore.
- Multi‑language support.
- Onboarding tutorial for first‑time users.
- Improved accessibility and support for larger font sizes.

---

## 7. Reflection (Process Summary)

Throughout this project, I aimed to create a practical QR scanner that goes beyond a simple reader. I focused on user experience by adding a clear scan overlay, a confirmation modal with copy functionality, and a robust history management system. The development process highlighted the importance of careful state management—using React Context allowed me to share data across screens seamlessly while keeping the code organised. Implementing persistence with AsyncStorage was straightforward but required attention to when data is loaded and saved. I also learned to handle native permissions (camera) gracefully and to adapt the UI for dark mode. The decision to use bottom tabs instead of a drawer was made for better compatibility with Expo Go and a more intuitive navigation pattern. Overall, the app meets all core requirements and demonstrates a solid understanding of mobile development principles.

---

**Thank you for reviewing my project!**
