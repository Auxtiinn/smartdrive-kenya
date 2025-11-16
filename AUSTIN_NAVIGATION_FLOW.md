# Austin Android Navigation Flow

## Complete Navigation Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AUTH SCREEN                                  │
│                    (Login / Register)                                │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ Sign In Success
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AUSTIN HOME SCREEN                              │
│                   (Search Form + Categories)                         │
│                                                                       │
│  Bottom Nav: [HOME] [Browse] [Bookings] [Profile]                   │
└──────┬──────────────────────────┬─────────────┬─────────────────────┘
       │                          │             │
       │ "Search Cars"            │             │
       ▼                          │             │
┌─────────────────────────────────┐            │             │
│  AUSTIN BROWSE CARS SCREEN      │            │             │
│  (Vehicle List + Filters)       │            │             │
│                                  │            │             │
│  Bottom Nav: [Home] [BROWSE]    │            │             │
│              [Bookings] [Profile]│            │             │
└────────┬─────────────────────────┘            │             │
         │                                       │             │
         │ Click Vehicle Card                    │             │
         ▼                                       │             │
┌────────────────────────────────────────┐      │             │
│  AUSTIN CAR DETAILS SCREEN             │      │             │
│  (Gallery, Specs, Pricing)             │      │             │
│                                         │      │             │
│  Bottom Nav: [Home] [Browse]           │      │             │
│              [Bookings] [Profile]      │      │             │
└───────┬─────────────────────────────────┘     │             │
        │                                        │             │
        │ "Book Now"                             │             │
        ▼                                        │             │
┌────────────────────────────────────┐           │             │
│  AUSTIN BOOKING SCREEN     [NEW]   │           │             │
│  (Booking Form)                    │           │             │
│  - Pickup Date/Time/Location       │           │             │
│  - Return Date/Time/Location       │           │             │
│  - Insurance Selection             │           │             │
│  - Special Requests                │           │             │
│  - Price Summary                   │           │             │
└───────┬────────────────────────────┘           │             │
        │                                        │             │
        │ Submit Booking (Success)               │             │
        │                                        │             │
        │                  ┌─────────────────────┘             │
        │                  │                                   │
        │                  │ Bottom Nav → Bookings             │
        ▼                  ▼                                   │
┌──────────────────────────────────────────┐                  │
│  AUSTIN BOOKINGS SCREEN          [NEW]   │                  │
│  (List of User Bookings)                 │                  │
│  - Booking Cards with Details            │                  │
│  - Status Badges                         │                  │
│  - Cancel Functionality                  │                  │
│  - Empty State → Browse Cars             │                  │
│                                           │                  │
│  Bottom Nav: [Home] [Browse]             │                  │
│              [BOOKINGS] [Profile]        │                  │
└──────────────────────────────────────────┘                  │
                                                               │
                                      Bottom Nav → Profile     │
                                                               ▼
                                    ┌────────────────────────────────┐
                                    │  AUSTIN PROFILE SCREEN  [NEW]  │
                                    │  (User Info + Settings)        │
                                    │  - Profile Header              │
                                    │  - Account Settings            │
                                    │  - Support Menu                │
                                    │  - Sign Out                    │
                                    │                                │
                                    │  Bottom Nav: [Home] [Browse]   │
                                    │              [Bookings]        │
                                    │              [PROFILE]         │
                                    └────────┬───────────────────────┘
                                             │
                                             │ Sign Out
                                             ▼
                                    ┌───────────────────┐
                                    │   AUTH SCREEN     │
                                    └───────────────────┘
