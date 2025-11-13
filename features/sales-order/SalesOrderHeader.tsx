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
import { LookupSelect } from '@/components/ui/lookup-select';
import { type NormalizedLookup } from '@/lib/schemas/schema-lookup-data';

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
	const [selectedVoucherType, setSelectedVoucherType] =
		useState<NormalizedLookup | null>(null);
	const [selectedSaleVoucher, setSelectedSaleVoucher] =
		useState<NormalizedLookup | null>(null);
	const [selectedParty, setSelectedParty] = useState<NormalizedLookup | null>(
		null
	);
	const [selectedDeliveryTo, setSelectedDeliveryTo] =
		useState<NormalizedLookup | null>(null);
	const [selectedConsignee, setSelectedConsignee] =
		useState<NormalizedLookup | null>(null);
	const [selectedToPlace, setSelectedToPlace] =
		useState<NormalizedLookup | null>(null);
	const [selectedOrderType, setSelectedOrderType] =
		useState<NormalizedLookup | null>(null);

	const handleChange = useCallback(
		(field: keyof SalesOrderHeaderForm, value: string | boolean) => {
			setForm((prev) => ({ ...prev, [field]: value }));
		},
		[]
	);

	const handleVoucherTypeChange = useCallback(
		(item: NormalizedLookup | null) => {
			setSelectedVoucherType(item);
			handleChange('voucherType', item?.Code ?? '');
		},
		[handleChange]
	);

	const handleSaleVoucherChange = useCallback(
		(item: NormalizedLookup | null) => {
			setSelectedSaleVoucher(item);
			handleChange('saleVType', item?.Code ?? '');
		},
		[handleChange]
	);

	const handlePartyChange = useCallback(
		(item: NormalizedLookup | null) => {
			setSelectedParty(item);
			handleChange('party', item?.Code ?? '');
		},
		[handleChange]
	);

	const handleDeliveryToChange = useCallback(
		(item: NormalizedLookup | null) => {
			setSelectedDeliveryTo(item);
			handleChange('deliveryTo', item?.Code ?? '');
		},
		[handleChange]
	);

	const handleConsigneeChange = useCallback(
		(item: NormalizedLookup | null) => {
			setSelectedConsignee(item);
			handleChange('consignee', item?.Code ?? '');
		},
		[handleChange]
	);

	const handleToPlaceChange = useCallback(
		(item: NormalizedLookup | null) => {
			setSelectedToPlace(item);
			handleChange('toPlace', item?.Code ?? '');
		},
		[handleChange]
	);

	const handleOrderTypeChange = useCallback(
		(item: NormalizedLookup | null) => {
			setSelectedOrderType(item);
			handleChange('orderType', item?.Code ?? '');
		},
		[handleChange]
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

			{/* Two responsive cards: left = Sale Order Information, right = Party Information */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Sale Order Information Card */}
				<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm">
					<CardHeader className="pb-3">
						<CardTitle className="text-white text-lg">
							Sale Order Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{/* Type (Voucher Type) */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Type <span className="text-red-400">*</span>
								</Label>
								<LookupSelect
									lookupCode="SORD_FHP_TYPE"
									value={selectedVoucherType}
									onChange={handleVoucherTypeChange}
								/>
							</div>

							{/* Order No */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Order No{' '}
									<span className="text-red-400">*</span>
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

							{/* Order Date */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Order Date{' '}
									<span className="text-red-400">*</span>
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

							{/* Sale Voucher (Sale V_Type) */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Sale Voucher{' '}
									<span className="text-red-400">*</span>
								</Label>
								<LookupSelect
									lookupCode="SORD_FHP_Sale_VType"
									value={selectedSaleVoucher}
									onChange={handleSaleVoucherChange}
								/>
							</div>

							{/* Party Order */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Party Order{' '}
									<span className="text-red-400">*</span>
								</Label>
								<Input
									type="number"
									placeholder="1"
									value={form.partyOrderNo}
									onChange={(e) =>
										handleChange(
											'partyOrderNo',
											e.target.value
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>

							{/* Party Order Date */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Party Order Date
								</Label>
								<Input
									type="date"
									value={form.partyDate}
									onChange={(e) =>
										handleChange(
											'partyDate',
											e.target.value
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
								/>
							</div>

							{/* Amendment Order No (mapped from Existing Order) */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Amendment Order No
								</Label>
								<Select
									value={form.existingOrder}
									onValueChange={(v) =>
										handleChange('existingOrder', v)
									}
								>
									<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
										<SelectValue placeholder="Select amendment order" />
									</SelectTrigger>
									<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
										<SelectItem value="none">
											None
										</SelectItem>
										<SelectItem value="EO-1001">
											EO-1001
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Party Information Card */}
				<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm">
					<CardHeader className="pb-3">
						<CardTitle className="text-white text-lg">
							Party Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{/* Party Name */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Party Name
								</Label>
								<LookupSelect
									lookupCode="SORD_CUSTOMER"
									value={selectedParty}
									onChange={handlePartyChange}
								/>
							</div>

							{/* Distributor */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Distributor
								</Label>
								<Input
									placeholder="Distributor name"
									value={form.distributor}
									onChange={(e) =>
										handleChange(
											'distributor',
											e.target.value
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>

							{/* Delivery To */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Delivery To
								</Label>
								<LookupSelect
									lookupCode="SORD_FHP_City"
									value={selectedDeliveryTo}
									onChange={handleDeliveryToChange}
								/>
							</div>

							{/* Delivery Date */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Delivery Date{' '}
									<span className="text-red-400">*</span>
								</Label>
								<Input
									type="date"
									value={form.deliveryDate}
									onChange={(e) =>
										handleChange(
											'deliveryDate',
											e.target.value
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
								/>
							</div>

							{/* Consignee */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Consignee{' '}
									<span className="text-red-400">*</span>
								</Label>
								<LookupSelect
									lookupCode="SORD_CUSTOMER"
									value={selectedConsignee}
									onChange={handleConsigneeChange}
								/>
							</div>

							{/* To Place */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									To Place
								</Label>
								<LookupSelect
									lookupCode="SORD_FHP_City"
									value={selectedToPlace}
									onChange={handleToPlaceChange}
								/>
							</div>
						</div>

						{/* Keep remaining header-related fields grouped at bottom to avoid layout regressions */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
							{/* Order Type */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Order Type{' '}
									<span className="text-red-400">*</span>
								</Label>
								<LookupSelect
									lookupCode="SORD_FHP_OrderType"
									value={selectedOrderType}
									onChange={handleOrderTypeChange}
								/>
							</div>

							{/* Remark */}
							<div className="space-y-2">
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

							{/* Closed */}
							<div className="space-y-2">
								<Label className="text-gray-300">Closed</Label>
								<Select
									value={form.closed ? 'Y' : 'N'}
									onValueChange={(v) =>
										handleChange('closed', v === 'Y')
									}
								>
									<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent className="w-full bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
										<SelectItem value="Y">
											Y - Yes
										</SelectItem>
										<SelectItem value="N">
											N - No
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Audit Information Card */}
				<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm md:col-span-2">
					<CardHeader className="pb-3">
						<CardTitle className="text-white text-lg">
							Audit Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{/* Prepared By */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Prepared By
								</Label>
								<Input
									value={form.preparedBy}
									onChange={(e) =>
										handleChange(
											'preparedBy',
											e.target.value
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>

							{/* Modified By */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Modified By
								</Label>
								<Input
									value={form.modifiedBy}
									onChange={(e) =>
										handleChange(
											'modifiedBy',
											e.target.value
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>

							{/* Approved By */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Approved By
								</Label>
								<Input
									value={form.approvedBy}
									onChange={(e) =>
										handleChange(
											'approvedBy',
											e.target.value
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>

							{/* Booked By */}
							<div className="space-y-2">
								<Label className="text-gray-300">
									Booked By
								</Label>
								<Input
									value={form.bookedBy}
									onChange={(e) =>
										handleChange('bookedBy', e.target.value)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
