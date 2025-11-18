import Link from 'next/link';
import { saleOrdersById } from '../data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSaleOrderLookups } from '@/lib/lookups';
import SalesOrderEditor from '@/features/sales-order/SalesOrderEditor';

function SectionSkeleton({ title }: { title: string }) {
	return (
		<Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-white">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-20 animate-pulse bg-gray-800/50 rounded" />
			</CardContent>
		</Card>
	);
}

export default async function SaleOrderDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: rawId } = await params;
	const id = decodeURIComponent(rawId ?? '');
	const order = saleOrdersById[id];

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

	const lookups = await getSaleOrderLookups();

	return (
		<div className="pb-16">
			<SalesOrderEditor lookups={lookups} />
		</div>
	);
}
