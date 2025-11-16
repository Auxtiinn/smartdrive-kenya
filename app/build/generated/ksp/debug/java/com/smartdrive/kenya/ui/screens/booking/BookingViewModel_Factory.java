package com.smartdrive.kenya.ui.screens.booking;

import com.smartdrive.kenya.data.repository.RentalRepository;
import com.smartdrive.kenya.data.repository.VehicleRepository;
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
public final class BookingViewModel_Factory implements Factory<BookingViewModel> {
  private final Provider<RentalRepository> rentalRepositoryProvider;

  private final Provider<VehicleRepository> vehicleRepositoryProvider;

  public BookingViewModel_Factory(Provider<RentalRepository> rentalRepositoryProvider,
      Provider<VehicleRepository> vehicleRepositoryProvider) {
    this.rentalRepositoryProvider = rentalRepositoryProvider;
    this.vehicleRepositoryProvider = vehicleRepositoryProvider;
  }

  @Override
  public BookingViewModel get() {
    return newInstance(rentalRepositoryProvider.get(), vehicleRepositoryProvider.get());
  }

  public static BookingViewModel_Factory create(Provider<RentalRepository> rentalRepositoryProvider,
      Provider<VehicleRepository> vehicleRepositoryProvider) {
    return new BookingViewModel_Factory(rentalRepositoryProvider, vehicleRepositoryProvider);
  }

  public static BookingViewModel newInstance(RentalRepository rentalRepository,
      VehicleRepository vehicleRepository) {
    return new BookingViewModel(rentalRepository, vehicleRepository);
  }
}
