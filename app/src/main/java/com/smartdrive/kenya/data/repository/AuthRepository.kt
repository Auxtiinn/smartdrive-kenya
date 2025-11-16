package com.smartdrive.kenya.data.repository

import com.smartdrive.kenya.data.model.User
import com.smartdrive.kenya.data.model.UserRole
import com.smartdrive.kenya.data.model.Profile
import com.smartdrive.kenya.data.network.SupabaseClient
import com.smartdrive.kenya.utils.DatabaseHelper
// import io.github.jan.supabase.auth.SessionStatus
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val supabaseClient: SupabaseClient,
    private val databaseHelper: DatabaseHelper
) {
    
    fun getSessionStatus(): Flow<Boolean> = 
        flow { emit(supabaseClient.auth.currentUserOrNull() != null) }
    
    suspend fun signUp(email: String, password: String, fullName: String): Result<User> {
        return try {
            // Sign up with Supabase Auth
            supabaseClient.auth.signUpWith(Email) {
                this.email = email
                this.password = password
            }
            
            val user = supabaseClient.auth.currentUserOrNull()
            if (user != null) {
                // Create profile in database
                createProfile(user.id, fullName, email)
                
                // Verify profile was created successfully
                val profileExists = databaseHelper.verifyUserProfile(user.id)
                if (profileExists.isSuccess && profileExists.getOrNull() == true) {
                    Result.success(User(
                        id = user.id,
                        email = user.email ?: email,
                        createdAt = user.createdAt.toString()
                    ))
                } else {
                    Result.failure(Exception("Profile creation failed. Please try again."))
                }
            } else {
                Result.failure(Exception("User registration failed. Please check your email for confirmation."))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Registration failed: ${e.message}"))
        }
    }
    
    suspend fun signIn(email: String, password: String): Result<User> {
        return try {
            val result = supabaseClient.auth.signInWith(Email) {
                this.email = email
                this.password = password
            }
            
            val user = supabaseClient.auth.currentUserOrNull()
            if (user != null) {
                Result.success(User(
                    id = user.id,
                    email = user.email ?: email,
                    createdAt = user.createdAt.toString()
                ))
            } else {
                Result.failure(Exception("Sign in failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun signOut(): Result<Unit> {
        return try {
            supabaseClient.auth.signOut()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getCurrentUser(): User? {
        return supabaseClient.auth.currentUserOrNull()?.let { user ->
            User(
                id = user.id,
                email = user.email ?: "",
                createdAt = user.createdAt.toString()
            )
        }
    }
    
    suspend fun getUserProfile(userId: String): Result<Profile> {
        return try {
            val profiles = supabaseClient.postgrest
                .from("profiles")
                .select(columns = Columns.ALL)
                .decodeList<Profile>()
            
            val profile = profiles.firstOrNull { it.id == userId }
                ?: throw Exception("Profile not found")
            
            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    private suspend fun createProfile(userId: String, fullName: String, email: String) {
        try {
            supabaseClient.postgrest
                .from("profiles")
                .insert(buildJsonObject {
                    put("id", userId)
                    put("full_name", fullName)
                    put("role", UserRole.CUSTOMER.value)
                    put("signup_source", "mobile_app")
                    put("created_at", kotlinx.datetime.Clock.System.now().toString())
                })
        } catch (e: Exception) {
            // Handle profile creation error
            println("Profile creation failed: ${e.message}")
        }
    }
}