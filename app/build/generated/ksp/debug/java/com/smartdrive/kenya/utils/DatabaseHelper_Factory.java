package com.smartdrive.kenya.utils;

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
public final class DatabaseHelper_Factory implements Factory<DatabaseHelper> {
  private final Provider<SupabaseClient> supabaseClientProvider;

  public DatabaseHelper_Factory(Provider<SupabaseClient> supabaseClientProvider) {
    this.supabaseClientProvider = supabaseClientProvider;
  }

  @Override
  public DatabaseHelper get() {
    return newInstance(supabaseClientProvider.get());
  }

  public static DatabaseHelper_Factory create(Provider<SupabaseClient> supabaseClientProvider) {
    return new DatabaseHelper_Factory(supabaseClientProvider);
  }

  public static DatabaseHelper newInstance(SupabaseClient supabaseClient) {
    return new DatabaseHelper(supabaseClient);
  }
}
