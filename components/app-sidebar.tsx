'use client';

import { Home, Package, Plus, Truck } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: Home,
	},
	{
		title: 'Sale Order',
		url: '/dashboard/sale-order',
		icon: Package,
	},
	{
		title: 'Inventory',
		url: '/dashboard/inventory',
		icon: Package,
	},
	{
		title: 'Add Roll',
		url: '/dashboard/add-roll',
		icon: Plus,
	},
	{
		title: 'Distribution',
		url: '/dashboard/distribution',
		icon: Truck,
	},
];

export function AppSidebar({
	collapsed,
	onToggle,
}: {
	collapsed: boolean;
	onToggle: () => void;
}) {
	const pathname = usePathname();

	return (
		<>
			<div
				className={`fixed left-0 top-0 h-full bg-linear-to-b from-purple-950 via-purple-900 to-purple-950 border-r border-purple-800 backdrop-blur-sm z-50 transition-all duration-200 ease-in-out overflow-hidden ${
					collapsed ? 'w-16' : 'w-64'
				}`}
			>
				{/* Header */}
				<div className="p-4 border-b border-purple-800">
					<div
						className={`flex items-center ${
							collapsed ? 'justify-center' : 'justify-between'
						} gap-3`}
					>
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
								<span className="text-white font-bold text-sm">
									PS
								</span>
							</div>
							{!collapsed && (
								<span className="text-white font-bold text-lg">
									PaperSoft
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Navigation */}
				<div className="px-2 py-4">
					<nav className="space-y-1">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.url;
							return (
								<Link
									key={item.title}
									href={item.url}
									title={item.title}
									className={`group flex items-center ${
										collapsed ? 'justify-center' : ''
									} gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
										isActive
											? 'bg-purple-600/50 text-white'
											: 'text-gray-300 hover:text-white hover:bg-purple-600/30'
									}`}
								>
									<Icon className="h-4 w-4 shrink-0" />
									{!collapsed && (
										<span className="truncate">
											{item.title}
										</span>
									)}
								</Link>
							);
						})}
					</nav>
				</div>
			</div>
			{/* Floating collapse/expand button remains */}
			<button
				aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				onClick={onToggle}
				className="fixed z-60 top-4 transition-all duration-200 shadow-lg border border-purple-800 bg-purple-800 text-white hover:bg-purple-700 flex items-center justify-center rounded-full"
				style={{
					left: collapsed ? '5rem' : '17rem',
					width: '2rem',
					height: '2rem',
				}}
			>
				{collapsed ? (
					<ChevronRight className="h-5 w-5" />
				) : (
					<ChevronLeft className="h-5 w-5" />
				)}
			</button>
		</>
	);
}
