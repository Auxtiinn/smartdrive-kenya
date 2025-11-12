package com.smartdrive.kenya.data.repository

import com.smartdrive.kenya.data.model.*
import com.smartdrive.kenya.data.network.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RentalRepository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {
    
    // ================== RENTAL LOCATIONS ==================
    
    suspend fun getRentalLocations(): Result<List<RentalLocation>> {
        return try {
            val locations = supabaseClient.postgrest
                .from("rental_locations")
                .select(columns = Columns.ALL)
                .decodeList<RentalLocation>()
            Result.success(locations)
        } catch (e: Exception) {
            Result.failure(Exception("Failed to fetch rental locations: ${e.message}"))
        }
    }
    
    // ================== RENTAL EXTRAS ==================
    
    suspend fun getRentalExtras(): Result<List<RentalExtra>> {
        return try {
            val extras = supabaseClient.postgrest
                .from("rental_extras")
                .select(columns = Columns.ALL)
                .decodeList<RentalExtra>()
                .filter { extra: RentalExtra -> extra.isActive }
            Result.success(extras)
        } catch (e: Exception) {
            Result.failure(Exception("Failed to fetch rental extras: ${e.message}"))
        }
    }
    
    // ================== VEHICLE AVAILABILITY ==================
    
    suspend fun checkVehicleAvailability(
        vehicleId: String,
        startDate: LocalDate,
        endDate: LocalDate
    ): Result<Boolean> {
        return try {
            // Manual check for availability
            val rentals = supabaseClient.postgrest
                .from("rentals")
                .select(columns = Columns.ALL)
                .decodeList<Rental>()
                .filter { rental: Rental ->
                    rental.vehicleId == vehicleId &&
                    rental.status !in listOf(RentalStatus.CANCELLED, RentalStatus.COMPLETED) &&
                    datesOverlap(
                        LocalDate.parse(rental.pickupDate),
                        LocalDate.parse(rental.returnDate),
                        startDate,
                        endDate
                    )
                }
            
            Result.success(rentals.isEmpty())
        } catch (e: Exception) {
            Result.failure(Exception("Failed to check availability: ${e.message}"))
        }
    }
    
    private fun datesOverlap(start1: LocalDate, end1: LocalDate, start2: LocalDate, end2: LocalDate): Boolean {
        return start1 <= end2 && end1 >= start2
    }
    
    // ================== RENTAL CREATION ==================
    
    suspend fun createRental(rentalRequest: RentalRequest): Result<Rental> {
        return try {
            val currentUser = supabaseClient.auth.currentUserOrNull()
                ?: return Result.failure(Exception("User not authenticated"))
            
            // First, check availability
            val isAvailable = checkVehicleAvailability(
                rentalRequest.vehicleId,
                rentalRequest.pickupDate,
                rentalRequest.returnDate
            )
            
            if (!isAvailable.getOrDefault(false)) {
                return Result.failure(Exception("Vehicle is not available for the selected dates"))
            }
            
            // Calculate total days
            val totalDays = calculateDaysBetween(rentalRequest.pickupDate, rentalRequest.returnDate)
            
            // Get vehicle details for pricing
            val vehicle = supabaseClient.postgrest
                .from("vehicles")
                .select(columns = Columns.ALL)
                .decodeList<Vehicle>()
                .find { vehicle: Vehicle -> vehicle.id == rentalRequest.vehicleId }
                ?: return Result.failure(Exception("Vehicle not found"))
            
            val dailyRate = vehicle.pricePerDay
            val insuranceCost = calculateInsuranceCost(dailyRate, rentalRequest.insuranceType)
            val extrasCost = rentalRequest.selectedExtras.sumOf { extra: RentalExtraSelection -> extra.totalCost }
            val subtotal = (dailyRate + insuranceCost) * totalDays + extrasCost
            val taxAmount = subtotal * 0.16 // 16% VAT
            val totalAmount = subtotal + taxAmount
            val depositAmount = totalAmount * 0.30 // 30% deposit
            
            // Create rental
            supabaseClient.postgrest
                .from("rentals")
                .insert(buildJsonObject {
                    put("customer_id", currentUser.id)
                    put("vehicle_id", rentalRequest.vehicleId)
                    put("pickup_location_id", rentalRequest.pickupLocationId)
                    put("return_location_id", rentalRequest.returnLocationId)
                    put("pickup_date", rentalRequest.pickupDate.toString())
                    put("pickup_time", rentalRequest.pickupTime.toString())
                    put("return_date", rentalRequest.returnDate.toString())
                    put("return_time", rentalRequest.returnTime.toString())
                    put("daily_rate", dailyRate)
                    put("total_days", totalDays)
                    put("subtotal", subtotal)
                    put("insurance_cost", insuranceCost)
                    put("tax_amount", taxAmount)
                    put("deposit_amount", depositAmount)
                    put("total_amount", totalAmount)
                    put("status", RentalStatus.PENDING.value)
                    put("insurance_type", rentalRequest.insuranceType.value)
                    rentalRequest.specialRequests?.let { put("special_requests", it) }
                })
            
            // For now, we'll create a mock rental response since we can't get the inserted rental back easily
            val mockRental = Rental(
                id = "temp_id_${System.currentTimeMillis()}",
                customerId = currentUser.id,
                vehicleId = rentalRequest.vehicleId,
                pickupLocationId = rentalRequest.pickupLocationId,
                returnLocationId = rentalRequest.returnLocationId,
                pickupDate = rentalRequest.pickupDate.toString(),
                pickupTime = rentalRequest.pickupTime.toString(),
                returnDate = rentalRequest.returnDate.toString(),
                returnTime = rentalRequest.returnTime.toString(),
                dailyRate = dailyRate,
                totalDays = totalDays,
                subtotal = subtotal,
                insuranceCost = insuranceCost,
                taxAmount = taxAmount,
                depositAmount = depositAmount,
                totalAmount = totalAmount,
                status = RentalStatus.PENDING,
                insuranceType = rentalRequest.insuranceType,
                specialRequests = rentalRequest.specialRequests,
                createdAt = java.time.Instant.now().toString()
            )
            
            // Add rental extras if any
            if (rentalRequest.selectedExtras.isNotEmpty()) {
                addRentalExtras(mockRental.id, rentalRequest.selectedExtras, totalDays)
            }
            
            Result.success(mockRental)
        } catch (e: Exception) {
            Result.failure(Exception("Failed to create rental: ${e.message}"))
        }
    }
    
    private fun calculateDaysBetween(startDate: LocalDate, endDate: LocalDate): Int {
        return (endDate.toEpochDay() - startDate.toEpochDay()).toInt().let { 
            if (it <= 0) 1 else it 
        }
    }
    
    private fun calculateInsuranceCost(dailyRate: Double, insuranceType: InsuranceType): Double {
        return dailyRate * (insuranceType.coveragePercent / 100.0)
    }
    
    private suspend fun addRentalExtras(
        rentalId: String, 
        extras: List<RentalExtraSelection>,
        totalDays: Int
    ) {
        extras.forEach { extra: RentalExtraSelection ->
            supabaseClient.postgrest
                .from("rental_extra_selections")
                .insert(buildJsonObject {
                    put("rental_id", rentalId)
                    put("rental_extra_id", extra.rentalExtraId)
                    put("quantity", extra.quantity)
                    put("daily_rate", extra.dailyRate)
                    put("total_cost", extra.dailyRate * extra.quantity * totalDays)
                })
        }
    }
    
    // ================== RENTAL MANAGEMENT ==================
    
    suspend fun getUserRentals(userId: String): Result<List<RentalSummary>> {
        return try {
            val rentals = supabaseClient.postgrest
                .from("rentals")
                .select(columns = Columns.ALL)
                .decodeList<Rental>()
                .filter { rental: Rental -> rental.customerId == userId }
                .sortedByDescending { rental: Rental -> rental.createdAt }
            
            val rentalSummaries = rentals.map { rental: Rental ->
                createRentalSummary(rental)
            }
            
            Result.success(rentalSummaries)
        } catch (e: Exception) {
            Result.failure(Exception("Failed to fetch user rentals: ${e.message}"))
        }
    }
    
    private suspend fun createRentalSummary(rental: Rental): RentalSummary {
        // Get vehicle details
        val vehicle = supabaseClient.postgrest
            .from("vehicles")
            .select(columns = Columns.ALL)
            .decodeList<Vehicle>()
            .find { vehicle: Vehicle -> vehicle.id == rental.vehicleId }
            ?: Vehicle(
                id = "",
                make = "Unknown",
                model = "Vehicle",
                year = 2020,
                licensePlate = "",
                color = null,
                fuelType = FuelType.PETROL,
                transmission = Transmission.MANUAL,
                seatingCapacity = 4,
                pricePerDay = 0.0,
                imageUrl = null,
                status = VehicleStatus.AVAILABLE,
                features = emptyList(),
                agentId = null,
                createdAt = "",
                updatedAt = null
            )
        
        // Get locations
        val locations = supabaseClient.postgrest
            .from("rental_locations")
            .select(columns = Columns.ALL)
            .decodeList<RentalLocation>()
        
        val pickupLocation = locations.find { location: RentalLocation -> location.id == rental.pickupLocationId }
            ?: RentalLocation("", "Unknown Location", "", "", "", null, null, null, null, null, true, "")
        
        val returnLocation = locations.find { location: RentalLocation -> location.id == rental.returnLocationId }
            ?: pickupLocation
        
        return RentalSummary(
            rental = rental,
            vehicle = vehicle,
            pickupLocation = pickupLocation,
            returnLocation = returnLocation
        )
    }
    
    suspend fun getRentalById(rentalId: String): Result<RentalSummary> {
        return try {
            val rental = supabaseClient.postgrest
                .from("rentals")
                .select(columns = Columns.ALL)
                .decodeList<Rental>()
                .find { rental: Rental -> rental.id == rentalId }
                ?: return Result.failure(Exception("Rental not found"))
            
            val summary = createRentalSummary(rental)
            Result.success(summary)
        } catch (e: Exception) {
            Result.failure(Exception("Failed to fetch rental: ${e.message}"))
        }
    }
    
    suspend fun cancelRental(rentalId: String, reason: String): Result<Unit> {
        return try {
            supabaseClient.postgrest
                .from("rentals")
                .update(buildJsonObject {
                    put("status", RentalStatus.CANCELLED.value)
                    put("admin_notes", reason)
                    put("updated_at", java.time.Instant.now().toString())
                })
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(Exception("Failed to cancel rental: ${e.message}"))
        }
    }
    
    // ================== PAYMENT METHODS ==================
    
    suspend fun createPayment(
        rentalId: String,
        amount: Double,
        paymentMethod: PaymentMethod,
        phoneNumber: String? = null
    ): Result<Payment> {
        return try {
            val currentUser = supabaseClient.auth.currentUserOrNull()
                ?: return Result.failure(Exception("User not authenticated"))
            
            supabaseClient.postgrest
                .from("payments")
                .insert(buildJsonObject {
                    put("rental_id", rentalId)
                    put("customer_id", currentUser.id)
                    put("amount", amount)
                    put("payment_method", paymentMethod.value)
                    put("status", PaymentStatus.PENDING.value)
                    phoneNumber?.let { put("mpesa_phone_number", it) }
                    put("currency", "KES")
                    put("description", "Car rental payment")
                })
            
            val payment = Payment(
                id = "temp_payment_${System.currentTimeMillis()}",
                rentalId = rentalId,
                customerId = currentUser.id,
                amount = amount,
                paymentMethod = paymentMethod,
                status = PaymentStatus.PENDING,
                mpesaPhoneNumber = phoneNumber,
                currency = "KES",
                description = "Car rental payment",
                createdAt = java.time.Instant.now().toString()
            )
            
            // Here you would integrate with actual payment providers
            // For now, we'll simulate payment processing
            
            Result.success(payment)
        } catch (e: Exception) {
            Result.failure(Exception("Failed to create payment: ${e.message}"))
        }
    }
    
    // ================== REVIEWS ==================
    
    suspend fun submitReview(
        rentalId: String,
        overallRating: Int,
        title: String?,
        comment: String?
    ): Result<Review> {
        return try {
            val currentUser = supabaseClient.auth.currentUserOrNull()
                ?: return Result.failure(Exception("User not authenticated"))
            
            // Get rental to verify vehicle ID
            val rental = supabaseClient.postgrest
                .from("rentals")
                .select(columns = Columns.ALL)
                .decodeList<Rental>()
                .find { rental: Rental -> rental.id == rentalId && rental.customerId == currentUser.id }
                ?: return Result.failure(Exception("Rental not found or not authorized"))
            
            if (rental.status != RentalStatus.COMPLETED) {
                return Result.failure(Exception("Can only review completed rentals"))
            }
            
            supabaseClient.postgrest
                .from("reviews")
                .insert(buildJsonObject {
                    put("rental_id", rentalId)
                    put("customer_id", currentUser.id)
                    put("vehicle_id", rental.vehicleId)
                    put("overall_rating", overallRating)
                    title?.let { put("title", it) }
                    comment?.let { put("comment", it) }
                })
            
            val review = Review(
                id = "temp_review_${System.currentTimeMillis()}",
                rentalId = rentalId,
                customerId = currentUser.id,
                vehicleId = rental.vehicleId,
                overallRating = overallRating,
                title = title,
                comment = comment,
                isApproved = false,
                isFeatured = false,
                createdAt = java.time.Instant.now().toString()
            )
            
            Result.success(review)
        } catch (e: Exception) {
            Result.failure(Exception("Failed to submit review: ${e.message}"))
        }
    }
}