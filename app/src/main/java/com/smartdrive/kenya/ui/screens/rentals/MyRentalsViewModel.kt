package com.smartdrive.kenya.ui.screens.rentals

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartdrive.kenya.data.model.RentalSummary
import com.smartdrive.kenya.data.repository.AuthRepository
import com.smartdrive.kenya.data.repository.RentalRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MyRentalsViewModel @Inject constructor(
    private val rentalRepository: RentalRepository,
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(MyRentalsUiState())
    val uiState: StateFlow<MyRentalsUiState> = _uiState.asStateFlow()
    
    fun loadUserRentals() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            try {
                val currentUser = authRepository.getCurrentUser()
                if (currentUser == null) {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = "User not authenticated"
                    )
                    return@launch
                }
                
                val result = rentalRepository.getUserRentals(currentUser.id)
                
                if (result.isSuccess) {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        rentals = result.getOrElse { emptyList() }
                    )
                } else {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = result.exceptionOrNull()?.message ?: "Failed to load rentals"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Unknown error occurred"
                )
            }
        }
    }
    
    fun cancelRental(rentalId: String, reason: String) {
        viewModelScope.launch {
            try {
                val result = rentalRepository.cancelRental(rentalId, reason)
                
                if (result.isSuccess) {
                    // Refresh the rentals list
                    loadUserRentals()
                } else {
                    _uiState.value = _uiState.value.copy(
                        error = result.exceptionOrNull()?.message ?: "Failed to cancel rental"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Unknown error occurred"
                )
            }
        }
    }
    
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

data class MyRentalsUiState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val rentals: List<RentalSummary> = emptyList()
)