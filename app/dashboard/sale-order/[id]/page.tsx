'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { saleOrdersById } from '../data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SalesOrderHeader from '@/features/sales-order/SalesOrderHeader';
import SalesOrderDetails from '@/features/sales-order/SalesOrderDetails';
import SalesOrderTermsConditions from '@/features/sales-order/SalesOrderTermsConditions';
import SalesOrderExpenses from '@/features/sales-order/SalesOrderExpenses';
import SalesOrderFooterOption1, {
	SalesOrderFooterOption2,
} from '@/features/sales-order/SalesOrderFooter';
import { SalesOrderFooter2 } from '@/features/sales-order/SalesOrderFooter2';

export default function SaleOrderDetailPage() {
	const params = useParams();
	const rawId = String(params?.id ?? '');
	const id = decodeURIComponent(rawId);

	const order = useMemo(() => saleOrdersById[id], [id]);

	if (!order) {
		return (
			<div className="space-y-4">
				<Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-white">
								Sales Order
							</CardTitle>
							<Link href="/dashboard/sale-order">
								<Button className="bg-purple-600 hover:bg-purple-700">
									Back
								</Button>
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-gray-300">
							No order found for id:{' '}
							<span className="text-white font-medium">{id}</span>
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<>
			<div className="pb-16">
				<SalesOrderHeader />
				<br />
				<SalesOrderDetails />
				<br />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<SalesOrderTermsConditions />
					<SalesOrderExpenses />
				</div>
				<SalesOrderFooterOption1 />
			</div>

			{/*<SalesOrderFooterOption2 />*/}

			{/*<main className="flex min-h-screen flex-col items-center justify-center p-4">
				<div className="text-center space-y-4 max-w-2xl">
					<h1 className="text-4xl font-bold tracking-tight">
						Floating Dock Menu
					</h1>
					<p className="text-lg text-muted-foreground">
						Check out the dock menu fixed at the bottom of your
						screen. It features responsive design and smooth
						interactions.
					</p>
				</div>
				<SalesOrderFooter2 />
			</main>*/}
		</>
	);
}
