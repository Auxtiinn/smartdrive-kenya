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
public final class RentalRepository_Factory implements Factory<RentalRepository> {
  private final Provider<SupabaseClient> supabaseClientProvider;

  public RentalRepository_Factory(Provider<SupabaseClient> supabaseClientProvider) {
    this.supabaseClientProvider = supabaseClientProvider;
  }

  @Override
  public RentalRepository get() {
    return newInstance(supabaseClientProvider.get());
  }

  public static RentalRepository_Factory create(Provider<SupabaseClient> supabaseClientProvider) {
    return new RentalRepository_Factory(supabaseClientProvider);
  }

  public static RentalRepository newInstance(SupabaseClient supabaseClient) {
    return new RentalRepository(supabaseClient);
  }
}
