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

@Composable
fun SmartDriveNavigation(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController(),
    authViewModel: AuthViewModel = hiltViewModel()
) {
    val currentUser by authViewModel.currentUser.collectAsState()
    
    NavHost(
        navController = navController,
        startDestination = if (currentUser != null) "dashboard" else "auth",
        modifier = modifier.fillMaxSize()
    ) {
        composable("auth") {
            AuthScreen(
                onAuthSuccess = {
                    navController.navigate("dashboard") {
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
    }
}