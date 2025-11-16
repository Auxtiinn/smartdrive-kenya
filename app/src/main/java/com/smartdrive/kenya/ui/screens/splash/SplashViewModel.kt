package com.smartdrive.kenya.ui.screens.splash

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SplashViewModel @Inject constructor() : ViewModel() {
    
    private val _isLoading = mutableStateOf(true)
    val isLoading = _isLoading
    
    init {
        viewModelScope.launch {
            // Simulate app initialization
            delay(2000) // 2 seconds splash
            _isLoading.value = false
        }
    }
}