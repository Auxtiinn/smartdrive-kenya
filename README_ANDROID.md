# Smart Drive Kenya - Android App

This is the Android version of Smart Drive Kenya, converted from the original React/TypeScript web application.

## 🚀 Features

- **Native Android Experience**: Built with Jetpack Compose for modern UI
- **Role-based Access**: Support for Admin, Agent, and Customer roles
- **Vehicle Management**: Browse and book vehicles
- **Real-time Updates**: Using Supabase for live data
- **Material Design 3**: Modern Android design system
- **Offline Support**: Local caching with Room database (planned)

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **UI Framework** | Jetpack Compose |
| **Architecture** | MVVM + Clean Architecture |
| **Dependency Injection** | Hilt |
| **Backend** | Supabase (same as web version) |
| **Navigation** | Navigation Compose |
| **Image Loading** | Coil |
| **Networking** | Retrofit + OkHttp |
| **State Management** | StateFlow + Compose State |

## 📱 Setup Instructions

### Prerequisites
- Android Studio Iguana (2023.2.1) or later
- JDK 11 or later
- Android SDK API 35
- Minimum SDK: API 24 (Android 7.0)

### Installation Steps

1. **Clone the repository** (if starting fresh):
```bash
git clone <your-repo-url>
cd smartdrive-android
```

2. **Open in Android Studio**:
   - Open Android Studio
   - Select "Open an Existing Project"
   - Navigate to the `smartdrive-android` folder
   - Click "Open"

3. **Sync Project**:
   - Android Studio will automatically prompt to sync
   - Click "Sync Now" or use `File > Sync Project with Gradle Files`

4. **Configure Supabase** (already configured):
   - The Supabase URL and API key are already set in `SupabaseClient.kt`
   - Uses the same backend as your React app

5. **Run the App**:
   - Connect an Android device or start an emulator
   - Click the "Run" button or press `Ctrl+R` (Windows/Linux) or `Cmd+R` (Mac)

## 📦 Project Structure

```
app/src/main/java/com/smartdrive/kenya/
├── MainActivity.kt                 # Entry point
├── SmartDriveApplication.kt       # Application class
├── data/                          # Data layer
│   ├── model/                     # Data models
│   ├── network/                   # Network clients
│   └── repository/                # Data repositories
├── di/                           # Dependency injection
├── ui/                           # UI layer
│   ├── navigation/               # Navigation logic
│   ├── screens/                  # UI screens
│   │   ├── auth/                # Authentication
│   │   ├── dashboard/           # Dashboard
│   │   ├── vehicles/            # Vehicle management
│   │   └── splash/              # Splash screen
│   └── theme/                   # Material Design theme
```

## 🔄 Migration from React

### Key Conversions

| React/TypeScript | Android/Kotlin |
|------------------|----------------|
| `useState` + `useEffect` | `StateFlow` + `ViewModel` |
| React components | `@Composable` functions |
| Context providers | Hilt dependency injection |
| React Router | Navigation Compose |
| Supabase JS client | Supabase Kotlin client |
| Tailwind CSS | Material Design 3 |

### Preserved Features

✅ **Authentication**: Same Supabase auth flow  
✅ **User Roles**: Admin, Agent, Customer permissions  
✅ **Vehicle Management**: Browse, book, manage vehicles  
✅ **Real-time Data**: Supabase subscriptions  
✅ **Data Models**: Converted TypeScript types to Kotlin data classes  

## 🚧 Development Status

### ✅ Completed
- [x] Project setup with Gradle
- [x] Authentication system
- [x] Navigation structure
- [x] Dashboard screens (role-based)
- [x] Vehicle browsing
- [x] Supabase integration
- [x] Material Design 3 theming

### 🔄 In Progress
- [ ] Vehicle booking flow
- [ ] Profile management
- [ ] Admin panels
- [ ] Agent tools
- [ ] Image upload functionality

### 📋 Planned Features
- [ ] Push notifications
- [ ] Offline support with Room
- [ ] Maps integration for pickup/dropoff
- [ ] Payment integration (M-Pesa)
- [ ] Vehicle tracking
- [ ] Dark theme support

## 🧪 Testing

Run tests using:
```bash
# Unit tests
./gradlew test

# UI tests
./gradlew connectedAndroidTest
```

## 📱 Build Types

- **Debug**: Development build with logging enabled
- **Release**: Production build with ProGuard enabled

Generate release APK:
```bash
./gradlew assembleRelease
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use proper Kotlin naming conventions
3. Write unit tests for ViewModels and repositories
4. Follow Material Design guidelines for UI
5. Use Hilt for dependency injection

## 📄 License

Same as the original React project.

---

## 🔧 Troubleshooting

### Common Issues

1. **Gradle sync fails**:
   - Check your internet connection
   - Try `File > Invalidate Caches and Restart`

2. **Supabase connection issues**:
   - Verify the URL and API key in `SupabaseClient.kt`
   - Check your network permissions in `AndroidManifest.xml`

3. **Build errors**:
   - Ensure you're using the correct JDK version
   - Clean and rebuild: `Build > Clean Project` then `Build > Rebuild Project`

### Performance Tips

- Use `LazyColumn` for long lists
- Implement proper state management with ViewModels
- Use `remember` for expensive computations in Compose
- Load images efficiently with Coil

---

**Ready to run in Android Studio!** 🚀

This Android app provides the same functionality as your React web app but optimized for mobile devices with native Android performance and user experience.