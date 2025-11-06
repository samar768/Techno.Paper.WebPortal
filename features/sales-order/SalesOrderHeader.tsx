'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type YesNo = 'Y' | 'N';

type SalesOrderHeaderForm = {
	voucherType: string; // required
	orderNo: string; // number (string to keep input friendly)
	date: string; // datetime-local
	partyOrderNo: string;
	partyDate: string; // date
	exciseable: YesNo;
	existingOrder: string;
	party: string; // required
	deliveryTo: string;
	deliveryDate: string; // date
	orderType: string; // required
	consignee: string; // required
	saleVType: string; // required
	remark: string;
	distributor: string;
	toPlace: string;
	preparedBy: string;
	modifiedBy: string;
	approvedBy: string;
	bookedBy: string;
	closed: boolean;
};

const initialForm: SalesOrderHeaderForm = {
	voucherType: '',
	orderNo: '',
	date: '',
	partyOrderNo: '',
	partyDate: '',
	exciseable: 'Y',
	existingOrder: '',
	party: '',
	deliveryTo: '',
	deliveryDate: '',
	orderType: '',
	consignee: '',
	saleVType: '',
	remark: '',
	distributor: '',
	toPlace: '',
	preparedBy: '',
	modifiedBy: '',
	approvedBy: '',
	bookedBy: '',
	closed: false,
};

