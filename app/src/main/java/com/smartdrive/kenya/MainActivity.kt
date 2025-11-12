package com.smartdrive.kenya

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import com.smartdrive.kenya.ui.navigation.SmartDriveNavigation
import com.smartdrive.kenya.ui.screens.splash.SplashScreen
import com.smartdrive.kenya.ui.screens.splash.SplashViewModel
import com.smartdrive.kenya.ui.theme.SmartDriveKenyaTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SmartDriveKenyaTheme {
                val splashViewModel: SplashViewModel = hiltViewModel()
                
                if (splashViewModel.isLoading.value) {
                    SplashScreen()
                } else {
                    Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                        SmartDriveNavigation(
                            modifier = Modifier.padding(innerPadding)
                        )
                    }
                }
            }
        }
    }
}