package com.smartdrive.kenya.ui.screens.austin

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.smartdrive.kenya.data.model.InsuranceType
import com.smartdrive.kenya.data.model.Vehicle
import com.smartdrive.kenya.ui.screens.booking.BookingViewModel
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AustinBookingScreen(
    vehicleId: String,
    onNavigateBack: () -> Unit,
    onBookingSuccess: () -> Unit,
    viewModel: BookingViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    var pickupDateStr by remember { mutableStateOf("") }
    var pickupTimeStr by remember { mutableStateOf("") }
    var returnDateStr by remember { mutableStateOf("") }
    var returnTimeStr by remember { mutableStateOf("") }
    var pickupLocation by remember { mutableStateOf("") }
    var dropoffLocation by remember { mutableStateOf("") }
    var selectedInsurance by remember { mutableStateOf(InsuranceType.BASIC) }
    var specialRequests by remember { mutableStateOf("") }

    LaunchedEffect(vehicleId) {
        viewModel.loadBookingData(vehicleId)
    }
    
    // Update local state when ViewModel state changes
    LaunchedEffect(uiState.pickupDate) {
        uiState.pickupDate?.let {
            pickupDateStr = it.toString()
        }
    }
    
    LaunchedEffect(uiState.returnDate) {
        uiState.returnDate?.let {
            returnDateStr = it.toString()
        }
    }
    
    LaunchedEffect(uiState.pickupTime) {
        uiState.pickupTime?.let {
            pickupTimeStr = it.toString()
        }
    }
    
    LaunchedEffect(uiState.returnTime) {
        uiState.returnTime?.let {
            returnTimeStr = it.toString()
        }
    }
    
    LaunchedEffect(uiState.pickupLocationId) {
        uiState.pickupLocationId?.let { locationId ->
            uiState.locations.find { it.id == locationId }?.let {
                pickupLocation = it.name
            }
        }
    }
    
    LaunchedEffect(uiState.returnLocationId) {
        uiState.returnLocationId?.let { locationId ->
            uiState.locations.find { it.id == locationId }?.let {
                dropoffLocation = it.name
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "Book Vehicle",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when {
                uiState.isLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                uiState.error != null -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            Icons.Default.ErrorOutline,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = uiState.error ?: "An error occurred",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.error
                        )
                    }
                }
                uiState.selectedVehicle != null -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                    ) {
                        // Vehicle Summary Card
                        VehicleSummaryCard(vehicle = uiState.selectedVehicle!!)

                        // Pickup Date & Time
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Text(
                                    text = "Pickup Details",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                
                                OutlinedTextField(
                                    value = pickupDateStr,
                                    onValueChange = { newValue ->
                                        pickupDateStr = newValue
                                        try {
                                            val date = LocalDate.parse(newValue)
                                            viewModel.updateDates(date, uiState.returnDate ?: date.plusDays(1))
                                        } catch (e: Exception) {
                                            // Invalid date format
                                        }
                                    },
                                    label = { Text("Pickup Date") },
                                    placeholder = { Text("YYYY-MM-DD") },
                                    leadingIcon = {
                                        Icon(Icons.Default.CalendarMonth, contentDescription = null)
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp)
                                )
                                
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                OutlinedTextField(
                                    value = pickupTimeStr,
                                    onValueChange = { newValue ->
                                        pickupTimeStr = newValue
                                        try {
                                            val time = LocalTime.parse(newValue)
                                            viewModel.updateTimes(time, uiState.returnTime ?: LocalTime.of(17, 0))
                                        } catch (e: Exception) {
                                            // Invalid time format
                                        }
                                    },
                                    label = { Text("Pickup Time") },
                                    placeholder = { Text("HH:MM") },
                                    leadingIcon = {
                                        Icon(Icons.Default.AccessTime, contentDescription = null)
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp)
                                )
                                
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                OutlinedTextField(
                                    value = pickupLocation,
                                    onValueChange = { newValue ->
                                        pickupLocation = newValue
                                        // Find location by name and update
                                        uiState.locations.find { it.name == newValue }?.let { location ->
                                            viewModel.updateLocations(
                                                location.id,
                                                uiState.returnLocationId ?: location.id
                                            )
                                        }
                                    },
                                    label = { Text("Pickup Location") },
                                    placeholder = { Text("Enter pickup location") },
                                    leadingIcon = {
                                        Icon(Icons.Default.LocationOn, contentDescription = null)
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp)
                                )
                            }
                        }

                        // Return Date & Time
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Text(
                                    text = "Return Details",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                
                                OutlinedTextField(
                                    value = returnDateStr,
                                    onValueChange = { newValue ->
                                        returnDateStr = newValue
                                        try {
                                            val date = LocalDate.parse(newValue)
                                            viewModel.updateDates(uiState.pickupDate ?: LocalDate.now(), date)
                                        } catch (e: Exception) {
                                            // Invalid date format
                                        }
                                    },
                                    label = { Text("Return Date") },
                                    placeholder = { Text("YYYY-MM-DD") },
                                    leadingIcon = {
                                        Icon(Icons.Default.CalendarMonth, contentDescription = null)
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp)
                                )
                                
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                OutlinedTextField(
                                    value = returnTimeStr,
                                    onValueChange = { newValue ->
                                        returnTimeStr = newValue
                                        try {
                                            val time = LocalTime.parse(newValue)
                                            viewModel.updateTimes(uiState.pickupTime ?: LocalTime.of(9, 0), time)
                                        } catch (e: Exception) {
                                            // Invalid time format
                                        }
                                    },
                                    label = { Text("Return Time") },
                                    placeholder = { Text("HH:MM") },
                                    leadingIcon = {
                                        Icon(Icons.Default.AccessTime, contentDescription = null)
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp)
                                )
                                
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                OutlinedTextField(
                                    value = dropoffLocation,
                                    onValueChange = { newValue ->
                                        dropoffLocation = newValue
                                        // Find location by name and update
                                        uiState.locations.find { it.name == newValue }?.let { location ->
                                            viewModel.updateLocations(
                                                uiState.pickupLocationId ?: location.id,
                                                location.id
                                            )
                                        }
                                    },
                                    label = { Text("Dropoff Location") },
                                    placeholder = { Text("Enter dropoff location") },
                                    leadingIcon = {
                                        Icon(Icons.Default.LocationOn, contentDescription = null)
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp)
                                )
                            }
                        }

                        // Insurance Selection
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Text(
                                    text = "Insurance Coverage",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                
                                InsuranceOption(
                                    title = "Basic Insurance",
                                    description = "Covers basic damages and theft",
                                    price = "5% of daily rate",
                                    selected = selectedInsurance == InsuranceType.BASIC,
                                    onClick = { 
                                        selectedInsurance = InsuranceType.BASIC
                                        viewModel.updateInsurance(InsuranceType.BASIC)
                                    }
                                )
                                
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                InsuranceOption(
                                    title = "Comprehensive Insurance",
                                    description = "Enhanced coverage for peace of mind",
                                    price = "15% of daily rate",
                                    selected = selectedInsurance == InsuranceType.COMPREHENSIVE,
                                    onClick = { 
                                        selectedInsurance = InsuranceType.COMPREHENSIVE
                                        viewModel.updateInsurance(InsuranceType.COMPREHENSIVE)
                                    }
                                )
                                
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                InsuranceOption(
                                    title = "Premium Insurance",
                                    description = "Full coverage with zero excess",
                                    price = "25% of daily rate",
                                    selected = selectedInsurance == InsuranceType.PREMIUM,
                                    onClick = { 
                                        selectedInsurance = InsuranceType.PREMIUM
                                        viewModel.updateInsurance(InsuranceType.PREMIUM)
                                    }
                                )
                            }
                        }

                        // Special Requests
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Text(
                                    text = "Special Requests",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                
                                OutlinedTextField(
                                    value = specialRequests,
                                    onValueChange = { newValue ->
                                        specialRequests = newValue
                                        viewModel.updateSpecialRequests(newValue)
                                    },
                                    label = { Text("Any special requests?") },
                                    placeholder = { Text("e.g., child seat, GPS, etc.") },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(120.dp),
                                    shape = RoundedCornerShape(12.dp),
                                    maxLines = 4
                                )
                            }
                        }

                        // Price Summary
                        if (uiState.totalDays > 0 && uiState.selectedVehicle != null) {
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = MaterialTheme.colorScheme.secondaryContainer
                                )
                            ) {
                                Column(modifier = Modifier.padding(20.dp)) {
                                    Text(
                                        text = "Price Summary",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    
                                    Spacer(modifier = Modifier.height(16.dp))
                                    
                                    PriceRow("Rental (${uiState.totalDays} days)", "KES ${String.format("%.2f", uiState.dailyRate * uiState.totalDays)}")
                                    Spacer(modifier = Modifier.height(8.dp))
                                    PriceRow("Insurance", "KES ${String.format("%.2f", uiState.insuranceCost)}")
                                    Spacer(modifier = Modifier.height(8.dp))
                                    if (uiState.extrasCost > 0) {
                                        PriceRow("Extras", "KES ${String.format("%.2f", uiState.extrasCost)}")
                                        Spacer(modifier = Modifier.height(8.dp))
                                    }
                                    PriceRow("Subtotal", "KES ${String.format("%.2f", uiState.subtotal)}")
                                    Spacer(modifier = Modifier.height(8.dp))
                                    PriceRow("Tax (16%)", "KES ${String.format("%.2f", uiState.taxAmount)}")
                                    
                                    Spacer(modifier = Modifier.height(16.dp))
                                    HorizontalDivider()
                                    Spacer(modifier = Modifier.height(16.dp))
                                    
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = "Total Amount",
                                            style = MaterialTheme.typography.titleLarge,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Text(
                                            text = "KES ${String.format("%.2f", uiState.totalAmount)}",
                                            style = MaterialTheme.typography.titleLarge,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                    
                                    Spacer(modifier = Modifier.height(8.dp))
                                    
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = "Deposit Required (30%)",
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.7f)
                                        )
                                        Text(
                                            text = "KES ${String.format("%.2f", uiState.depositAmount)}",
                                            style = MaterialTheme.typography.bodyMedium,
                                            fontWeight = FontWeight.SemiBold,
                                            color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.7f)
                                        )
                                    }
                                }
                            }
                        }

                        // Book Button
                        Button(
                            onClick = {
                                viewModel.createBooking { rentalId ->
                                    onBookingSuccess()
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                                .height(56.dp),
                            shape = RoundedCornerShape(12.dp),
                            enabled = uiState.isValidForBooking && !uiState.isCreatingBooking
                        ) {
                            if (uiState.isCreatingBooking) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(24.dp),
                                    color = MaterialTheme.colorScheme.onPrimary
                                )
                            } else {
                                Icon(Icons.Default.CheckCircle, contentDescription = null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Confirm Booking", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }
            }
        }
    }
}

@Composable
private fun VehicleSummaryCard(vehicle: Vehicle) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (vehicle.imageUrl != null) {
                AsyncImage(
                    model = vehicle.imageUrl,
                    contentDescription = vehicle.make,
                    modifier = Modifier
                        .size(80.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    contentScale = ContentScale.Crop
                )
            } else {
                Surface(
                    modifier = Modifier.size(80.dp),
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            Icons.Default.DirectionsCar,
                            contentDescription = null,
                            modifier = Modifier.size(40.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "${vehicle.make} ${vehicle.model}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = vehicle.year.toString(),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "KES ${String.format("%.2f", vehicle.pricePerDay)}/day",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@Composable
private fun InsuranceOption(
    title: String,
    description: String,
    price: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (selected) 
                MaterialTheme.colorScheme.primaryContainer 
            else 
                MaterialTheme.colorScheme.surface
        ),
        border = if (selected) 
            CardDefaults.outlinedCardBorder() 
        else 
            null
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            RadioButton(
                selected = selected,
                onClick = onClick
            )
            
            Spacer(modifier = Modifier.width(12.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Text(
                text = price,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
private fun PriceRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyLarge
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.SemiBold
        )
    }
}
