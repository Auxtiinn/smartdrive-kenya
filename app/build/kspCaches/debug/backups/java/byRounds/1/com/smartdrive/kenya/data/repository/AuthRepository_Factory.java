package com.smartdrive.kenya.data.repository;

import com.smartdrive.kenya.data.network.SupabaseClient;
import com.smartdrive.kenya.utils.DatabaseHelper;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast",
    "deprecation",
    "nullness:initialization.field.uninitialized"
})
public final class AuthRepository_Factory implements Factory<AuthRepository> {
  private final Provider<SupabaseClient> supabaseClientProvider;

  private final Provider<DatabaseHelper> databaseHelperProvider;

  public AuthRepository_Factory(Provider<SupabaseClient> supabaseClientProvider,
      Provider<DatabaseHelper> databaseHelperProvider) {
    this.supabaseClientProvider = supabaseClientProvider;
    this.databaseHelperProvider = databaseHelperProvider;
  }

  @Override
  public AuthRepository get() {
    return newInstance(supabaseClientProvider.get(), databaseHelperProvider.get());
  }

  public static AuthRepository_Factory create(Provider<SupabaseClient> supabaseClientProvider,
      Provider<DatabaseHelper> databaseHelperProvider) {
    return new AuthRepository_Factory(supabaseClientProvider, databaseHelperProvider);
  }

  public static AuthRepository newInstance(SupabaseClient supabaseClient,
      DatabaseHelper databaseHelper) {
    return new AuthRepository(supabaseClient, databaseHelper);
  }
}
