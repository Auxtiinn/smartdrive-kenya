package com.smartdrive.kenya.di;

import com.smartdrive.kenya.data.network.SupabaseClient;
import com.smartdrive.kenya.data.repository.VehicleRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
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
public final class AppModule_ProvideVehicleRepositoryFactory implements Factory<VehicleRepository> {
  private final Provider<SupabaseClient> supabaseClientProvider;

  public AppModule_ProvideVehicleRepositoryFactory(
      Provider<SupabaseClient> supabaseClientProvider) {
    this.supabaseClientProvider = supabaseClientProvider;
  }

  @Override
  public VehicleRepository get() {
    return provideVehicleRepository(supabaseClientProvider.get());
  }

  public static AppModule_ProvideVehicleRepositoryFactory create(
      Provider<SupabaseClient> supabaseClientProvider) {
    return new AppModule_ProvideVehicleRepositoryFactory(supabaseClientProvider);
  }

  public static VehicleRepository provideVehicleRepository(SupabaseClient supabaseClient) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideVehicleRepository(supabaseClient));
  }
}
