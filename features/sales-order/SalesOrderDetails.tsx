'use client';

import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { LookupSelect } from '@/components/ui/lookup-select';
import { type NormalizedLookup } from '@/lib/schemas/schema-lookup-data';

type YesNo = 'Y' | 'N';

type SalesOrderLine = {
	itemCode: string;
	itemName: string;
	description: string;
	bf: string; // Burst Factor (dropdown)
	width: number; // cm
	length: number; // cm
	unit: string;
	grain: string; // dropdown
	gsm: string; // dropdown
	reelPerPack: number; // Quantity
	weightSecUnit: number; // numeric only
	secUnit: string; // e.g., Kg.
	weightSku: number; // used for amount calc and total weight
	tolerance: YesNo;
	sku: string; // display only
	rate: number; // price per Kg.
	overhead: number; // OH
	adjustment: number; // Adj
};

const defaultLine: SalesOrderLine = {
	itemCode: '',
	itemName: 'Kraft Paper',
	description: '',
	bf: '14',
	width: 0,
	length: 0,
	unit: 'CM',
	grain: 'Long',
	gsm: '80',
	reelPerPack: 1,
	weightSecUnit: 0,
	secUnit: 'Kg.',
	weightSku: 0,
	tolerance: 'Y',
	sku: 'Kg.',
	rate: 25,
	overhead: 0,
	adjustment: 0,
};

