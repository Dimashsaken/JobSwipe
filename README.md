# JobSwipe Mobile App

JobSwipe is a Tinder-style job searching application built with React Native and Expo. The app allows users to swipe right to apply for jobs or left to pass on them, making job searching quick and intuitive.

## Features

- **Swipe Interface**: Familiar gesture-based interaction for job discovery
- **Job Details**: Tap on cards to see full job descriptions and requirements
- **Profile Management**: Create and manage your professional profile
- **Application Tracking**: Monitor the status of your job applications
- **Saved Jobs**: Save interesting job listings for later review

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development toolchain for React Native
- **React Navigation**: Screen navigation
- **React Native Gesture Handler**: Touch and gesture system
- **React Native Reanimated**: Animation library
- **React Native Paper**: Material Design components

## Getting Started

### Prerequisites

- Node.js (v12 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator or physical device with Expo Go app

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/jobswipe.git
cd jobswipe
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open the app on your device:
   - Scan the QR code with the Expo Go app (Android) or the Camera app (iOS)
   - Press 'i' for iOS simulator or 'a' for Android emulator

## Project Structure

```
jobswipe/
├── app/
│   ├── assets/           # Images, fonts, etc.
│   │   ├── components/       # Reusable components
│   │   │   ├── cards/        # Job card components
│   │   │   ├── forms/        # Form components
│   │   │   ├── profile/      # Profile-related components
│   │   │   └── ui/           # UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── navigation/       # Navigation configuration
│   │   ├── screens/          # App screens
│   │   ├── services/         # API services
│   │   ├── store/            # State management
│   │   └── utils/            # Helper functions
│   └── docs/                 # Documentation
```

## Future Enhancements

- **Backend Integration**: Connect to job listing APIs and user data storage
- **AI Integration**: Auto-filling job applications from user profile
- **Notifications**: Job alerts and application updates
- **Messaging**: In-app communication with employers
- **Interview Scheduling**: Calendar integration for interviews

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 