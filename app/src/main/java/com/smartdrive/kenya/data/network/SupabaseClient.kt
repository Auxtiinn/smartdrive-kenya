package com.smartdrive.kenya.data.network

import android.content.Context
import com.smartdrive.kenya.R
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.realtime.Realtime
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SupabaseClient @Inject constructor(
    @ApplicationContext private val context: Context
) {
    
    private val supabaseUrl = context.getString(R.string.supabase_url)
    private val supabaseKey = context.getString(R.string.supabase_anon_key)
    
    val client: SupabaseClient = createSupabaseClient(
        supabaseUrl = supabaseUrl,
        supabaseKey = supabaseKey
    ) {
        install(Auth)
        install(Postgrest)
        install(Realtime)
    }
    
    val auth: Auth get() = client.auth
    val postgrest: Postgrest get() = client.postgrest
}