'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export default function NewSaleOrderPage() {
	const router = useRouter();
	const { toast } = useToast();

	// Simple local state for all text fields (mock capture only)
	const [form, setForm] = useState({
		type: 'Sales Order Local',
		orderNo: '',
		orderDate: '',
		party: '',
		distributor: '',
		partyOrderNo: '',
		againstForm: '',
		deliveryTo: '',
		deliveryDate: '',
		orderType: 'Paper',
		consignee: '',
		toPlace: '',
		partyDate: '',
		excisable: 'Yes',
		dutyTaxes: '',
		freight: '',
		remark: '',
		delivery: '',
		headGrossAmount: '',
		headBillAmount: '',
		headRoundOff: '',
		headNetAmount: '',
		totalQty: '',
		totalWeight: '',
	});

	const [rows, setRows] = useState(
		Array.from({ length: 4 }).map((_, i) => ({
			sn: i + 1,
			itemName: '',
			description: '',
			bf: '',
			width: '',
			length: '',
			unit: '',
			grain: '',
			gsm: '',
			reelPack: '',
			weightSecUnit: '',
			secUnit: '',
			weightSku: '',
			tol: '',
			skuUnit: '',
			rate: '',
			amount: '',
			oh: '',
			ad: '',
		}))
	);

	const handleChange = (field: string, value: string) =>
		setForm((prev) => ({ ...prev, [field]: value }));

	const handleRowChange = (index: number, field: string, value: string) =>
		setRows((prev) => {
			const copy = [...prev];
			copy[index] = { ...copy[index], [field]: value } as any;
			return copy;
		});

	const handleCancel = () => router.push('/dashboard/sale-order');

	const handleSave = () => {
		toast({
			title: 'Sale order captured',
			description: 'Your entry was captured (mock). Returning to list...',
			className: 'bg-green-600 text-white border-green-700',
		});
		router.push('/dashboard/sale-order');
	};

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
					<CardTitle className="text-white">New Sales Order</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Header fields */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{/* Left column */}
						<div className="space-y-2">
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Type</Label>
								<div className="col-span-2">
									<Input value={form.type} onChange={(e) => handleChange('type', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Order No.</Label>
								<div className="col-span-2 grid grid-cols-2 gap-2">
									<Input value={form.orderNo} onChange={(e) => handleChange('orderNo', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
									<Input value={form.orderDate} onChange={(e) => handleChange('orderDate', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Party</Label>
								<div className="col-span-2">
									<Input value={form.party} onChange={(e) => handleChange('party', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Distributor</Label>
								<div className="col-span-2">
									<Input value={form.distributor} onChange={(e) => handleChange('distributor', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Amendment Order</Label>
								<div className="col-span-2">
									<Input value={form.remark} onChange={(e) => handleChange('remark', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Sale V_Type</Label>
								<div className="col-span-2">
									<Input value={'Con. Ref No.'} onChange={(e) => handleChange('saleVType' as any, e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
						</div>

						{/* Right column */}
						<div className="space-y-2">
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Party Order No.</Label>
								<div className="col-span-2">
									<Input value={form.partyOrderNo} onChange={(e) => handleChange('partyOrderNo', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Against Form</Label>
								<div className="col-span-2">
									<Input value={form.againstForm} onChange={(e) => handleChange('againstForm', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Delivery To</Label>
								<div className="col-span-2">
									<Input value={form.deliveryTo} onChange={(e) => handleChange('deliveryTo', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Delivery Date</Label>
								<div className="col-span-2 grid grid-cols-2 gap-2">
									<Input value={form.deliveryDate} onChange={(e) => handleChange('deliveryDate', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
									<Input value={form.orderType} onChange={(e) => handleChange('orderType', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">Consignee</Label>
								<div className="col-span-2">
									<Input value={form.consignee} onChange={(e) => handleChange('consignee', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<Label className="text-gray-300">To Place</Label>
								<div className="col-span-2 grid grid-cols-2 gap-2">
									<Input value={form.toPlace} onChange={(e) => handleChange('toPlace', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
									<Input value={form.partyDate} onChange={(e) => handleChange('partyDate', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
								</div>
							</div>
						</div>
					</div>

					{/* Items grid (text capture) */}
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
										<TableHead key={h} className="text-gray-300 whitespace-nowrap">
											{h}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((row, idx) => (
									<TableRow key={row.sn} className="border-gray-700">
										<TableCell className="text-gray-200">{row.sn}</TableCell>
										<TableCell className="text-gray-300"><Input value={row.itemName} onChange={(e) => handleRowChange(idx, 'itemName', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.description} onChange={(e) => handleRowChange(idx, 'description', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.bf} onChange={(e) => handleRowChange(idx, 'bf', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.width} onChange={(e) => handleRowChange(idx, 'width', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.length} onChange={(e) => handleRowChange(idx, 'length', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.unit} onChange={(e) => handleRowChange(idx, 'unit', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.grain} onChange={(e) => handleRowChange(idx, 'grain', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.gsm} onChange={(e) => handleRowChange(idx, 'gsm', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.reelPack} onChange={(e) => handleRowChange(idx, 'reelPack', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.weightSecUnit} onChange={(e) => handleRowChange(idx, 'weightSecUnit', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.secUnit} onChange={(e) => handleRowChange(idx, 'secUnit', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.weightSku} onChange={(e) => handleRowChange(idx, 'weightSku', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.tol} onChange={(e) => handleRowChange(idx, 'tol', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.skuUnit} onChange={(e) => handleRowChange(idx, 'skuUnit', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.rate} onChange={(e) => handleRowChange(idx, 'rate', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.amount} onChange={(e) => handleRowChange(idx, 'amount', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.oh} onChange={(e) => handleRowChange(idx, 'oh', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
										<TableCell className="text-gray-300"><Input value={row.ad} onChange={(e) => handleRowChange(idx, 'ad', e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" /></TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Totals strip */}
					<div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm">
						<div className="text-gray-200">Total</div>
						<div className="text-gray-200">Quantity : {form.totalQty}</div>
						<div className="text-gray-200">Weight : {form.totalWeight}</div>
					</div>

					{/* Bottom panels */}
					<div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div className="rounded-lg border border-purple-800">
							<div className="bg-gray-800/50 px-3 py-2 border-b border-purple-800 text-gray-200">
								Field Name
							</div>
							<div className="divide-y divide-purple-800/60">
								{[
									['Duty & taxes', 'dutyTaxes'],
									['Freight', 'freight'],
									['Remark', 'remark'],
									['Delivery', 'delivery'],
								].map(([label, key]) => (
									<div key={String(key)} className="grid grid-cols-2 gap-2 px-3 py-2">
										<div className="text-gray-300">{label}</div>
										<div className="text-gray-100">
											<Input value={(form as any)[key]} onChange={(e) => handleChange(String(key), e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="rounded-lg border border-purple-800">
							<div className="bg-gray-800/50 px-3 py-2 border-b border-purple-800 text-gray-200">Heads</div>
							<div className="divide-y divide-purple-800/60">
								{[
									['Gross Amount', 'headGrossAmount'],
									['Bill Amount', 'headBillAmount'],
									['Round Off', 'headRoundOff'],
									['Net Amount', 'headNetAmount'],
								].map(([label, key]) => (
									<div key={String(label)} className="grid grid-cols-3 gap-2 px-3 py-2">
										<div className="text-gray-300">{label}</div>
										<div className="text-gray-300">0.000</div>
										<div className="text-gray-100">
											<Input value={(form as any)[key]} onChange={(e) => handleChange(String(key), e.target.value)} className="bg-purple-950/80 border-purple-700 text-white" />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Footer actions */}
					<div className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={handleCancel}
							className="border-gray-500 text-gray-300 bg-gray-800"
						>
							Cancel
						</Button>
						<Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
							Save
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


