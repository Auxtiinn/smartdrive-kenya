package com.smartdrive.kenya.data.repository

import com.smartdrive.kenya.data.model.Vehicle
import com.smartdrive.kenya.data.model.VehicleStatus
import com.smartdrive.kenya.data.network.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class VehicleRepository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {
    
    suspend fun getAvailableVehicles(): Result<List<Vehicle>> {
        return try {
            val allVehicles = supabaseClient.postgrest
                .from("vehicles")
                .select(columns = Columns.ALL)
                .decodeList<Vehicle>()
            
            val vehicles = allVehicles.filter { it.status == VehicleStatus.AVAILABLE }
            
            Result.success(vehicles)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getAllVehicles(): Result<List<Vehicle>> {
        return try {
            val vehicles = supabaseClient.postgrest
                .from("vehicles")
                .select(columns = Columns.ALL)
                .decodeList<Vehicle>()
            
            Result.success(vehicles)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getVehicleById(id: String): Result<Vehicle> {
        return try {
            val vehicles = supabaseClient.postgrest
                .from("vehicles")
                .select(columns = Columns.ALL)
                .decodeList<Vehicle>()
            
            val vehicle = vehicles.firstOrNull { it.id == id }
                ?: throw Exception("Vehicle not found")
            
            Result.success(vehicle)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}