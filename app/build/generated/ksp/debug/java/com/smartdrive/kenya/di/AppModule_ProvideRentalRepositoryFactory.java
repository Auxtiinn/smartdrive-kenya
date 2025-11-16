package com.smartdrive.kenya.di;

import com.smartdrive.kenya.data.network.SupabaseClient;
import com.smartdrive.kenya.data.repository.RentalRepository;
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
public final class AppModule_ProvideRentalRepositoryFactory implements Factory<RentalRepository> {
  private final Provider<SupabaseClient> supabaseClientProvider;

  public AppModule_ProvideRentalRepositoryFactory(Provider<SupabaseClient> supabaseClientProvider) {
    this.supabaseClientProvider = supabaseClientProvider;
  }

  @Override
  public RentalRepository get() {
    return provideRentalRepository(supabaseClientProvider.get());
  }

  public static AppModule_ProvideRentalRepositoryFactory create(
      Provider<SupabaseClient> supabaseClientProvider) {
    return new AppModule_ProvideRentalRepositoryFactory(supabaseClientProvider);
  }

  public static RentalRepository provideRentalRepository(SupabaseClient supabaseClient) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideRentalRepository(supabaseClient));
  }
}