```

## Navigation Routes

| Screen | Route | Parameters | Access |
|--------|-------|------------|--------|
| **Auth** | `auth` | None | Entry point |
| **Austin Home** | `austin_home` | None | Post-login default |
| **Austin Browse** | `austin_browse` | None | From home, bottom nav |
| **Austin Car Details** | `austin_details/{vehicleId}` | vehicleId: String | From browse |
| **Austin Booking Form** | `austin_booking/{vehicleId}` | vehicleId: String | From car details |
| **Austin Bookings** | `austin_bookings` | None | Success redirect, bottom nav |
| **Austin Profile** | `austin_profile` | None | Bottom nav |

## Bottom Navigation State

Each Austin screen has a bottom navigation bar with 4 items:

| Icon | Label | Route | Screens Where Active |
|------|-------|-------|---------------------|
| 🏠 Home | Home | `austin_home` | Home screen |
| 🔍 Search | Browse | `austin_browse` | Browse screen |
| 📅 Calendar | Bookings | `austin_bookings` | Bookings screen |
| 👤 Person | Profile | `austin_profile` | Profile screen |

**Note:** Bottom nav is NOT shown on:
- Auth screen
- Booking form screen (has back button only)

## User Flow Examples

### Flow 1: New Booking
```
Home → Browse → Car Details → Booking Form → [Submit] → Bookings
  ↑                                                          │
  └──────────────── Bottom Nav ←───────────────────────────┘
```

### Flow 2: View Existing Bookings
```
Home → [Bottom Nav: Bookings] → Bookings Screen
  ↑                                    │
  └─────── Bottom Nav: Home ←─────────┘
```

### Flow 3: Profile Management
```
Home → [Bottom Nav: Profile] → Profile Screen → [Sign Out] → Auth
```

### Flow 4: Cancel Booking
```
Bookings Screen → [Cancel Button] → Confirmation Dialog → [Confirm] → Refresh List
```

## Back Navigation

| Screen | Back Action | Destination |
|--------|-------------|-------------|
| Auth | N/A | N/A (entry point) |
| Austin Home | N/A | N/A (root) |
| Austin Browse | Back button | Previous screen or Home |
| Austin Car Details | Back button | Browse |
| Austin Booking Form | Back button | Car Details |
| Austin Bookings | Back button | Previous screen |
| Austin Profile | Back button | Previous screen |

## State Management

### Auth State
- Managed by `AuthViewModel`
- On sign out: Clear state and navigate to `auth`
- On sign in: Load user profile and navigate to `austin_home`

### Bookings State
- Managed by `MyRentalsViewModel`
- Loads on screen entry via `LaunchedEffect`
- Refreshes after cancellation

### Vehicle State
- Managed by `VehiclesViewModel` (Browse)
- Managed by `BookingViewModel` (Details & Booking)
- Loads on screen entry

### Form State
- Local composable state with `remember { mutableStateOf() }`
- Validated before submission
- Cleared on success

## Navigation Animations

Default animations provided by Navigation Compose:
- **Enter:** Slide in from right + fade in
- **Exit:** Slide out to left + fade out
- **Pop Enter:** Slide in from left + fade in
- **Pop Exit:** Slide out to right + fade out

## Deep Linking Support

To add deep linking (future enhancement):

```kotlin
// Add to route definitions
composable(
    route = "austin_details/{vehicleId}",
    deepLinks = listOf(
        navDeepLink { uriPattern = "smartdrive://vehicle/{vehicleId}" }
    )
)
```

## Testing Navigation

### Test Cases:

1. ✅ **Auth to Home:** Sign in should navigate to home
2. ✅ **Home to Browse:** Search button navigates to browse
3. ✅ **Browse to Details:** Vehicle card click navigates with ID
4. ✅ **Details to Booking:** Book button navigates with vehicle ID
5. ✅ **Booking Success:** Form submission navigates to bookings
6. ✅ **Bottom Nav - Home:** Navigates to home from any screen
7. ✅ **Bottom Nav - Browse:** Navigates to browse from any screen
8. ✅ **Bottom Nav - Bookings:** Navigates to bookings from any screen
9. ✅ **Bottom Nav - Profile:** Navigates to profile from any screen
10. ✅ **Profile Sign Out:** Navigates to auth and clears state
11. ✅ **Back Navigation:** Back button works on all screens
12. ✅ **Empty Bookings CTA:** Browse button navigates to browse

---

## Implementation Status

| Component | Status |
|-----------|--------|
| Navigation Routes | ✅ Complete |
| Bottom Navigation | ✅ Complete |
| Back Navigation | ✅ Complete |
| State Management | ✅ Complete |
| Deep Linking | ⏸️ Future Enhancement |
| Analytics Tracking | ⏸️ Future Enhancement |

**All navigation flows are functional and tested!** 🎉
