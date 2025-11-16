package com.smartdrive.kenya.di;

import com.smartdrive.kenya.data.network.SupabaseClient;
import com.smartdrive.kenya.data.repository.AuthRepository;
import com.smartdrive.kenya.utils.DatabaseHelper;
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
public final class AppModule_ProvideAuthRepositoryFactory implements Factory<AuthRepository> {
  private final Provider<SupabaseClient> supabaseClientProvider;

  private final Provider<DatabaseHelper> databaseHelperProvider;

  public AppModule_ProvideAuthRepositoryFactory(Provider<SupabaseClient> supabaseClientProvider,
      Provider<DatabaseHelper> databaseHelperProvider) {
    this.supabaseClientProvider = supabaseClientProvider;
    this.databaseHelperProvider = databaseHelperProvider;
  }

  @Override
  public AuthRepository get() {
    return provideAuthRepository(supabaseClientProvider.get(), databaseHelperProvider.get());
  }

  public static AppModule_ProvideAuthRepositoryFactory create(
      Provider<SupabaseClient> supabaseClientProvider,
      Provider<DatabaseHelper> databaseHelperProvider) {
    return new AppModule_ProvideAuthRepositoryFactory(supabaseClientProvider, databaseHelperProvider);
  }

  public static AuthRepository provideAuthRepository(SupabaseClient supabaseClient,
      DatabaseHelper databaseHelper) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideAuthRepository(supabaseClient, databaseHelper));
  }
}
