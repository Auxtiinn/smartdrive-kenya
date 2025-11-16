package com.smartdrive.kenya.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Vehicle(
    val id: String,
    val make: String,
    val model: String,
    val year: Int,
    @SerialName("license_plate") val licensePlate: String,
    val color: String? = null,
    @SerialName("fuel_type") val fuelType: FuelType = FuelType.PETROL,
    val transmission: Transmission = Transmission.MANUAL,
    @SerialName("seating_capacity") val seatingCapacity: Int,
    @SerialName("price_per_day") val pricePerDay: Double,
    @SerialName("image_url") val imageUrl: String? = null,
    val status: VehicleStatus = VehicleStatus.AVAILABLE,
    val features: List<String> = emptyList(),
    @SerialName("agent_id") val agentId: String? = null,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String? = null
)

@Serializable
enum class FuelType(val value: String) {
    @SerialName("petrol") PETROL("petrol"),
    @SerialName("diesel") DIESEL("diesel"),
    @SerialName("electric") ELECTRIC("electric"),
    @SerialName("hybrid") HYBRID("hybrid");

    companion object {
        fun fromString(value: String): FuelType {
            return entries.find { it.value == value } ?: PETROL
        }
    }
}

@Serializable
enum class Transmission(val value: String) {
    @SerialName("manual") MANUAL("manual"),
    @SerialName("automatic") AUTOMATIC("automatic");

    companion object {
        fun fromString(value: String): Transmission {
            return entries.find { it.value == value } ?: MANUAL
        }
    }
}

@Serializable
enum class VehicleStatus(val value: String) {
    @SerialName("available") AVAILABLE("available"),
    @SerialName("rented") RENTED("rented"),
    @SerialName("maintenance") MAINTENANCE("maintenance"),
    @SerialName("unavailable") UNAVAILABLE("unavailable");

    companion object {
        fun fromString(value: String): VehicleStatus {
            return entries.find { it.value == value } ?: AVAILABLE
        }
    }
}