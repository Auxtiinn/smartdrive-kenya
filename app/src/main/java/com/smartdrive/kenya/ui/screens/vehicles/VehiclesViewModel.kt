package com.smartdrive.kenya.ui.screens.vehicles

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartdrive.kenya.data.model.Vehicle
import com.smartdrive.kenya.data.repository.VehicleRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class VehiclesViewModel @Inject constructor(
    private val vehicleRepository: VehicleRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(VehiclesUiState())
    val uiState: StateFlow<VehiclesUiState> = _uiState.asStateFlow()
    
    fun loadVehicles() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            
            vehicleRepository.getAvailableVehicles().fold(
                onSuccess = { vehicles ->
                    _uiState.value = _uiState.value.copy(
                        loading = false,
                        vehicles = vehicles
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        loading = false,
                        error = error.message ?: "Failed to load vehicles"
                    )
                }
            )
        }
    }
}

data class VehiclesUiState(
    val loading: Boolean = false,
    val vehicles: List<Vehicle> = emptyList(),
    val error: String? = null
)