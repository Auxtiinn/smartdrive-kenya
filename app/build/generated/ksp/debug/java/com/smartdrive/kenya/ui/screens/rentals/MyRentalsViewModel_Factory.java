package com.smartdrive.kenya.ui.screens.rentals;

import com.smartdrive.kenya.data.repository.AuthRepository;
import com.smartdrive.kenya.data.repository.RentalRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata
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
public final class MyRentalsViewModel_Factory implements Factory<MyRentalsViewModel> {
  private final Provider<RentalRepository> rentalRepositoryProvider;

  private final Provider<AuthRepository> authRepositoryProvider;

  public MyRentalsViewModel_Factory(Provider<RentalRepository> rentalRepositoryProvider,
      Provider<AuthRepository> authRepositoryProvider) {
    this.rentalRepositoryProvider = rentalRepositoryProvider;
    this.authRepositoryProvider = authRepositoryProvider;
  }

  @Override
  public MyRentalsViewModel get() {
    return newInstance(rentalRepositoryProvider.get(), authRepositoryProvider.get());
  }

  public static MyRentalsViewModel_Factory create(
      Provider<RentalRepository> rentalRepositoryProvider,
      Provider<AuthRepository> authRepositoryProvider) {
    return new MyRentalsViewModel_Factory(rentalRepositoryProvider, authRepositoryProvider);
  }

  public static MyRentalsViewModel newInstance(RentalRepository rentalRepository,
      AuthRepository authRepository) {
    return new MyRentalsViewModel(rentalRepository, authRepository);
  }
}