export default function SalesOrderHeader() {
	const [form, setForm] = useState<SalesOrderHeaderForm>(initialForm);

	const handleChange = useCallback(
		(field: keyof SalesOrderHeaderForm, value: string | boolean) => {
			setForm((prev) => ({ ...prev, [field]: value }));
		},
		[]
	);

	const requiredErrors = useMemo(() => {
		const errors: string[] = [];
		if (!form.voucherType) errors.push('Voucher Type is required');
		if (!form.orderNo || Number.parseInt(form.orderNo) <= 0)
			errors.push('Order No must be greater than 0');
		if (!form.partyOrderNo || Number.parseInt(form.partyOrderNo) <= 0)
			errors.push('Party Order No must be greater than 0');
		if (!form.date) errors.push('Date is required');
		if (!form.party) errors.push('Party is required');
		if (!form.deliveryDate) errors.push('Delivery Date is required');
		if (!form.orderType) errors.push('Order Type is required');
		if (!form.consignee) errors.push('Consignee is required');
		if (!form.saleVType) errors.push('Sale V_Type is required');
		return errors;
	}, [form]);

	const handleSubmit = useCallback(() => {
		if (requiredErrors.length > 0) {
			toast.error(requiredErrors.join('\n'));
			return;
		}
		toast.success('Sales Order Header saved');
	}, [requiredErrors]);

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
				<div className="flex gap-2">
					<Button
						className="bg-purple-600 hover:bg-purple-700 text-white"
						onClick={handleSubmit}
					>
						Save
					</Button>
				</div>
			</div>

			<Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
				<CardHeader>
					<CardTitle className="text-white text-xl">
						Sales Order Header Details
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Unified 12-column grid to match screenshot spacing */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
						{/* Voucher Type */}
						<div className="space-y-2 lg:col-span-6">
							<Label className="text-gray-300">
								Voucher Type{' '}
								<span className="text-red-400">*</span>
							</Label>
							<Select
								value={form.voucherType}
								onValueChange={(v) =>
									handleChange('voucherType', v)
								}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select voucher type" />
								</SelectTrigger>
								<SelectContent className="bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="SOGST">
										SOGST - Sale Order Against GST
									</SelectItem>
									<SelectItem value="SOGST-RET">
										SOGST-RET - Sale Order Return
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{/* Party Order No */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">
								Party Order No{' '}
								<span className="text-red-400">*</span>
							</Label>
							<Input
								type="number"
								placeholder="1"
								value={form.partyOrderNo}
								onChange={(e) =>
									handleChange('partyOrderNo', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>
						{/* Party Date */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">Party Date</Label>
							<Input
								type="date"
								value={form.partyDate}
								onChange={(e) =>
									handleChange('partyDate', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
							/>
						</div>
						{/* Order No */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">
								Order No <span className="text-red-400">*</span>
							</Label>
							<Input
								type="number"
								placeholder="1"
								value={form.orderNo}
								onChange={(e) =>
									handleChange('orderNo', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>

						{/* Date */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">
								Date <span className="text-red-400">*</span>
							</Label>
							<Input
								type="datetime-local"
								value={form.date}
								onChange={(e) =>
									handleChange('date', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
							/>
						</div>

						{/* Exciseable */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">Exciseable</Label>
							<Select
								value={form.exciseable}
								onValueChange={(v) =>
									handleChange('exciseable', v)
								}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="Y">Y - Yes</SelectItem>
									<SelectItem value="N">N - No</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{/* Existing Order */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">
								Existing Order
							</Label>
							<Select
								value={form.existingOrder}
								onValueChange={(v) =>
									handleChange('existingOrder', v)
								}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select a value" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="none">None</SelectItem>
									<SelectItem value="EO-1001">
										EO-1001
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Party */}
						<div className="space-y-2 lg:col-span-6">
							<Label className="text-gray-300">Party</Label>
							<Select
								value={form.party}
								onValueChange={(v) => handleChange('party', v)}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select a party" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="HO10279">
										HO10279 - 3K PACK PRO
									</SelectItem>
									<SelectItem value="HO28341">
										HO28341 - Paper Co.
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Delivery To */}
						<div className="space-y-2 lg:col-span-6">
							<Label className="text-gray-300">Delivery To</Label>
							<Select
								value={form.deliveryTo}
								onValueChange={(v) =>
									handleChange('deliveryTo', v)
								}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select a value" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="main">
										Main Warehouse
									</SelectItem>
									<SelectItem value="branch-a">
										Branch A
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Distributor */}
						<div className="space-y-2 lg:col-span-6">
							<Label className="text-gray-300">Distributor</Label>
							<Input
								placeholder="Distributor name"
								value={form.distributor}
								onChange={(e) =>
									handleChange('distributor', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>

						{/* Delivery Date */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">
								Delivery Date{' '}
								<span className="text-red-400">*</span>
							</Label>
							<Input
								type="date"
								value={form.deliveryDate}
								onChange={(e) =>
									handleChange('deliveryDate', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
							/>
						</div>

						{/* Order Type */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">
								Order Type{' '}
								<span className="text-red-400">*</span>
							</Label>
							<Select
								value={form.orderType}
								onValueChange={(v) =>
									handleChange('orderType', v)
								}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select order type" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="sheet">
										S - Sheet
									</SelectItem>
									<SelectItem value="roll">
										R - Roll
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Consignee */}
						<div className="space-y-2 lg:col-span-6">
							<Label className="text-gray-300">
								Consignee{' '}
								<span className="text-red-400">*</span>
							</Label>
							<Select
								value={form.consignee}
								onValueChange={(v) =>
									handleChange('consignee', v)
								}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select consignee" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="HO10279">
										HO10279 - 3K PACK PRO
									</SelectItem>
									<SelectItem value="HO28341">
										HO28341 - Paper Co.
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Sale V_Type */}
						<div className="space-y-2 lg:col-span-6">
							<Label className="text-gray-300">
								Sale V_Type{' '}
								<span className="text-red-400">*</span>
							</Label>
							<Select
								value={form.saleVType}
								onValueChange={(v) =>
									handleChange('saleVType', v)
								}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select Sale V_Type" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="HO10279">
										HO10279 - 3K PACK PRO
									</SelectItem>
									<SelectItem value="HO28341">
										HO28341 - Paper Co.
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* To Place */}
						<div className="space-y-2 lg:col-span-6">
							<Label className="text-gray-300">To Place</Label>
							<Select
								value={form.toPlace}
								onValueChange={(v) =>
									handleChange('toPlace', v)
								}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select a value" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="factory">
										Factory
									</SelectItem>
									<SelectItem value="warehouse">
										Warehouse
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Remark */}
						<div className="space-y-2 lg:col-span-6">
							<Label className="text-gray-300">Remark</Label>
							<Input
								placeholder="Remarks..."
								value={form.remark}
								onChange={(e) =>
									handleChange('remark', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>

						{/* Prepared/Modified By */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">Prepared By</Label>
							<Input
								value={form.preparedBy}
								onChange={(e) =>
									handleChange('preparedBy', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>

						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">Modified By</Label>
							<Input
								value={form.modifiedBy}
								onChange={(e) =>
									handleChange('modifiedBy', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>

						{/* Approved/Booked By */}
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">Approved By</Label>
							<Input
								value={form.approvedBy}
								onChange={(e) =>
									handleChange('approvedBy', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>
						<div className="space-y-2 lg:col-span-3">
							<Label className="text-gray-300">Booked By</Label>
							<Input
								value={form.bookedBy}
								onChange={(e) =>
									handleChange('bookedBy', e.target.value)
								}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>

						{/* Closed */}
						<div className="space-y-2 lg:col-span-6">
							<Label className="text-gray-300">Closed</Label>
							<Select
								value={form.closed ? 'Y' : 'N'}
								onValueChange={(v) => handleChange('closed', v)}
							>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
									<SelectItem value="Y">Y - Yes</SelectItem>
									<SelectItem value="N">N - No</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
