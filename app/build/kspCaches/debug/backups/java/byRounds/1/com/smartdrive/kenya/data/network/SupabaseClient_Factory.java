package com.smartdrive.kenya.data.network;

import android.content.Context;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata("dagger.hilt.android.qualifiers.ApplicationContext")
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
public final class SupabaseClient_Factory implements Factory<SupabaseClient> {
  private final Provider<Context> contextProvider;

  public SupabaseClient_Factory(Provider<Context> contextProvider) {
    this.contextProvider = contextProvider;
  }

  @Override
  public SupabaseClient get() {
    return newInstance(contextProvider.get());
  }

  public static SupabaseClient_Factory create(Provider<Context> contextProvider) {
    return new SupabaseClient_Factory(contextProvider);
  }

  public static SupabaseClient newInstance(Context context) {
    return new SupabaseClient(context);
  }
}
