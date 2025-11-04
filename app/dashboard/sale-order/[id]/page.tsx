'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { saleOrdersById } from '../data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

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
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Link href="/dashboard/sale-order">
					<Button
						variant="outline"
						className="border-gray-500 text-gray-200 bg-gray-800"
					>
						Back
					</Button>
				</Link>
				<div className="flex items-center gap-2 text-xs">
					<Badge className="bg-emerald-600">HOLD</Badge>
					<Badge className="bg-gray-600">CLOSED</Badge>
					<Badge className="bg-red-600">CANCELLED</Badge>
					<Badge className="bg-blue-600">ACTIVE</Badge>
				</div>
			</div>

			<Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
				<CardHeader>
					<CardTitle className="text-white">
						Sales Order Entry
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Header fields */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{/* Left column */}
						<div className="space-y-2">
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Type</Label>
								<div className="col-span-2">
									<Input
										disabled
										value="Sales Order Local"
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									Order No.
								</Label>
								<div className="col-span-2 grid grid-cols-2 gap-2">
									<Input
										disabled
										value={order.orderNo}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
									<Input
										disabled
										value={order.orderDate}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Party</Label>
								<div className="col-span-2">
									<Input
										disabled
										value={order.party}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									Distributor
								</Label>
								<div className="col-span-2">
									<Input
										disabled
										value={order.distributor}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									Amendment Order
								</Label>
								<div className="col-span-2">
									<Input
										disabled
										value=""
										placeholder=""
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									Sale V_Type
								</Label>
								<div className="col-span-2">
									<Input
										disabled
										value="Con. Ref No."
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
						</div>

						{/* Right column */}
						<div className="space-y-2">
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									Party Order No.
								</Label>
								<div className="col-span-2">
									<Input
										disabled
										value={order.partyOrderNo}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									Against Form
								</Label>
								<div className="col-span-2">
									<Input
										disabled
										value={order.againstForm}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									Delivery To
								</Label>
								<div className="col-span-2">
									<Input
										disabled
										value={order.deliveryTo}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									Delivery Date
								</Label>
								<div className="col-span-2 grid grid-cols-2 gap-2">
									<Input
										disabled
										value={order.deliveryDate}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
									<Input
										disabled
										value={`Order Type: ${order.orderType}`}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									Consignee
								</Label>
								<div className="col-span-2">
									<Input
										disabled
										value={order.consignee}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">
									To Place
								</Label>
								<div className="col-span-2 grid grid-cols-2 gap-2">
									<Input
										disabled
										value={order.toPlace}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
									<Input
										disabled
										value={`Party Date ${order.partyDate} | Excisable: ${order.excisable}`}
										className="bg-purple-950/80 border-purple-700 text-white"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Items grid */}
					<div className="mt-2 rounded-lg border border-purple-800 overflow-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-gray-800/50 border-gray-700">
									{[
										'S. No.',
										'Item Name',
										'Description',
										'BF',
										'Width',
										'Length',
										'Unit',
										'Grain',
										'GSM',
										'Reel / Pack',
										'Weight (Sec. Unit)',
										'Sec. Unit',
										'Weight (SKU)',
										'Tol',
										'SKU',
										'Rate',
										'Amount',
										'OH',
										'Ad',
									].map((h) => (
										<TableHead
											key={h}
											className="text-gray-300 whitespace-nowrap"
										>
											{h}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{order.rows.map((row) => (
									<TableRow
										key={row.sn}
										className="border-gray-700"
									>
										<TableCell className="text-gray-200">
											{row.sn}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.itemName}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.description}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.bf}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.width}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.length}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.unit}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.grain}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.gsm}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.reelPack}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.weightSecUnit}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.secUnit}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.weightSku}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.tol}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.skuUnit}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.rate}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.amount}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.oh}
										</TableCell>
										<TableCell className="text-gray-300">
											{row.ad}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Totals strip */}
					<div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm">
						<div className="text-gray-200">Total</div>
						<div className="text-gray-200">
							Quantity : {order.totalQty}
						</div>
						<div className="text-gray-200">
							Weight : {order.totalWeight}
						</div>
					</div>

					{/* Bottom panels */}
					<div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div className="rounded-lg border border-purple-800">
							<div className="bg-gray-800/50 px-3 py-2 border-b border-purple-800 text-gray-200">
								Field Name
							</div>
							<div className="divide-y divide-purple-800/60">
								{[
									['Duty & taxes', order.dutyTaxes],
									['Freight', order.freight],
									['Remark', order.remark],
									['Delivery', order.delivery],
								].map(([k, v]) => (
									<div
										key={k}
										className="grid grid-cols-2 gap-2 px-3 py-2"
									>
										<div className="text-gray-300">{k}</div>
										<div className="text-gray-100">{v}</div>
									</div>
								))}
							</div>
						</div>
						<div className="rounded-lg border border-purple-800">
							<div className="bg-gray-800/50 px-3 py-2 border-b border-purple-800 text-gray-200">
								Heads
							</div>
							<div className="divide-y divide-purple-800/60">
								{[
									[
										'Gross Amount',
										'0.000',
										order.headGrossAmount,
									],
									[
										'Bill Amount',
										'0.000',
										order.headBillAmount,
									],
									['Round Off', '0.000', order.headRoundOff],
									[
										'Net Amount',
										'0.000',
										order.headNetAmount,
									],
								].map(([head, per, amt]) => (
									<div
										key={String(head)}
										className="grid grid-cols-3 gap-2 px-3 py-2"
									>
										<div className="text-gray-300">
											{head}
										</div>
										<div className="text-gray-300">
											{per}
										</div>
										<div className="text-gray-100">
											{amt}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
