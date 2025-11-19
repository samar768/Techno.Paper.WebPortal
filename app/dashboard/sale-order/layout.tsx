import { Suspense } from 'react';
import { getSaleOrderLookups } from '@/lib/lookups';

async function WarmSaleOrderLookups() {
	// Warm all sale-order lookups without blocking the rest of the layout
	await getSaleOrderLookups();
	return null;
}

export default function SaleOrderLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Suspense fallback={null}>
				{/* Non-blocking cache warm via Suspense + streaming */}
				<WarmSaleOrderLookups />
			</Suspense>
			{children}
		</>
	);
}
