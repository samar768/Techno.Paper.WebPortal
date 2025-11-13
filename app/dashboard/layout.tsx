'use client';

import React, { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { TopNav } from '@/components/top-nav';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Lift sidebar collapsed state here so sibling components (TopNav and content)
	// can adapt layout. When collapsed is true we use a smaller left margin (ml-16),
	// otherwise the full sidebar width (ml-64).
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="min-h-screen w-full overflow-x-hidden bg-linear-to-br from-purple-950 via-purple-800 to-purple-600">
			<div className="flex min-h-screen min-w-0">
				<AppSidebar
					collapsed={collapsed}
					onToggle={() => setCollapsed((v) => !v)}
				/>
				<div
					className={`flex-1 min-w-0 flex flex-col ${
						collapsed ? 'ml-16' : 'ml-64'
					}`}
				>
					<TopNav collapsed={collapsed} />
					<main className="flex-1 p-6 min-w-0">{children}</main>
				</div>
			</div>
			<Toaster richColors />
		</div>
	);
}
