import { Icon } from "@iconify/react";

export function Home() {
	return (
		<div className="flex flex-col min-h-screen bg-background">
			<div className="px-4 py-4 bg-card border-b border-border">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="size-10 rounded-xl bg-primary flex items-center justify-center">
							<Icon icon="solar:car-bold" className="size-6 text-primary-foreground" />
						</div>
						<h1 className="text-xl font-bold font-heading text-foreground">CarRental</h1>
					</div>
					<button className="size-11 flex items-center justify-center">
						<Icon icon="solar:hamburger-menu-bold" className="size-6 text-foreground" />
					</button>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto pb-20">
				<div className="p-4">
					<div className="bg-card rounded-2xl shadow-lg p-5 space-y-4">
						<h2 className="text-2xl font-bold font-heading text-foreground">
							Find Your Perfect Ride
						</h2>
						<div className="space-y-3">
							<div>
								<label className="block text-sm font-medium text-muted-foreground mb-2">
									Pickup Location
								</label>
								<div className="relative">
									<div className="absolute left-4 top-1/2 -translate-y-1/2">
										<Icon icon="solar:map-point-bold" className="size-5 text-primary" />
									</div>
									<input
										type="text"
										className="w-full pl-12 pr-4 py-4 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground"
										placeholder="Enter pickup location"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-muted-foreground mb-2">
									Drop-off Location
								</label>
								<div className="relative">
									<div className="absolute left-4 top-1/2 -translate-y-1/2">
										<Icon icon="solar:map-point-bold" className="size-5 text-accent" />
									</div>
									<input
										type="text"
										className="w-full pl-12 pr-4 py-4 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground"
										placeholder="Enter drop-off location"
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-sm font-medium text-muted-foreground mb-2">
										Pickup Date
									</label>
									<div className="relative">
										<div className="absolute left-3 top-1/2 -translate-y-1/2">
											<Icon icon="solar:calendar-bold" className="size-5 text-muted-foreground" />
										</div>
										<input
											type="text"
											className="w-full pl-11 pr-3 py-3 rounded-xl bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground"
											placeholder="Select date"
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-muted-foreground mb-2">
										Pickup Time
									</label>
									<div className="relative">
										<div className="absolute left-3 top-1/2 -translate-y-1/2">
											<Icon
												icon="solar:clock-circle-bold"
												className="size-5 text-muted-foreground"
											/>
										</div>
										<input
											type="text"
											className="w-full pl-11 pr-3 py-3 rounded-xl bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground"
											placeholder="Select time"
										/>
									</div>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-sm font-medium text-muted-foreground mb-2">
										Return Date
									</label>
									<div className="relative">
										<div className="absolute left-3 top-1/2 -translate-y-1/2">
											<Icon icon="solar:calendar-bold" className="size-5 text-muted-foreground" />
										</div>
										<input
											type="text"
											className="w-full pl-11 pr-3 py-3 rounded-xl bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground"
											placeholder="Select date"
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-muted-foreground mb-2">
										Return Time
									</label>
									<div className="relative">
										<div className="absolute left-3 top-1/2 -translate-y-1/2">
											<Icon
												icon="solar:clock-circle-bold"
												className="size-5 text-muted-foreground"
											/>
										</div>
										<input
											type="text"
											className="w-full pl-11 pr-3 py-3 rounded-xl bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground"
											placeholder="Select time"
										/>
									</div>
								</div>
							</div>
							<button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-md flex items-center justify-center gap-2">
								<Icon icon="solar:magnifer-linear" className="size-6" />
								Search Cars
							</button>
						</div>
					</div>
				</div>
				<div className="px-4 pb-4">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-bold font-heading text-foreground">Featured Categories</h2>
						<button className="text-primary font-semibold text-sm">View All</button>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="bg-card rounded-2xl overflow-hidden shadow-sm">
							<div className="aspect-[4/3] bg-secondary">
								<img
									alt="Economy"
									src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="p-4">
								<h3 className="font-semibold text-foreground mb-1">Economy</h3>
								<p className="text-sm text-muted-foreground">From $29/day</p>
							</div>
						</div>
						<div className="bg-card rounded-2xl overflow-hidden shadow-sm">
							<div className="aspect-[4/3] bg-secondary">
								<img
									alt="SUV"
									src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="p-4">
								<h3 className="font-semibold text-foreground mb-1">SUV</h3>
								<p className="text-sm text-muted-foreground">From $59/day</p>
							</div>
						</div>
						<div className="bg-card rounded-2xl overflow-hidden shadow-sm">
							<div className="aspect-[4/3] bg-secondary">
								<img
									alt="Luxury"
									src="https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&q=80"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="p-4">
								<h3 className="font-semibold text-foreground mb-1">Luxury</h3>
								<p className="text-sm text-muted-foreground">From $129/day</p>
							</div>
						</div>
						<div className="bg-card rounded-2xl overflow-hidden shadow-sm">
							<div className="aspect-[4/3] bg-secondary">
								<img
									alt="Electric"
									src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="p-4">
								<h3 className="font-semibold text-foreground mb-1">Electric</h3>
								<p className="text-sm text-muted-foreground">From $79/day</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
				<div className="grid grid-cols-4 h-20">
					<button className="flex flex-col items-center justify-center gap-1 text-primary">
						<Icon icon="solar:home-2-bold" className="size-6" />
						<span className="text-xs font-medium">Home</span>
					</button>
					<button className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
						<Icon icon="solar:magnifer-linear" className="size-6" />
						<span className="text-xs font-medium">Browse</span>
					</button>
					<button className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
						<Icon icon="solar:calendar-bold" className="size-6" />
						<span className="text-xs font-medium">Bookings</span>
					</button>
					<button className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
						<Icon icon="solar:user-bold" className="size-6" />
						<span className="text-xs font-medium">Profile</span>
					</button>
				</div>
			</div>
		</div>
	);
}
