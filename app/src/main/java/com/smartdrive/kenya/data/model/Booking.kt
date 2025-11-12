package com.smartdrive.kenya.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Booking(
    val id: String,
    val vehicleId: String,
    val customerId: String,
    val startDate: String,
    val endDate: String,
    val totalAmount: Double,
    val status: BookingStatus = BookingStatus.PENDING,
    val notes: String? = null,
    val pickupLocation: String? = null,
    val dropoffLocation: String? = null,
    val createdAt: String,
    val updatedAt: String? = null,
    
    // Related data (when joined)
    val vehicle: Vehicle? = null,
    val customer: Profile? = null
)

@Serializable
enum class BookingStatus(val value: String) {
    PENDING("pending"),
    CONFIRMED("confirmed"),
    ACTIVE("active"),
    COMPLETED("completed"),
    CANCELLED("cancelled");

    companion object {
        fun fromString(value: String): BookingStatus {
            return entries.find { it.value == value } ?: PENDING
        }
    }
}