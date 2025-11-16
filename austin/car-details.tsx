<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>CarDetails</title>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link
			href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
			rel="stylesheet"
		>
		<link
			href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap"
			rel="stylesheet"
		>
		<link
			href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
			rel="stylesheet"
		>
		<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
		<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
		<style type="text/tailwindcss">
		@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --font-font-sans: var(--font-sans);
  --font-font-heading: var(--font-heading);
  --font-font-serif: var(--font-serif);
  --font-font-mono: var(--font-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
  --tracking-normal: var(--tracking-normal);
}

		:root {
			--background: #f8fafc;
			--foreground: #0f172a;
			--primary: #2563eb;
			--primary-foreground: #ffffff;
			--secondary: #f1f5f9;
			--secondary-foreground: #1e293b;
			--muted: #f1f5f9;
			--muted-foreground: #64748b;
			--accent: #3b82f6;
			--accent-foreground: #ffffff;
			--destructive: #dc2626;
			--card: #ffffff;
			--card-foreground: #0f172a;
			--popover: #ffffff;
			--popover-foreground: #0f172a;
			--border: #e2e8f0;
			--input: #ffffff;
			--ring: #2563eb;
			--sidebar: #ffffff;
			--sidebar-foreground: #475569;
			--sidebar-primary: #2563eb;
			--sidebar-primary-foreground: #ffffff;
			--sidebar-accent: #f1f5f9;
			--sidebar-accent-foreground: #1e293b;
			--sidebar-border: #e2e8f0;
			--sidebar-ring: #2563eb;
			--chart-1: #2563eb;
			--chart-2: #10b981;
			--chart-3: #f59e0b;
			--chart-4: #8b5cf6;
			--chart-5: #ec4899;

			--font-sans: "Inter";
			--font-heading: "Inter";
			--font-serif: "Playfair Display";
			--font-mono: "JetBrains Mono";

			--radius: 0.5rem;
		}
		</style>
	</head>
	<body>
		<div class="flex flex-col min-h-screen bg-background">
			<div class="px-4 py-3 bg-card border-b border-border">
				<div class="flex items-center justify-between">
					<button class="flex items-center justify-center size-11">
						<iconify-icon
							icon="solar:arrow-left-linear"
							class="size-6 text-foreground"
						></iconify-icon>
					</button>
					<h1 class="text-lg font-semibold font-heading text-foreground">Car Details</h1>
					<button class="flex items-center justify-center size-11">
						<iconify-icon
							icon="solar:heart-bold"
							class="size-6 text-muted-foreground"
						></iconify-icon>
					</button>
				</div>
			</div>
			<div class="flex-1 overflow-y-auto pb-32">
				<div class="relative bg-secondary">
					<div class="aspect-[16/10] overflow-hidden">
						<img
							alt="Toyota Camry"
							src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&amp;q=80"
							class="w-full h-full object-cover"
						>
					</div>
					<div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
						<div class="size-2 rounded-full bg-primary"/>
						<div class="size-2 rounded-full bg-white opacity-50"/>
						<div class="size-2 rounded-full bg-white opacity-50"/>
						<div class="size-2 rounded-full bg-white opacity-50"/>
					</div>
				</div>
				<div class="p-4 space-y-6">
					<div>
						<div class="flex items-start justify-between mb-2">
							<div class="flex-1">
								<h2 class="text-2xl font-bold font-heading text-foreground mb-2">
									Toyota Camry 2024
								</h2>
								<div class="flex items-center gap-2">
									<span
										class="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full"
										>Sedan</span
									>
									<div class="flex items-center gap-1">
										<iconify-icon
											icon="solar:star-bold"
											class="size-5 text-[#F59E0B] [&amp;&gt;path]:fill-[#F59E0B]"
										></iconify-icon>
										<iconify-icon
											icon="solar:star-bold"
											class="size-5 text-[#F59E0B] [&amp;&gt;path]:fill-[#F59E0B]"
										></iconify-icon>
										<iconify-icon
											icon="solar:star-bold"
											class="size-5 text-[#F59E0B] [&amp;&gt;path]:fill-[#F59E0B]"
										></iconify-icon>
										<iconify-icon
											icon="solar:star-bold"
											class="size-5 text-[#F59E0B] [&amp;&gt;path]:fill-[#F59E0B]"
										></iconify-icon>
										<iconify-icon
											icon="solar:star-bold"
											class="size-5 text-muted-foreground/30 [&amp;&gt;path]:fill-muted-foreground/30]"
										></iconify-icon>
										<span class="text-sm font-medium text-foreground ml-1">4.8</span><span
											class="text-sm text-muted-foreground"
											>(124)</span
										>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-card rounded-2xl shadow-sm p-5">
						<h3 class="text-lg font-bold font-heading text-foreground mb-4">Specifications</h3>
						<div class="grid grid-cols-2 gap-4">
							<div class="flex items-center gap-3">
								<div class="size-11 rounded-xl bg-secondary flex items-center justify-center">
									<iconify-icon
										icon="solar:users-group-rounded-bold"
										class="size-6 text-primary"
									></iconify-icon>
								</div>
								<div>
									<p class="text-sm text-muted-foreground">Passengers</p>
									<p class="font-semibold text-foreground">5 People</p>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-11 rounded-xl bg-secondary flex items-center justify-center">
									<iconify-icon icon="solar:bag-bold" class="size-6 text-primary"></iconify-icon>
								</div>
								<div>
									<p class="text-sm text-muted-foreground">Luggage</p>
									<p class="font-semibold text-foreground">3 Bags</p>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-11 rounded-xl bg-secondary flex items-center justify-center">
									<iconify-icon
										icon="solar:settings-bold"
										class="size-6 text-primary"
									></iconify-icon>
								</div>
								<div>
									<p class="text-sm text-muted-foreground">Transmission</p>
									<p class="font-semibold text-foreground">Automatic</p>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-11 rounded-xl bg-secondary flex items-center justify-center">
									<iconify-icon icon="solar:fuel-bold" class="size-6 text-primary"></iconify-icon>
								</div>
								<div>
									<p class="text-sm text-muted-foreground">Fuel Type</p>
									<p class="font-semibold text-foreground">Gasoline</p>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-11 rounded-xl bg-secondary flex items-center justify-center">
									<iconify-icon
										icon="solar:speedometer-bold"
										class="size-6 text-primary"
									></iconify-icon>
								</div>
								<div>
									<p class="text-sm text-muted-foreground">Mileage</p>
									<p class="font-semibold text-foreground">32 MPG</p>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-card rounded-2xl shadow-sm p-5">
						<h3 class="text-lg font-bold font-heading text-foreground mb-4">
							Features &amp; Amenities
						</h3>
						<div class="space-y-3">
							<div class="flex items-center gap-3">
								<div class="size-6 rounded-full bg-primary/10 flex items-center justify-center">
									<iconify-icon
										icon="solar:check-circle-bold"
										class="size-5 text-primary"
									></iconify-icon>
								</div>
								<span class="text-foreground">Air Conditioning</span>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-6 rounded-full bg-primary/10 flex items-center justify-center">
									<iconify-icon
										icon="solar:check-circle-bold"
										class="size-5 text-primary"
									></iconify-icon>
								</div>
								<span class="text-foreground">GPS Navigation</span>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-6 rounded-full bg-primary/10 flex items-center justify-center">
									<iconify-icon
										icon="solar:check-circle-bold"
										class="size-5 text-primary"
									></iconify-icon>
								</div>
								<span class="text-foreground">Bluetooth Audio</span>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-6 rounded-full bg-primary/10 flex items-center justify-center">
									<iconify-icon
										icon="solar:check-circle-bold"
										class="size-5 text-primary"
									></iconify-icon>
								</div>
								<span class="text-foreground">USB Charging Ports</span>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-6 rounded-full bg-primary/10 flex items-center justify-center">
									<iconify-icon
										icon="solar:check-circle-bold"
										class="size-5 text-primary"
									></iconify-icon>
								</div>
								<span class="text-foreground">Backup Camera</span>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-6 rounded-full bg-primary/10 flex items-center justify-center">
									<iconify-icon
										icon="solar:check-circle-bold"
										class="size-5 text-primary"
									></iconify-icon>
								</div>
								<span class="text-foreground">Cruise Control</span>
							</div>
						</div>
					</div>
					<div class="bg-card rounded-2xl shadow-sm p-5">
						<h3 class="text-lg font-bold font-heading text-foreground mb-4">Pricing Breakdown</h3>
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-foreground">Daily Rate</span><span
									class="font-semibold text-foreground"
									>$49.00</span
								>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-foreground">Rental Period (3 days)</span><span
									class="font-semibold text-foreground"
									>$147.00</span
								>
							</div>
							<div class="border-t border-border pt-3">
								<div class="flex items-center justify-between mb-3">
									<span class="text-foreground font-medium">Insurance Options</span>
								</div>
								<div class="space-y-3">
									<div class="flex items-center gap-3 p-3 bg-secondary rounded-xl">
										<div class="size-5 rounded bg-primary flex items-center justify-center">
											<iconify-icon
												icon="solar:check-circle-bold"
												class="size-4 text-primary-foreground"
											></iconify-icon>
										</div>
										<div class="flex-1">
											<p class="font-semibold text-foreground text-sm">Basic Coverage</p>
											<p class="text-xs text-muted-foreground">Included in rental</p>
										</div>
										<span class="font-semibold text-foreground">$0.00</span>
									</div>
									<div class="flex items-center gap-3 p-3 border border-border rounded-xl">
										<div class="size-5 rounded border-2 border-muted-foreground"/>
										<div class="flex-1">
											<p class="font-semibold text-foreground text-sm">Premium Coverage</p>
											<p class="text-xs text-muted-foreground">Full protection upgrade</p>
										</div>
										<span class="font-semibold text-foreground">+$15.00/day</span>
									</div>
								</div>
							</div>
							<div class="border-t border-border pt-3 mt-3">
								<div class="flex items-center justify-between">
									<span class="text-lg font-bold font-heading text-foreground"
										>Estimated Total</span
									><span class="text-2xl font-bold font-heading text-primary">$147.00</span>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-card rounded-2xl shadow-sm p-5">
						<h3 class="text-lg font-bold font-heading text-foreground mb-4">Pickup &amp; Return</h3>
						<div class="space-y-4">
							<div>
								<div class="flex items-center gap-2 mb-2">
									<iconify-icon
										icon="solar:map-point-bold"
										class="size-5 text-primary"
									></iconify-icon>
									<span class="font-semibold text-foreground">Pickup Location</span>
								</div>
								<p class="text-sm text-muted-foreground pl-7">
									Los Angeles International Airport (LAX)
								</p>
								<p class="text-sm text-muted-foreground pl-7">Jan 15, 2024 at 10:00 AM</p>
							</div>
							<div class="border-t border-border pt-4">
								<div class="flex items-center gap-2 mb-2">
									<iconify-icon
										icon="solar:map-point-bold"
										class="size-5 text-accent"
									></iconify-icon>
									<span class="font-semibold text-foreground">Return Location</span>
								</div>
								<p class="text-sm text-muted-foreground pl-7">
									Los Angeles International Airport (LAX)
								</p>
								<p class="text-sm text-muted-foreground pl-7">Jan 18, 2024 at 10:00 AM</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-background via-background to-transparent pt-6"
			>
				<button
					class="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-lg"
				>
					Book Now
				</button>
			</div>
			<div class="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
				<div class="grid grid-cols-4 h-20">
					<button class="flex flex-col items-center justify-center gap-1 text-muted-foreground">
						<iconify-icon icon="solar:home-2-bold" class="size-6"></iconify-icon>
						<span class="text-xs font-medium">Home</span>
					</button>
					<button class="flex flex-col items-center justify-center gap-1 text-muted-foreground">
						<iconify-icon icon="solar:magnifer-linear" class="size-6"></iconify-icon>
						<span class="text-xs font-medium">Browse</span>
					</button>
					<button class="flex flex-col items-center justify-center gap-1 text-muted-foreground">
						<iconify-icon icon="solar:calendar-bold" class="size-6"></iconify-icon>
						<span class="text-xs font-medium">Bookings</span>
					</button>
					<button class="flex flex-col items-center justify-center gap-1 text-muted-foreground">
						<iconify-icon icon="solar:user-bold" class="size-6"></iconify-icon>
						<span class="text-xs font-medium">Profile</span>
					</button>
				</div>
			</div>
		</div>
	</body>
</html>
