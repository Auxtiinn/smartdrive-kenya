package com.smartdrive.kenya.utils

import com.smartdrive.kenya.data.network.SupabaseClient
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class DatabaseHelper @Inject constructor(
    private val supabaseClient: SupabaseClient
) {
    
    /**
     * Test database connection
     */
    fun testConnection(): Flow<Boolean> = flow {
        try {
            // Try to fetch settings (should be accessible without auth)
            supabaseClient.postgrest
                .from("settings")
                .select()
                .decodeList<Map<String, Any>>()
            emit(true)
        } catch (e: Exception) {
            emit(false)
        }
    }
    
    /**
     * Verify user profile exists after authentication
     */
    suspend fun verifyUserProfile(userId: String): Result<Boolean> {
        return try {
            val profiles = supabaseClient.postgrest
                .from("profiles")
                .select()
                .decodeList<Map<String, Any>>()
            
            val userExists = profiles.any { it["id"] == userId }
            Result.success(userExists)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Get user role from profile
     */
    suspend fun getUserRole(userId: String): Result<String> {
        return try {
            val profiles = supabaseClient.postgrest
                .from("profiles")
                .select()
                .decodeList<Map<String, Any>>()
            
            val userProfile = profiles.find { it["id"] == userId }
            val role = userProfile?.get("role") as? String ?: "customer"
            Result.success(role)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}