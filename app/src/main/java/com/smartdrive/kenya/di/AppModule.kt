package com.smartdrive.kenya.di

import android.content.Context
import com.smartdrive.kenya.data.network.SupabaseClient
import com.smartdrive.kenya.data.repository.AuthRepository
import com.smartdrive.kenya.data.repository.RentalRepository
import com.smartdrive.kenya.data.repository.VehicleRepository
import com.smartdrive.kenya.utils.DatabaseHelper
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    @Provides
    @Singleton
    fun provideSupabaseClient(@ApplicationContext context: Context): SupabaseClient {
        return SupabaseClient(context)
    }
    
    @Provides
    @Singleton
    fun provideDatabaseHelper(supabaseClient: SupabaseClient): DatabaseHelper {
        return DatabaseHelper(supabaseClient)
    }
    
    @Provides
    @Singleton
    fun provideAuthRepository(
        supabaseClient: SupabaseClient,
        databaseHelper: DatabaseHelper
    ): AuthRepository {
        return AuthRepository(supabaseClient, databaseHelper)
    }
    
    @Provides
    @Singleton
    fun provideVehicleRepository(supabaseClient: SupabaseClient): VehicleRepository {
        return VehicleRepository(supabaseClient)
    }
    
    @Provides
    @Singleton
    fun provideRentalRepository(supabaseClient: SupabaseClient): RentalRepository {
        return RentalRepository(supabaseClient)
    }
}