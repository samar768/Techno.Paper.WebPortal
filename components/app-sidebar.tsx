'use client';

import { Home, Package, Plus, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type IconType = typeof Home;

type MenuChild = {
	title: string;
	url: string;
	icon: IconType;
};

type MenuItem = {
	title: string;
	url: string;
	icon: IconType;
	children?: MenuChild[];
};

const menuItems: MenuItem[] = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: Home,
	},
	{
		title: 'Sale Order',
		url: '/dashboard/sale-order',
		icon: Package,
		children: [
			{
				title: 'All Orders',
				url: '/dashboard/sale-order',
				icon: Package,
			},
			{
				title: 'New Order',
				url: '/dashboard/sale-order/new',
				icon: Plus,
			},
		],
	},
	{
		title: 'Inventory',
		url: '/dashboard/inventory',
		icon: Package,
		children: [
			{ title: 'Overview', url: '/dashboard/inventory', icon: Package },
		],
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
		children: [
			{ title: 'Overview', url: '/dashboard/distribution', icon: Truck },
		],
	},
];

export function AppSidebar() {
	const pathname = usePathname();
	const [activeParent, setActiveParent] = useState<string | null>(null);

	const parentByChildUrl = useMemo(() => {
		const map = new Map<string, string>();
		for (const parent of menuItems) {
			if (parent.children) {
				for (const child of parent.children) {
					map.set(child.url, parent.url);
				}
			}
		}
		return map;
	}, []);

	useEffect(() => {
		// Keep submenu in sync with current route
		if (parentByChildUrl.has(pathname)) {
			setActiveParent(parentByChildUrl.get(pathname) || null);
			return;
		}
		const parent = menuItems.find(
			(m) => pathname.startsWith(m.url) && m.children?.length
		);
		setActiveParent(parent ? parent.url : null);
	}, [pathname, parentByChildUrl]);

	const activeParentItem = useMemo(
		() => menuItems.find((m) => m.url === activeParent),
		[activeParent]
	);

	return (
		<div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 border-r border-purple-800 backdrop-blur-sm z-50">
			{/* Header */}
			<div className="p-6 border-b border-purple-800">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
						<span className="text-white font-bold text-sm">PS</span>
					</div>
					<span className="text-white font-bold text-lg">
						PaperSoft
					</span>
				</div>
			</div>

			{/* Navigation */}
			<div className="px-4 py-4">
				<nav className="space-y-1">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.url;
						const hasChildren = !!item.children?.length;
						const isParentActive = activeParent === item.url;
						const baseClass = `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors`;
						const className =
							isActive || isParentActive
								? `${baseClass} bg-purple-600/50 text-white`
								: `${baseClass} text-gray-300 hover:text-white hover:bg-purple-600/30`;

						if (hasChildren) {
							return (
								<button
									key={item.title}
									type="button"
									className={className}
									onMouseEnter={() =>
										setActiveParent(item.url)
									}
									onClick={() =>
										setActiveParent((prev) =>
											prev === item.url ? null : item.url
										)
									}
								>
									<Icon className="h-4 w-4" />
									<span>{item.title}</span>
								</button>
							);
						}

						return (
							<Link
								key={item.title}
								href={item.url}
								className={className}
							>
								<Icon className="h-4 w-4" />
								<span>{item.title}</span>
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Sub Navigation (second panel) */}
			{activeParentItem?.children?.length ? (
				<div
					className="fixed left-64 top-0 h-full w-64 bg-gradient-to-b from-purple-500 via-purple-400 to-purple-500 border-r border-purple-400/70 backdrop-blur-sm z-40 shadow-xl shadow-purple-950/10 ring-1 ring-purple-400/40"
					onMouseLeave={() => setActiveParent(null)}
				>
					{/* Header mirrors parent */}
					<div className="p-6 border-b border-purple-400/60">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-purple-400 rounded-xl flex items-center justify-center">
								<span className="text-white font-bold text-sm">
									{activeParentItem.title
										.slice(0, 2)
										.toUpperCase()}
								</span>
							</div>
							<span className="text-white font-bold text-lg">
								{activeParentItem.title}
							</span>
						</div>
					</div>
					<div className="px-4 py-4">
						<nav className="space-y-1">
							{activeParentItem.children.map((child) => {
								const Icon = child.icon;
								const isActive = pathname === child.url;
								return (
									<Link
										key={child.title}
										href={child.url}
										className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
											isActive
												? 'bg-purple-400/50 text-white'
												: 'text-white/85 hover:text-white hover:bg-purple-400/30'
										}`}
									>
										<Icon className="h-4 w-4" />
										<span>{child.title}</span>
									</Link>
								);
							})}
						</nav>
					</div>
				</div>
			) : null}
		</div>
	);
}