export default function SalesOrderDetails() {
	const [lines, setLines] = useState<SalesOrderLine[]>([
		{
			...defaultLine,
			reelPerPack: 6,
			weightSku: 3450,
			rate: 25,
			overhead: 0,
			adjustment: 0,
		},
		{ ...defaultLine, reelPerPack: 3, weightSku: 1700, rate: 25 },
	]);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [addDraft, setAddDraft] = useState<SalesOrderLine>(defaultLine);

	const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
	const [editingDraft, setEditingDraft] = useState<SalesOrderLine | null>(null);
	const [addSelectedItem, setAddSelectedItem] = useState<NormalizedLookup | null>(
		null
	);
	const [editingSelectedItem, setEditingSelectedItem] =
		useState<NormalizedLookup | null>(null);
	const [addSelectedBf, setAddSelectedBf] = useState<NormalizedLookup | null>(
		null
	);
	const [editingSelectedBf, setEditingSelectedBf] =
		useState<NormalizedLookup | null>(null);
	const [addSelectedUnit, setAddSelectedUnit] = useState<NormalizedLookup | null>(
		null
	);
	const [editingSelectedUnit, setEditingSelectedUnit] =
		useState<NormalizedLookup | null>(null);
	const [addSelectedGrain, setAddSelectedGrain] =
		useState<NormalizedLookup | null>(null);
	const [editingSelectedGrain, setEditingSelectedGrain] =
		useState<NormalizedLookup | null>(null);
	const [addSelectedGsm, setAddSelectedGsm] = useState<NormalizedLookup | null>(
		null
	);
	const [editingSelectedGsm, setEditingSelectedGsm] =
		useState<NormalizedLookup | null>(null);

	const totals = useMemo(() => {
		const totalQuantity = lines.reduce(
			(acc, l) => acc + (Number(l.reelPerPack) || 0),
			0
		);
		const totalWeight = lines.reduce(
			(acc, l) => acc + (Number(l.weightSku) || 0),
			0
		);
		return { totalQuantity, totalWeight };
	}, [lines]);

	const amountFor = useCallback((line: SalesOrderLine) => {
		const base = (Number(line.weightSku) || 0) * (Number(line.rate) || 0);
		const withOh = base + (Number(line.overhead) || 0);
		return withOh + (Number(line.adjustment) || 0);
	}, []);

	const openAdd = useCallback(() => {
		setAddDraft({ ...defaultLine });
		setAddSelectedItem(null);
		setAddSelectedBf(null);
		setAddSelectedUnit(null);
		setAddSelectedGrain(null);
		setAddSelectedGsm(null);
		setIsAddModalOpen(true);
	}, []);

	const openEdit = useCallback(
		(idx: number) => {
			const line = lines[idx];
			setEditingRowIndex(idx);
			setEditingDraft({ ...line });
			setEditingSelectedItem(
				line
					? {
							Code: line.itemCode || line.itemName,
							Description: line.itemName,
							ColumnHeaders: [],
							Additional: [],
					  }
					: null
			);
			setEditingSelectedBf(
				line
					? {
							Code: line.bf,
							Description: line.bf,
							ColumnHeaders: [],
							Additional: [],
					  }
					: null
			);
			setEditingSelectedUnit(
				line
					? {
							Code: line.unit,
							Description: line.unit,
							ColumnHeaders: [],
							Additional: [],
					  }
					: null
			);
			setEditingSelectedGrain(
				line
					? {
							Code: line.grain,
							Description: line.grain,
							ColumnHeaders: [],
							Additional: [],
					  }
					: null
			);
			setEditingSelectedGsm(
				line
					? {
							Code: line.gsm,
							Description: line.gsm,
							ColumnHeaders: [],
							Additional: [],
					  }
					: null
			);
		},
		[lines]
	);

	const removeLine = useCallback((idx: number) => {
		setLines((prev) => prev.filter((_, i) => i !== idx));
	}, []);

	const updateAddDraft = useCallback(
		(field: keyof SalesOrderLine, value: string | number) => {
			setAddDraft((prev) => ({ ...prev, [field]: value as never }));
		},
		[]
	);

	const saveAdd = useCallback(() => {
		const newLine = { ...addDraft };
		setLines((prev) => [...prev, newLine]);
		setIsAddModalOpen(false);
		setAddDraft({ ...defaultLine });
		setAddSelectedItem(null);
		setAddSelectedBf(null);
		setAddSelectedUnit(null);
		setAddSelectedGrain(null);
		setAddSelectedGsm(null);
	}, [addDraft]);

	const saveEdit = useCallback(() => {
		if (editingRowIndex !== null && editingDraft) {
			setLines((prev) =>
				prev.map((l, i) => (i === editingRowIndex ? { ...editingDraft } : l))
			);
		}
		setEditingRowIndex(null);
		setEditingDraft(null);
		setEditingSelectedItem(null);
		setEditingSelectedBf(null);
		setEditingSelectedUnit(null);
		setEditingSelectedGrain(null);
		setEditingSelectedGsm(null);
	}, [editingRowIndex, editingDraft]);

	const cancelEdit = useCallback(() => {
		setEditingRowIndex(null);
		setEditingDraft(null);
		setEditingSelectedItem(null);
		setEditingSelectedBf(null);
		setEditingSelectedUnit(null);
		setEditingSelectedGrain(null);
		setEditingSelectedGsm(null);
	}, []);

	const updateEditingDraft = useCallback(
		(field: keyof SalesOrderLine, value: string | number) => {
			setEditingDraft((prev) =>
				prev ? { ...prev, [field]: value as never } : null
			);
		},
		[]
	);

	const handleAddItemChange = useCallback((item: NormalizedLookup | null) => {
		setAddSelectedItem(item);
		setAddDraft((prev) => ({
			...prev,
			itemCode: item?.Code ?? '',
			itemName: item?.Description ?? '',
		}));
	}, []);

	const handleEditingItemChange = useCallback(
		(item: NormalizedLookup | null) => {
			setEditingSelectedItem(item);
			setEditingDraft((prev) =>
				prev
					? {
							...prev,
							itemCode: item?.Code ?? '',
							itemName: item?.Description ?? '',
					  }
					: prev
			);
		},
		[]
	);

	const handleAddBfChange = useCallback((bf: NormalizedLookup | null) => {
		setAddSelectedBf(bf);
		setAddDraft((prev) => ({
			...prev,
			bf: bf?.Code ?? '',
		}));
	}, []);

	const handleEditingBfChange = useCallback(
		(bf: NormalizedLookup | null) => {
			setEditingSelectedBf(bf);
			setEditingDraft((prev) =>
				prev
					? {
							...prev,
							bf: bf?.Code ?? '',
					  }
					: prev
			);
		},
		[]
	);

	const handleAddUnitChange = useCallback((unit: NormalizedLookup | null) => {
		setAddSelectedUnit(unit);
		setAddDraft((prev) => ({
			...prev,
			unit: unit?.Code ?? '',
		}));
	}, []);

	const handleEditingUnitChange = useCallback(
		(unit: NormalizedLookup | null) => {
			setEditingSelectedUnit(unit);
			setEditingDraft((prev) =>
				prev
					? {
							...prev,
							unit: unit?.Code ?? '',
					  }
					: prev
			);
		},
		[]
	);

	const handleAddGrainChange = useCallback((grain: NormalizedLookup | null) => {
		setAddSelectedGrain(grain);
		setAddDraft((prev) => ({
			...prev,
			grain: grain?.Code ?? '',
		}));
	}, []);

	const handleEditingGrainChange = useCallback(
		(grain: NormalizedLookup | null) => {
			setEditingSelectedGrain(grain);
			setEditingDraft((prev) =>
				prev
					? {
							...prev,
							grain: grain?.Code ?? '',
					  }
					: prev
			);
		},
		[]
	);

	const handleAddGsmChange = useCallback((gsm: NormalizedLookup | null) => {
		setAddSelectedGsm(gsm);
		setAddDraft((prev) => ({
			...prev,
			gsm: gsm?.Code ?? '',
		}));
	}, []);

	const handleEditingGsmChange = useCallback(
		(gsm: NormalizedLookup | null) => {
			setEditingSelectedGsm(gsm);
			setEditingDraft((prev) =>
				prev
					? {
							...prev,
							gsm: gsm?.Code ?? '',
					  }
					: prev
			);
		},
		[]
	);

	return (
		<div className="space-y-4">
			<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-white text-xl">
							Sales Order Details
						</CardTitle>
						<Button
							onClick={openAdd}
							className="bg-purple-600 hover:bg-purple-700 text-white"
						>
							<Plus className="h-4 w-4 mr-1" /> Add Row
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-lg border border-purple-900 overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-gray-800/50 border-purple-900 hover:bg-gray-800/50">
									<TableHead className="text-gray-300">
										S. No.
									</TableHead>
									<TableHead className="text-gray-300">
										Item Name
									</TableHead>
									<TableHead className="text-gray-300">
										BF
									</TableHead>
									<TableHead className="text-gray-300">
										Width
									</TableHead>
									<TableHead className="text-gray-300">
										Length
									</TableHead>
									<TableHead className="text-gray-300">
										Unit
									</TableHead>
									<TableHead className="text-gray-300">
										Grain
									</TableHead>
									<TableHead className="text-gray-300">
										GSM
									</TableHead>
									<TableHead className="text-gray-300">
										Reel / Pack
									</TableHead>
									<TableHead className="text-gray-300">
										Weight (SKU)
									</TableHead>
									<TableHead className="text-gray-300">
										SKU
									</TableHead>
									<TableHead className="text-gray-300">
										Rate
									</TableHead>
									<TableHead className="text-gray-300">
										Amount
									</TableHead>
									<TableHead className="text-gray-300">
										OH
									</TableHead>
									<TableHead className="text-gray-300">
										Adj
									</TableHead>
									<TableHead className="text-gray-300">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{lines.map((line, idx) => (
									<TableRow
										key={idx}
										className="border-purple-900 hover:bg-gray-800/30"
									>
										<TableCell className="text-white">
											{idx + 1}
										</TableCell>
										<TableCell className="text-gray-200">
											{editingRowIndex === idx ? (
												<div className="max-w-xs">
													<LookupSelect
														lookupCode="SORD_FHPGD_Item"
														value={editingSelectedItem}
														onChange={handleEditingItemChange}
													/>
												</div>
											) : (
												line.itemName
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<div className="max-w-xs">
													<LookupSelect
														lookupCode="SORD_FHPGD_BF"
														value={editingSelectedBf}
														onChange={handleEditingBfChange}
													/>
												</div>
											) : (
												line.bf
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<Input
													type="number"
													step="0.01"
													value={editingDraft!.width}
													onChange={(e) =>
														updateEditingDraft(
															'width',
															Number.parseFloat(e.target.value) ||
																0
														)
													}
													className="w-full h-8 bg-transparent border-none text-gray-300 focus:ring-0 focus:ring-offset-0 p-0"
												/>
											) : (
												line.width.toFixed(2)
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<Input
													type="number"
													step="0.01"
													value={editingDraft!.length}
													onChange={(e) =>
														updateEditingDraft(
															'length',
															Number.parseFloat(e.target.value) ||
																0
														)
													}
													className="w-full h-8 bg-transparent border-none text-gray-300 focus:ring-0 focus:ring-offset-0 p-0"
												/>
											) : (
												line.length.toFixed(2)
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<div className="max-w-xs">
													<LookupSelect
														lookupCode="SORD_FHPGD_SizeUnit"
														value={editingSelectedUnit}
														onChange={handleEditingUnitChange}
													/>
												</div>
											) : (
												line.unit
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<div className="max-w-xs">
													<LookupSelect
														lookupCode="SORD_FHPGD_Grain"
														value={editingSelectedGrain}
														onChange={handleEditingGrainChange}
													/>
												</div>
											) : (
												line.grain
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<div className="max-w-xs">
													<LookupSelect
														lookupCode="SORD_FHPGD_GSM"
														value={editingSelectedGsm}
														onChange={handleEditingGsmChange}
													/>
												</div>
											) : (
												line.gsm
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<Input
													type="number"
													step="0.01"
													value={editingDraft!.reelPerPack}
													onChange={(e) =>
														updateEditingDraft(
															'reelPerPack',
															Number.parseFloat(e.target.value) ||
																0
														)
													}
													className="w-full h-8 bg-transparent border-none text-gray-300 focus:ring-0 focus:ring-offset-0 p-0"
												/>
											) : (
												line.reelPerPack.toFixed(2)
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<Input
													type="number"
													step="0.01"
													value={editingDraft!.weightSku}
													onChange={(e) =>
														updateEditingDraft(
															'weightSku',
															Number.parseFloat(e.target.value) ||
																0
														)
													}
													className="w-full h-8 bg-transparent border-none text-gray-300 focus:ring-0 focus:ring-offset-0 p-0"
												/>
											) : (
												line.weightSku.toFixed(2)
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<Input
													value={editingDraft!.sku}
													onChange={(e) =>
														updateEditingDraft('sku', e.target.value)
													}
													className="w-full h-8 bg-transparent border-none text-gray-300 focus:ring-0 focus:ring-offset-0 p-0"
												/>
											) : (
												line.sku
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<Input
													type="number"
													step="0.01"
													value={editingDraft!.rate}
													onChange={(e) =>
														updateEditingDraft(
															'rate',
															Number.parseFloat(e.target.value) ||
																0
														)
													}
													className="w-full h-8 bg-transparent border-none text-gray-300 focus:ring-0 focus:ring-offset-0 p-0"
												/>
											) : (
												line.rate.toFixed(2)
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx && editingDraft
												? amountFor(editingDraft).toFixed(2)
												: amountFor(line).toFixed(2)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<Input
													type="number"
													value={editingDraft!.overhead}
													onChange={(e) =>
														updateEditingDraft(
															'overhead',
															Number(e.target.value) || 0
														)
													}
													className="w-full h-8 bg-transparent border-none text-gray-300 focus:ring-0 focus:ring-offset-0 p-0"
												/>
											) : (
												line.overhead.toFixed(2)
											)}
										</TableCell>
										<TableCell className="text-gray-300">
											{editingRowIndex === idx ? (
												<Input
													type="number"
													value={editingDraft!.adjustment}
													onChange={(e) =>
														updateEditingDraft(
															'adjustment',
															Number(e.target.value) || 0
														)
													}
													className="w-full h-8 bg-transparent border-none text-gray-300 focus:ring-0 focus:ring-offset-0 p-0"
												/>
											) : (
												line.adjustment.toFixed(2)
											)}
										</TableCell>
										<TableCell>
											{editingRowIndex === idx ? (
												<div className="flex space-x-2">
													<Button
														size="sm"
														variant="ghost"
														onClick={saveEdit}
														className="text-green-400 hover:text-green-300 hover:bg-green-600/20"
													>
														Save
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={cancelEdit}
														className="text-gray-400 hover:text-gray-300 hover:bg-gray-600/20"
													>
														Cancel
													</Button>
												</div>
											) : (
												<div className="flex space-x-2">
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															openEdit(idx)
														}
														className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/20"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															removeLine(idx)
														}
														className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableHeader>
								<TableRow className="bg-gray-800/50 border-purple-900 hover:bg-gray-800/50">
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300">
										{totals.totalQuantity.toFixed(2)}
									</TableHead>
									<TableHead className="text-gray-300">
										{totals.totalWeight.toFixed(2)}
									</TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
									<TableHead className="text-gray-300"></TableHead>
								</TableRow>
							</TableHeader>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Add Modal */}
			<Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
				<DialogContent className="bg-linear-to-br from-purple-950 via-purple-900 to-purple-950 border-purple-800 text-white max-w-3xl backdrop-blur-sm">
					<DialogHeader>
						<DialogTitle className="text-white">
							Add Line
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						{/* Row 1: Item Name, BF, GSM */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-gray-300">
									Item Name
								</Label>
								<div className="max-w-xs">
									<LookupSelect
										lookupCode="SORD_FHPGD_Item"
										value={addSelectedItem}
										onChange={handleAddItemChange}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">BF</Label>
								<div className="max-w-xs">
									<LookupSelect
										lookupCode="SORD_FHPGD_BF"
										value={addSelectedBf}
										onChange={handleAddBfChange}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">GSM</Label>
								<div className="max-w-xs">
									<LookupSelect
										lookupCode="SORD_FHPGD_GSM"
										value={addSelectedGsm}
										onChange={handleAddGsmChange}
									/>
								</div>
							</div>
						</div>

						{/* Row 2: Width, Length, Unit */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-gray-300">Width</Label>
								<Input
									type="number"
									step="0.01"
									value={addDraft.width.toFixed(2)}
									onChange={(e) =>
										updateAddDraft(
											'width',
											Number.parseFloat(e.target.value) ||
												0
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">Length</Label>
								<Input
									type="number"
									step="0.01"
									value={addDraft.length.toFixed(2)}
									onChange={(e) =>
										updateAddDraft(
											'length',
											Number.parseFloat(e.target.value) ||
												0
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">Unit</Label>
								<div className="max-w-xs">
									<LookupSelect
										lookupCode="SORD_FHPGD_SizeUnit"
										value={addSelectedUnit}
										onChange={handleAddUnitChange}
									/>
								</div>
							</div>
						</div>

						{/* Row 3: Grain, Reel / Pack, Weight (SKU) */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-gray-300">Grain</Label>
								<div className="max-w-xs">
									<LookupSelect
										lookupCode="SORD_FHPGD_Grain"
										value={addSelectedGrain}
										onChange={handleAddGrainChange}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">
									Reel / Pack
								</Label>
								<Input
									type="number"
									step="0.01"
									value={addDraft.reelPerPack.toFixed(2)}
									onChange={(e) =>
										updateAddDraft(
											'reelPerPack',
											Number.parseFloat(e.target.value) ||
												0
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">
									Weight (SKU)
								</Label>
								<Input
									type="number"
									step="0.01"
									value={addDraft.weightSku.toFixed(2)}
									onChange={(e) =>
										updateAddDraft(
											'weightSku',
											Number.parseFloat(e.target.value) ||
												0
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
						</div>

						{/* Row 4: Rate, OH, Adj */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-gray-300">Rate</Label>
								<Input
									type="number"
									step="0.01"
									value={addDraft.rate.toFixed(2)}
									onChange={(e) =>
										updateAddDraft(
											'rate',
											Number.parseFloat(e.target.value) ||
												0
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">OH</Label>
								<Input
									type="number"
									value={String(addDraft.overhead)}
									onChange={(e) =>
										updateAddDraft(
											'overhead',
											Number(e.target.value) || 0
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">Adj</Label>
								<Input
									type="number"
									value={String(addDraft.adjustment)}
									onChange={(e) =>
										updateAddDraft(
											'adjustment',
											Number(e.target.value) || 0
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
						</div>

						{/* Row 5: SKU, Amount */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-gray-300">SKU</Label>
								<Input
									value={addDraft.sku}
									onChange={(e) =>
										updateAddDraft('sku', e.target.value)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">Amount</Label>
								<Input
									type="number"
									step="0.01"
									value={amountFor(addDraft).toFixed(2)}
									readOnly
									className="bg-purple-950/50 border-purple-700 text-white"
								/>
							</div>
							<div className="space-y-2">
								{/* Empty column to maintain 3-column layout */}
							</div>
						</div>

						<div className="flex justify-end space-x-2 pt-2">
							<Button
								variant="outline"
								onClick={() => setIsAddModalOpen(false)}
								className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-400 bg-gray-800"
							>
								Cancel
							</Button>
							<Button
								onClick={saveAdd}
								className="bg-purple-600 hover:bg-purple-700"
							>
								Save
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
