'use client';

import {
	Home,
	Pen,
	MessageSquare,
	FileText,
	Upload,
	Link2,
	ChevronDown,
	Save,
	FileDown,
	Printer,
	CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

function Badge({
	count,
	variant = 'default',
}: {
	count?: number;
	variant?: 'default' | 'secondary';
}) {
	if (!count) return null;
	return (
		<div
			className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
				variant === 'secondary' ? 'bg-cyan-500' : 'bg-red-500'
			}`}
		>
			{count}
		</div>
	);
}

export function SalesOrderFooter2() {
	const dockItems = [
		{
			icon: Home,
			label: 'Home',
			href: '#',
			ariaLabel: 'Go to home',
		},
		{
			icon: Pen,
			label: 'Edit',
			href: '#',
			ariaLabel: 'Edit content',
		},
		{
			type: 'divider',
		},
		{
			icon: MessageSquare,
			label: 'History & Notes',
			badge: 1,
			ariaLabel: 'View history and notes',
		},
		{
			icon: FileText,
			label: 'Introduction',
			ariaLabel: 'View introduction',
		},
		{
			icon: Upload,
			label: 'Attachments',
			ariaLabel: 'View attachments',
		},
		{
			icon: Link2,
			label: 'Links',
			badge: 4,
			badgeVariant: 'secondary',
			ariaLabel: 'View links',
		},
	];

	const actionButtons = [
		{
			label: 'Save',
			icon: Save,
			variant: 'outline',
			ariaLabel: 'Save changes',
		},
		{
			label: 'Draft',
			icon: FileDown,
			variant: 'outline',
			ariaLabel: 'Save as draft',
		},
		{
			label: 'Print PDF',
			icon: Printer,
			hasDropdown: true,
			variant: 'outline',
			ariaLabel: 'Print as PDF',
		},
		{
			label: 'Save & Approve',
			icon: CheckCircle,
			variant: 'primary',
			hasDropdown: true,
			ariaLabel: 'Save and approve',
		},
	];

	return (
		<nav
			className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
			aria-label="Floating dock menu"
		>
			<div className="flex flex-col gap-4 px-4 py-4 bg-white border border-border rounded-2xl shadow-lg dark:bg-primary dark:border-border w-[95vw] sm:w-auto max-w-2xl">
				{/* Icons Section
				<div className="flex items-center gap-3 flex-wrap justify-center">
					{dockItems.map((item, index) => {
						if (item.type === 'divider') {
							return (
								<div
									key={index}
									className="w-px h-6 bg-border dark:bg-border opacity-50 mx-1"
								/>
							);
						}

						const IconComponent = item.icon;
						const isLink =
							typeof item.href === 'string' && item.href !== '#';

						if (isLink) {
							return (
								<Link
									key={index}
									href={item.href}
									className="relative p-2.5 text-foreground hover:text-primary dark:text-primary-foreground dark:hover:text-accent transition-colors duration-200 hover:bg-secondary rounded-lg dark:hover:bg-accent dark:hover:bg-opacity-20 flex-shrink-0"
									aria-label={item.ariaLabel}
									title={item.label}
								>
									<IconComponent className="w-5 h-5" />
									{item.badge && (
										<Badge
											count={item.badge}
											variant={item.badgeVariant}
										/>
									)}
								</Link>
							);
						}

						return (
							<button
								key={index}
								className="relative p-2.5 text-foreground hover:text-primary dark:text-primary-foreground dark:hover:text-accent transition-colors duration-200 hover:bg-secondary rounded-lg dark:hover:bg-accent dark:hover:bg-opacity-20 flex-shrink-0"
								aria-label={item.ariaLabel}
								title={item.label}
							>
								<IconComponent className="w-5 h-5" />
								{item.badge && (
									<Badge
										count={item.badge}
										variant={item.badgeVariant}
									/>
								)}
							</button>
						);
					})}
				</div> */}

				{/* Divider between icons and buttons
				<div className="w-full h-px bg-border dark:bg-border opacity-50" />

				<div className="flex flex-wrap gap-2 justify-center w-full">
					{actionButtons.map((btn, index) => (
						<div key={index} className="flex items-center gap-0">
							<button
								className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap flex items-center gap-2 ${
									btn.variant === 'primary'
										? 'bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600'
										: 'bg-background border border-input text-foreground hover:bg-secondary dark:bg-secondary dark:border-border'
								}`}
								aria-label={btn.ariaLabel}
							>
								{btn.icon && <btn.icon className="w-4 h-4" />}
								{btn.label}
							</button>

							{btn.hasDropdown && (
								<button
									className={`px-2.5 py-2 rounded-r-md transition-colors duration-200 flex-shrink-0 ${
										btn.variant === 'primary'
											? 'bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600'
											: 'bg-background border border-l-0 border-input text-foreground hover:bg-secondary dark:bg-secondary dark:border-border'
									}`}
									aria-label={`${btn.label} menu`}
								>
									<ChevronDown className="w-4 h-4" />
								</button>
							)}
						</div>
					))}
				</div> */}
			</div>
		</nav>
	);
}
