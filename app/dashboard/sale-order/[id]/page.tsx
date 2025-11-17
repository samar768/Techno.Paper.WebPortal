import Link from 'next/link';
import { Suspense } from 'react';
import { saleOrdersById } from '../data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SalesOrderHeader from '@/features/sales-order/SalesOrderHeader';
import SalesOrderDetails from '@/features/sales-order/SalesOrderDetails';
import SalesOrderTermsConditions from '@/features/sales-order/SalesOrderTermsConditions';
import SalesOrderExpenses from '@/features/sales-order/SalesOrderExpenses';
import SalesOrderFooterOption1 from '@/features/sales-order/SalesOrderFooter';
import { getSaleOrderLookups } from '@/lib/lookups';
import type { SaleOrderLookups } from '@/lib/lookup-types';

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

async function HeaderSection({
	lookupsPromise,
}: {
	lookupsPromise: Promise<SaleOrderLookups>;
}) {
	const lookups = await lookupsPromise;
	return <SalesOrderHeader lookups={lookups} />;
}

async function DetailsSection({
	lookupsPromise,
}: {
	lookupsPromise: Promise<SaleOrderLookups>;
}) {
	const lookups = await lookupsPromise;
	return <SalesOrderDetails lookups={lookups} />;
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

	const lookupsPromise = getSaleOrderLookups();

	return (
		<>
			<div className="pb-16">
				<Suspense
					fallback={
						<SectionSkeleton title="Sale Order Information" />
					}
				>
					<HeaderSection lookupsPromise={lookupsPromise} />
				</Suspense>
				<br />
				<Suspense
					fallback={<SectionSkeleton title="Sales Order Details" />}
				>
					<DetailsSection lookupsPromise={lookupsPromise} />
				</Suspense>
				<br />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<SalesOrderTermsConditions />
					<SalesOrderExpenses />
				</div>
				<SalesOrderFooterOption1 />
			</div>
		</>
	);
}
