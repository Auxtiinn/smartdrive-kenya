package com.smartdrive.kenya.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalTime

@Serializable
data class Rental(
    val id: String,
    val customerId: String,
    val vehicleId: String,
    val pickupLocationId: String,
    val returnLocationId: String,
    
    // Rental dates and times
    val pickupDate: String, // LocalDate as string
    val pickupTime: String, // LocalTime as string
    val returnDate: String,
    val returnTime: String,
    val actualPickupDatetime: String? = null,
    val actualReturnDatetime: String? = null,
    
    // Pricing
    val dailyRate: Double,
    val totalDays: Int,
    val subtotal: Double,
    val insuranceCost: Double = 0.0,
    val taxAmount: Double = 0.0,
    val depositAmount: Double,
    val totalAmount: Double,
    
    // Status and details
    val status: RentalStatus = RentalStatus.PENDING,
    val insuranceType: InsuranceType = InsuranceType.BASIC,
    val specialRequests: String? = null,
    
    // Vehicle condition tracking
    val pickupMileage: Int? = null,
    val returnMileage: Int? = null,
    val pickupFuelLevel: Int? = null,
    val returnFuelLevel: Int? = null,
    
    val adminNotes: String? = null,
    val createdAt: String,
    val updatedAt: String? = null
)

@Serializable
enum class RentalStatus(val value: String) {
    @SerialName("pending") PENDING("pending"),
    @SerialName("confirmed") CONFIRMED("confirmed"),
    @SerialName("active") ACTIVE("active"),
    @SerialName("completed") COMPLETED("completed"),
    @SerialName("cancelled") CANCELLED("cancelled"),
    @SerialName("overdue") OVERDUE("overdue");

    companion object {
        fun fromString(value: String): RentalStatus {
            return entries.find { it.value == value } ?: PENDING
        }
    }
}

@Serializable
enum class InsuranceType(val value: String, val displayName: String, val coveragePercent: Int) {
    @SerialName("none") NONE("none", "No Insurance", 0),
    @SerialName("basic") BASIC("basic", "Basic Coverage", 5),
    @SerialName("comprehensive") COMPREHENSIVE("comprehensive", "Comprehensive", 15),
    @SerialName("premium") PREMIUM("premium", "Premium Coverage", 25);

    companion object {
        fun fromString(value: String): InsuranceType {
            return entries.find { it.value == value } ?: BASIC
        }
    }
}

@Serializable
data class RentalLocation(
    val id: String,
    val name: String,
    val address: String,
    val city: String,
    val county: String,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val phone: String? = null,
    val email: String? = null,
    val operatingHours: Map<String, String>? = null,
    val isActive: Boolean = true,
    val createdAt: String
)

@Serializable
data class RentalExtra(
    val id: String,
    val name: String,
    val description: String? = null,
    val dailyRate: Double,
    val category: String, // navigation, safety, comfort, convenience
    val isActive: Boolean = true
)

@Serializable
data class RentalExtraSelection(
    val id: String,
    val rentalId: String,
    val rentalExtraId: String,
    val quantity: Int = 1,
    val dailyRate: Double,
    val totalCost: Double
)

@Serializable
data class Payment(
    val id: String,
    val rentalId: String,
    val customerId: String,
    val amount: Double,
    val paymentMethod: PaymentMethod,
    val status: PaymentStatus = PaymentStatus.PENDING,
    val transactionId: String? = null,
    val mpesaReceiptNumber: String? = null,
    val mpesaPhoneNumber: String? = null,
    val currency: String = "KES",
    val paymentDate: String? = null,
    val description: String? = null,
    val createdAt: String
)

@Serializable
enum class PaymentMethod(val value: String, val displayName: String) {
    @SerialName("mpesa") MPESA("mpesa", "M-Pesa"),
    @SerialName("card") CARD("card", "Credit/Debit Card"),
    @SerialName("bank_transfer") BANK_TRANSFER("bank_transfer", "Bank Transfer"),
    @SerialName("cash") CASH("cash", "Cash"),
    @SerialName("wallet") WALLET("wallet", "Digital Wallet");

    companion object {
        fun fromString(value: String): PaymentMethod {
            return entries.find { it.value == value } ?: MPESA
        }
    }
}

@Serializable
enum class PaymentStatus(val value: String) {
    @SerialName("pending") PENDING("pending"),
    @SerialName("processing") PROCESSING("processing"),
    @SerialName("completed") COMPLETED("completed"),
    @SerialName("failed") FAILED("failed"),
    @SerialName("refunded") REFUNDED("refunded"),
    @SerialName("cancelled") CANCELLED("cancelled");

    companion object {
        fun fromString(value: String): PaymentStatus {
            return entries.find { it.value == value } ?: PENDING
        }
    }
}

@Serializable
data class Review(
    val id: String,
    val rentalId: String,
    val customerId: String,
    val vehicleId: String,
    val overallRating: Int, // 1-5
    val vehicleConditionRating: Int? = null,
    val serviceRating: Int? = null,
    val valueForMoneyRating: Int? = null,
    val title: String? = null,
    val comment: String? = null,
    val isApproved: Boolean = false,
    val isFeatured: Boolean = false,
    val createdAt: String
)

// Data classes for UI state
data class RentalRequest(
    val vehicleId: String,
    val pickupLocationId: String,
    val returnLocationId: String,
    val pickupDate: LocalDate,
    val pickupTime: LocalTime,
    val returnDate: LocalDate,
    val returnTime: LocalTime,
    val insuranceType: InsuranceType = InsuranceType.BASIC,
    val selectedExtras: List<RentalExtraSelection> = emptyList(),
    val specialRequests: String? = null
)

data class RentalSummary(
    val rental: Rental,
    val vehicle: Vehicle,
    val pickupLocation: RentalLocation,
    val returnLocation: RentalLocation,
    val selectedExtras: List<RentalExtraSelection> = emptyList(),
    val payments: List<Payment> = emptyList(),
    val review: Review? = null
)