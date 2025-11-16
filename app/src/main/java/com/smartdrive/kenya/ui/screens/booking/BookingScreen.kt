package com.smartdrive.kenya.ui.screens.booking

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.smartdrive.kenya.data.model.*
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter

@Composable
fun BookingScreen(
    vehicleId: String,
    onBookingComplete: (String) -> Unit,
    onNavigateBack: () -> Unit,
    viewModel: BookingViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    LaunchedEffect(vehicleId) {
        viewModel.loadBookingData(vehicleId)
    }
    
    when {
        uiState.isLoading -> {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        }
        
        uiState.error != null -> {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Icon(
                    Icons.Default.Error,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.error,
                    modifier = Modifier.size(64.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Error loading booking data",
                    style = MaterialTheme.typography.headlineSmall
                )
                Text(
                    text = uiState.error ?: "Unknown error",
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(onClick = onNavigateBack) {
                    Text("Go Back")
                }
            }
        }
        
        else -> {
            BookingContent(
                uiState = uiState,
                onDateSelected = viewModel::updateDates,
                onTimeSelected = viewModel::updateTimes,
                onLocationSelected = viewModel::updateLocations,
                onInsuranceSelected = viewModel::updateInsurance,
                onExtraToggled = viewModel::toggleExtra,
                onSpecialRequestsChanged = viewModel::updateSpecialRequests,
                onBookNow = { viewModel.createBooking(onBookingComplete) },
                onNavigateBack = onNavigateBack
            )
        }
    }
}

@Composable
private fun BookingContent(
    uiState: BookingUiState,
    onDateSelected: (LocalDate, LocalDate) -> Unit,
    onTimeSelected: (LocalTime, LocalTime) -> Unit,
    onLocationSelected: (String, String) -> Unit,
    onInsuranceSelected: (InsuranceType) -> Unit,
    onExtraToggled: (RentalExtra, Boolean) -> Unit,
    onSpecialRequestsChanged: (String) -> Unit,
    onBookNow: () -> Unit,
    onNavigateBack: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Top bar
        @OptIn(ExperimentalMaterial3Api::class)
        TopAppBar(
            title = { Text("Book Vehicle") },
            navigationIcon = {
                IconButton(onClick = onNavigateBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
            }
        )
        
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Vehicle details
            item {
                uiState.selectedVehicle?.let { vehicle ->
                    VehicleInfoCard(vehicle = vehicle)
                }
            }
            
            // Date selection
            item {
                DateSelectionCard(
                    pickupDate = uiState.pickupDate,
                    returnDate = uiState.returnDate,
                    onDateSelected = onDateSelected
                )
            }
            
            // Time selection
            item {
                TimeSelectionCard(
                    pickupTime = uiState.pickupTime,
                    returnTime = uiState.returnTime,
                    onTimeSelected = onTimeSelected
                )
            }
            
            // Location selection
            item {
                LocationSelectionCard(
                    locations = uiState.locations,
                    pickupLocationId = uiState.pickupLocationId,
                    returnLocationId = uiState.returnLocationId,
                    onLocationSelected = onLocationSelected
                )
            }
            
            // Insurance selection
            item {
                InsuranceSelectionCard(
                    selectedInsurance = uiState.insuranceType,
                    onInsuranceSelected = onInsuranceSelected
                )
            }
            
            // Extras selection
            item {
                ExtrasSelectionCard(
                    extras = uiState.availableExtras,
                    selectedExtras = uiState.selectedExtras,
                    onExtraToggled = onExtraToggled
                )
            }
            
            // Special requests
            item {
                SpecialRequestsCard(
                    specialRequests = uiState.specialRequests,
                    onSpecialRequestsChanged = onSpecialRequestsChanged
                )
            }
            
            // Price summary
            item {
                PriceSummaryCard(uiState = uiState)
            }
        }
        
        // Book now button
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Button(
                onClick = onBookNow,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                enabled = uiState.isValidForBooking && !uiState.isCreatingBooking
            ) {
                if (uiState.isCreatingBooking) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text(
                        text = "Book Now - KES ${String.format("%.0f", uiState.totalAmount)}",
                        style = MaterialTheme.typography.titleMedium
                    )
                }
            }
        }
    }
}

@Composable
private fun VehicleInfoCard(vehicle: Vehicle) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.DirectionsCar,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(32.dp)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        text = "${vehicle.make} ${vehicle.model}",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${vehicle.year} • ${vehicle.licensePlate}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                VehicleDetailChip(
                    icon = Icons.Default.People,
                    text = "${vehicle.seatingCapacity} seats"
                )
                VehicleDetailChip(
                    icon = Icons.Default.LocalGasStation,
                    text = vehicle.fuelType.value
                )
                VehicleDetailChip(
                    icon = Icons.Default.Settings,
                    text = vehicle.transmission.value
                )
            }
        }
    }
}

