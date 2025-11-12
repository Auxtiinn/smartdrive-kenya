package com.smartdrive.kenya.di;

import com.smartdrive.kenya.data.network.SupabaseClient;
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
public final class AppModule_ProvideDatabaseHelperFactory implements Factory<DatabaseHelper> {
  private final Provider<SupabaseClient> supabaseClientProvider;

  public AppModule_ProvideDatabaseHelperFactory(Provider<SupabaseClient> supabaseClientProvider) {
    this.supabaseClientProvider = supabaseClientProvider;
  }

  @Override
  public DatabaseHelper get() {
    return provideDatabaseHelper(supabaseClientProvider.get());
  }

  public static AppModule_ProvideDatabaseHelperFactory create(
      Provider<SupabaseClient> supabaseClientProvider) {
    return new AppModule_ProvideDatabaseHelperFactory(supabaseClientProvider);
  }

  public static DatabaseHelper provideDatabaseHelper(SupabaseClient supabaseClient) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideDatabaseHelper(supabaseClient));
  }
}
