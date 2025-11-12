package com.smartdrive.kenya.ui.screens.booking

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartdrive.kenya.data.model.*
import com.smartdrive.kenya.data.repository.RentalRepository
import com.smartdrive.kenya.data.repository.VehicleRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.LocalTime
import java.time.temporal.ChronoUnit
import javax.inject.Inject

@HiltViewModel
class BookingViewModel @Inject constructor(
    private val rentalRepository: RentalRepository,
    private val vehicleRepository: VehicleRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(BookingUiState())
    val uiState: StateFlow<BookingUiState> = _uiState.asStateFlow()
    
    fun loadBookingData(vehicleId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            try {
                // Load vehicle details
                val vehicleResult = vehicleRepository.getVehicleById(vehicleId)
                if (vehicleResult.isFailure) {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = "Failed to load vehicle details"
                    )
                    return@launch
                }
                
                // Load rental locations
                val locationsResult = rentalRepository.getRentalLocations()
                val locations = locationsResult.getOrElse { emptyList() }
                
                // Load rental extras
                val extrasResult = rentalRepository.getRentalExtras()
                val extras = extrasResult.getOrElse { emptyList() }
                
                val vehicle = vehicleResult.getOrNull()
                val defaultPickupDate = LocalDate.now().plusDays(1)
                val defaultReturnDate = defaultPickupDate.plusDays(1)
                
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    selectedVehicle = vehicle,
                    locations = locations,
                    availableExtras = extras,
                    pickupDate = defaultPickupDate,
                    returnDate = defaultReturnDate,
                    pickupTime = LocalTime.of(9, 0),
                    returnTime = LocalTime.of(17, 0),
                    pickupLocationId = locations.firstOrNull()?.id,
                    returnLocationId = locations.firstOrNull()?.id,
                    dailyRate = vehicle?.pricePerDay ?: 0.0
                )
                
                // Calculate initial pricing
                calculatePricing()
                
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Unknown error occurred"
                )
            }
        }
    }
    
    fun updateDates(pickupDate: LocalDate, returnDate: LocalDate) {
        _uiState.value = _uiState.value.copy(
            pickupDate = pickupDate,
            returnDate = returnDate
        )
        calculatePricing()
    }
    
    fun updateTimes(pickupTime: LocalTime, returnTime: LocalTime) {
        _uiState.value = _uiState.value.copy(
            pickupTime = pickupTime,
            returnTime = returnTime
        )
    }
    
    fun updateLocations(pickupLocationId: String, returnLocationId: String) {
        _uiState.value = _uiState.value.copy(
            pickupLocationId = pickupLocationId,
            returnLocationId = returnLocationId
        )
    }
    
    fun updateInsurance(insuranceType: InsuranceType) {
        _uiState.value = _uiState.value.copy(insuranceType = insuranceType)
        calculatePricing()
    }
    
    fun toggleExtra(extra: RentalExtra, isSelected: Boolean) {
        val currentExtras = _uiState.value.selectedExtras.toMutableSet()
        if (isSelected) {
            currentExtras.add(extra.id)
        } else {
            currentExtras.remove(extra.id)
        }
        _uiState.value = _uiState.value.copy(selectedExtras = currentExtras)
        calculatePricing()
    }
    
    fun updateSpecialRequests(requests: String) {
        _uiState.value = _uiState.value.copy(specialRequests = requests)
    }
    
    private fun calculatePricing() {
        val state = _uiState.value
        val vehicle = state.selectedVehicle ?: return
        
        val pickupDate = state.pickupDate ?: return
        val returnDate = state.returnDate ?: return
        
        if (returnDate.isBefore(pickupDate)) return
        
        val totalDays = ChronoUnit.DAYS.between(pickupDate, returnDate).toInt().let { 
            if (it == 0) 1 else it 
        }
        
        val dailyRate = vehicle.pricePerDay
        val insuranceCost = calculateInsuranceCost(dailyRate, state.insuranceType, totalDays)
        val extrasCost = calculateExtrasCost(state.selectedExtras, state.availableExtras, totalDays)
        
        val subtotal = (dailyRate * totalDays) + insuranceCost + extrasCost
        val taxAmount = subtotal * 0.16 // 16% VAT
        val totalAmount = subtotal + taxAmount
        val depositAmount = totalAmount * 0.30 // 30% deposit
        
        _uiState.value = state.copy(
            totalDays = totalDays,
            dailyRate = dailyRate,
            insuranceCost = insuranceCost,
            extrasCost = extrasCost,
            subtotal = subtotal,
            taxAmount = taxAmount,
            totalAmount = totalAmount,
            depositAmount = depositAmount,
            isValidForBooking = validateBookingData(state.copy(totalDays = totalDays))
        )
    }
    
    private fun calculateInsuranceCost(
        dailyRate: Double, 
        insuranceType: InsuranceType, 
        totalDays: Int
    ): Double {
        return dailyRate * (insuranceType.coveragePercent / 100.0) * totalDays
    }
    
    private fun calculateExtrasCost(
        selectedExtraIds: Set<String>,
        availableExtras: List<RentalExtra>,
        totalDays: Int
    ): Double {
        return selectedExtraIds.sumOf { extraId: String ->
            val extra = availableExtras.find { extra: RentalExtra -> extra.id == extraId }
            (extra?.dailyRate ?: 0.0) * totalDays
        }
    }
    
    private fun validateBookingData(state: BookingUiState): Boolean {
        return state.selectedVehicle != null &&
                state.pickupDate != null &&
                state.returnDate != null &&
                state.pickupLocationId != null &&
                state.returnLocationId != null &&
                state.totalDays > 0
    }
    
    fun createBooking(onSuccess: (String) -> Unit) {
        val state = _uiState.value
        if (!state.isValidForBooking) return
        
        viewModelScope.launch {
            _uiState.value = state.copy(isCreatingBooking = true, error = null)
            
            try {
                // Create rental extras selections
                val extraSelections = state.selectedExtras.mapNotNull { extraId: String ->
                    val extra = state.availableExtras.find { extra: RentalExtra -> extra.id == extraId }
                    extra?.let {
                        RentalExtraSelection(
                            id = "", // Will be generated
                            rentalId = "", // Will be set after rental creation
                            rentalExtraId = extra.id,
                            quantity = 1,
                            dailyRate = extra.dailyRate,
                            totalCost = extra.dailyRate * state.totalDays
                        )
                    }
                }
                
                val rentalRequest = RentalRequest(
                    vehicleId = state.selectedVehicle!!.id,
                    pickupLocationId = state.pickupLocationId!!,
                    returnLocationId = state.returnLocationId!!,
                    pickupDate = state.pickupDate!!,
                    pickupTime = state.pickupTime ?: LocalTime.of(9, 0),
                    returnDate = state.returnDate!!,
                    returnTime = state.returnTime ?: LocalTime.of(17, 0),
                    insuranceType = state.insuranceType,
                    selectedExtras = extraSelections,
                    specialRequests = state.specialRequests.takeIf { it.isNotBlank() }
                )
                
                val result = rentalRepository.createRental(rentalRequest)
                
                if (result.isSuccess) {
                    val rental = result.getOrNull()!!
                    onSuccess(rental.id)
                } else {
                    _uiState.value = state.copy(
                        isCreatingBooking = false,
                        error = result.exceptionOrNull()?.message ?: "Failed to create booking"
                    )
                }
                
            } catch (e: Exception) {
                _uiState.value = state.copy(
                    isCreatingBooking = false,
                    error = e.message ?: "Unknown error occurred"
                )
            }
        }
    }
}

data class BookingUiState(
    val isLoading: Boolean = false,
    val isCreatingBooking: Boolean = false,
    val error: String? = null,
    
    // Vehicle and rental data
    val selectedVehicle: Vehicle? = null,
    val locations: List<RentalLocation> = emptyList(),
    val availableExtras: List<RentalExtra> = emptyList(),
    
    // Booking details
    val pickupDate: LocalDate? = null,
    val returnDate: LocalDate? = null,
    val pickupTime: LocalTime? = null,
    val returnTime: LocalTime? = null,
    val pickupLocationId: String? = null,
    val returnLocationId: String? = null,
    val insuranceType: InsuranceType = InsuranceType.BASIC,
    val selectedExtras: Set<String> = emptySet(),
    val specialRequests: String = "",
    
    // Pricing calculations
    val totalDays: Int = 1,
    val dailyRate: Double = 0.0,
    val insuranceCost: Double = 0.0,
    val extrasCost: Double = 0.0,
    val subtotal: Double = 0.0,
    val taxAmount: Double = 0.0,
    val totalAmount: Double = 0.0,
    val depositAmount: Double = 0.0,
    
    // Validation
    val isValidForBooking: Boolean = false
)