@Composable
private fun VehicleDetailChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    text: String
) {
    Row(
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            icon,
            contentDescription = null,
            modifier = Modifier.size(16.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun DateSelectionCard(
    pickupDate: LocalDate?,
    returnDate: LocalDate?,
    onDateSelected: (LocalDate, LocalDate) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Rental Dates",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                // Pickup date
                OutlinedButton(
                    onClick = { /* Open date picker */ },
                    modifier = Modifier.weight(1f)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Pickup Date")
                        Text(
                            text = pickupDate?.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) ?: "Select",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                
                // Return date
                OutlinedButton(
                    onClick = { /* Open date picker */ },
                    modifier = Modifier.weight(1f)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Return Date")
                        Text(
                            text = returnDate?.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) ?: "Select",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun TimeSelectionCard(
    pickupTime: LocalTime?,
    returnTime: LocalTime?,
    onTimeSelected: (LocalTime, LocalTime) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Pickup & Return Times",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                OutlinedButton(
                    onClick = { /* Open time picker */ },
                    modifier = Modifier.weight(1f)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Pickup Time")
                        Text(
                            text = pickupTime?.format(DateTimeFormatter.ofPattern("HH:mm")) ?: "09:00",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                
                OutlinedButton(
                    onClick = { /* Open time picker */ },
                    modifier = Modifier.weight(1f)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Return Time")
                        Text(
                            text = returnTime?.format(DateTimeFormatter.ofPattern("HH:mm")) ?: "17:00",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun LocationSelectionCard(
    locations: List<RentalLocation>,
    pickupLocationId: String?,
    returnLocationId: String?,
    onLocationSelected: (String, String) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Pickup & Return Locations",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            locations.forEach { location ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    RadioButton(
                        selected = location.id == pickupLocationId,
                        onClick = { onLocationSelected(location.id, location.id) }
                    )
                    Column {
                        Text(
                            text = location.name,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = location.address,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun InsuranceSelectionCard(
    selectedInsurance: InsuranceType,
    onInsuranceSelected: (InsuranceType) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Insurance Coverage",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            InsuranceType.entries.forEach { insurance ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    RadioButton(
                        selected = insurance == selectedInsurance,
                        onClick = { onInsuranceSelected(insurance) }
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = insurance.displayName,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = "+${insurance.coveragePercent}% of daily rate",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ExtrasSelectionCard(
    extras: List<RentalExtra>,
    selectedExtras: Set<String>,
    onExtraToggled: (RentalExtra, Boolean) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Optional Extras",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            extras.forEach { extra ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Checkbox(
                        checked = selectedExtras.contains(extra.id),
                        onCheckedChange = { checked ->
                            onExtraToggled(extra, checked)
                        }
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = extra.name,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        extra.description?.let {
                            Text(
                                text = it,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                    Text(
                        text = "KES ${String.format("%.0f", extra.dailyRate)}/day",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}

@Composable
private fun SpecialRequestsCard(
    specialRequests: String,
    onSpecialRequestsChanged: (String) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Special Requests",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            OutlinedTextField(
                value = specialRequests,
                onValueChange = onSpecialRequestsChanged,
                label = { Text("Any special requirements?") },
                placeholder = { Text("e.g., child seat, GPS, specific color...") },
                modifier = Modifier.fillMaxWidth(),
                maxLines = 3
            )
        }
    }
}

@Composable
private fun PriceSummaryCard(uiState: BookingUiState) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Price Summary",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            PriceSummaryRow("Daily Rate", "KES ${String.format("%.0f", uiState.dailyRate)}")
            PriceSummaryRow("Number of Days", "${uiState.totalDays}")
            PriceSummaryRow("Subtotal", "KES ${String.format("%.0f", uiState.subtotal)}")
            
            if (uiState.insuranceCost > 0) {
                PriceSummaryRow("Insurance", "KES ${String.format("%.0f", uiState.insuranceCost)}")
            }
            
            if (uiState.extrasCost > 0) {
                PriceSummaryRow("Extras", "KES ${String.format("%.0f", uiState.extrasCost)}")
            }
            
            PriceSummaryRow("Tax (16%)", "KES ${String.format("%.0f", uiState.taxAmount)}")
            
            Divider(modifier = Modifier.padding(vertical = 8.dp))
            
            PriceSummaryRow(
                "Total Amount", 
                "KES ${String.format("%.0f", uiState.totalAmount)}",
                isTotal = true
            )
            
            PriceSummaryRow(
                "Deposit Required (30%)", 
                "KES ${String.format("%.0f", uiState.depositAmount)}",
                isHighlight = true
            )
        }
    }
}

@Composable
private fun PriceSummaryRow(
    label: String, 
    amount: String, 
    isTotal: Boolean = false,
    isHighlight: Boolean = false
) {
    Row(
        horizontalArrangement = Arrangement.SpaceBetween,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Text(
            text = label,
            style = when {
                isTotal -> MaterialTheme.typography.titleMedium
                else -> MaterialTheme.typography.bodyMedium
            },
            fontWeight = when {
                isTotal || isHighlight -> FontWeight.Bold
                else -> FontWeight.Normal
            }
        )
        Text(
            text = amount,
            style = when {
                isTotal -> MaterialTheme.typography.titleMedium
                else -> MaterialTheme.typography.bodyMedium
            },
            fontWeight = when {
                isTotal || isHighlight -> FontWeight.Bold
                else -> FontWeight.Normal
            },
            color = when {
                isHighlight -> MaterialTheme.colorScheme.primary
                else -> MaterialTheme.colorScheme.onSurface
            }
        )
    }
}