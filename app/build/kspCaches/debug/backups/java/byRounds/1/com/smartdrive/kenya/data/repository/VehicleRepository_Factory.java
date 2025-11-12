package com.smartdrive.kenya.data.repository;

import com.smartdrive.kenya.data.network.SupabaseClient;
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
public final class VehicleRepository_Factory implements Factory<VehicleRepository> {
  private final Provider<SupabaseClient> supabaseClientProvider;

  public VehicleRepository_Factory(Provider<SupabaseClient> supabaseClientProvider) {
    this.supabaseClientProvider = supabaseClientProvider;
  }

  @Override
  public VehicleRepository get() {
    return newInstance(supabaseClientProvider.get());
  }

  public static VehicleRepository_Factory create(Provider<SupabaseClient> supabaseClientProvider) {
    return new VehicleRepository_Factory(supabaseClientProvider);
  }

  public static VehicleRepository newInstance(SupabaseClient supabaseClient) {
    return new VehicleRepository(supabaseClient);
  }
}
