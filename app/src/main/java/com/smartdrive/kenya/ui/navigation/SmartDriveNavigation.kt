package com.smartdrive.kenya.ui.navigation

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.smartdrive.kenya.ui.screens.auth.AuthScreen
import com.smartdrive.kenya.ui.screens.auth.AuthViewModel
import com.smartdrive.kenya.ui.screens.dashboard.DashboardScreen
import com.smartdrive.kenya.ui.screens.vehicles.VehiclesScreen
import com.smartdrive.kenya.ui.screens.austin.AustinHomeScreen
import com.smartdrive.kenya.ui.screens.austin.AustinBrowseCarsScreen
import com.smartdrive.kenya.ui.screens.austin.AustinCarDetailsScreen
import com.smartdrive.kenya.ui.screens.austin.AustinBookingsScreen
import com.smartdrive.kenya.ui.screens.austin.AustinProfileScreen
import com.smartdrive.kenya.ui.screens.austin.AustinBookingScreen

@Composable
fun SmartDriveNavigation(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController(),
    authViewModel: AuthViewModel = hiltViewModel()
) {
    val currentUser by authViewModel.currentUser.collectAsState()
    
    NavHost(
        navController = navController,
        startDestination = if (currentUser != null) "austin_home" else "auth",
        modifier = modifier.fillMaxSize()
    ) {
        composable("auth") {
            AuthScreen(
                onAuthSuccess = {
                    navController.navigate("austin_home") {
                        popUpTo("auth") { inclusive = true }
                    }
                }
            )
        }
        
        composable("dashboard") {
            DashboardScreen(
                onNavigateToVehicles = {
                    navController.navigate("vehicles")
                },
                onSignOut = {
                    authViewModel.signOut()
                    navController.navigate("auth") {
                        popUpTo("dashboard") { inclusive = true }
                    }
                }
            )
        }
        
        composable("vehicles") {
            VehiclesScreen(
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }
        
        // Austin UI Routes
        composable("austin_home") {
            AustinHomeScreen(
                onNavigateToBrowseCars = {
                    navController.navigate("austin_browse")
                },
                onNavigateToBookings = {
                    navController.navigate("austin_bookings")
                },
                onNavigateToProfile = {
                    navController.navigate("austin_profile")
                }
            )
        }
        
        composable("austin_browse") {
            AustinBrowseCarsScreen(
                onNavigateBack = {
                    navController.popBackStack()
                },
                onNavigateToCarDetails = { vehicleId ->
                    navController.navigate("austin_details/$vehicleId")
                },
                onNavigateToHome = {
                    navController.navigate("austin_home") {
                        popUpTo("austin_home") { inclusive = true }
                    }
                },
                onNavigateToBookings = {
                    navController.navigate("austin_bookings")
                },
                onNavigateToProfile = {
                    navController.navigate("austin_profile")
                }
            )
        }
        
        composable("austin_details/{vehicleId}") { backStackEntry ->
            val vehicleId = backStackEntry.arguments?.getString("vehicleId") ?: ""
            AustinCarDetailsScreen(
                vehicleId = vehicleId,
                onNavigateBack = {
                    navController.popBackStack()
                },
                onNavigateToBooking = { id ->
                    navController.navigate("austin_booking/$id")
                },
                onNavigateToHome = {
                    navController.navigate("austin_home") {
                        popUpTo("austin_home") { inclusive = true }
                    }
                },
                onNavigateToBrowse = {
                    navController.navigate("austin_browse") {
                        popUpTo("austin_browse") { inclusive = true }
                    }
                },
                onNavigateToBookings = {
                    navController.navigate("austin_bookings")
                },
                onNavigateToProfile = {
                    navController.navigate("austin_profile")
                }
            )
        }
        
        // Austin bookings screen
        composable("austin_bookings") {
            AustinBookingsScreen(
                onNavigateBack = {
                    navController.popBackStack()
                },
                onNavigateToHome = {
                    navController.navigate("austin_home") {
                        popUpTo("austin_home") { inclusive = true }
                    }
                },
                onNavigateToBrowse = {
                    navController.navigate("austin_browse") {
                        popUpTo("austin_browse") { inclusive = true }
                    }
                },
                onNavigateToProfile = {
                    navController.navigate("austin_profile")
                }
            )
        }
        
        // Austin profile screen
        composable("austin_profile") {
            AustinProfileScreen(
                onNavigateBack = {
                    navController.popBackStack()
                },
                onNavigateToHome = {
                    navController.navigate("austin_home") {
                        popUpTo("austin_home") { inclusive = true }
                    }
                },
                onNavigateToBrowse = {
                    navController.navigate("austin_browse") {
                        popUpTo("austin_browse") { inclusive = true }
                    }
                },
                onNavigateToBookings = {
                    navController.navigate("austin_bookings")
                },
                onSignOut = {
                    authViewModel.signOut()
                    navController.navigate("auth") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        // Austin booking form screen
        composable("austin_booking/{vehicleId}") { backStackEntry ->
            val vehicleId = backStackEntry.arguments?.getString("vehicleId") ?: ""
            AustinBookingScreen(
                vehicleId = vehicleId,
                onNavigateBack = {
                    navController.popBackStack()
                },
                onBookingSuccess = {
                    navController.navigate("austin_bookings") {
                        popUpTo("austin_home")
                    }
                }
            )
        }
    }
}