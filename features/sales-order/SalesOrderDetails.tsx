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

type YesNo = 'Y' | 'N';

type SalesOrderLine = {
	itemName: string;
	description: string;
	bf: string; // Burst Factor (dropdown)
	width: number; // cm
	length: number; // cm
	unit: 'CM' | 'IN' | 'MM';
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

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [draft, setDraft] = useState<SalesOrderLine>(defaultLine);

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
		setEditingIndex(null);
		setDraft({ ...defaultLine });
		setIsModalOpen(true);
	}, []);

	const openEdit = useCallback(
		(idx: number) => {
			setEditingIndex(idx);
			setDraft({ ...lines[idx] });
			setIsModalOpen(true);
		},
		[lines]
	);

	const removeLine = useCallback((idx: number) => {
		setLines((prev) => prev.filter((_, i) => i !== idx));
	}, []);

	const updateDraft = useCallback(
		(field: keyof SalesOrderLine, value: string | number) => {
			setDraft((prev) => ({ ...prev, [field]: value as never }));
		},
		[]
	);

	const saveDraft = useCallback(() => {
		const newLine = { ...draft };
		if (editingIndex === null) {
			setLines((prev) => [...prev, newLine]);
		} else {
			setLines((prev) =>
				prev.map((l, i) => (i === editingIndex ? newLine : l))
			);
		}
		setIsModalOpen(false);
		setEditingIndex(null);
	}, [draft, editingIndex]);

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
											{line.itemName}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.bf}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.width.toFixed(2)}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.length.toFixed(2)}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.unit}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.gsm}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.reelPerPack.toFixed(2)}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.weightSku.toFixed(2)}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.sku}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.rate.toFixed(2)}
										</TableCell>
										<TableCell className="text-gray-300">
											{amountFor(line).toFixed(2)}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.overhead.toFixed(2)}
										</TableCell>
										<TableCell className="text-gray-300">
											{line.adjustment.toFixed(2)}
										</TableCell>
										<TableCell>
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

			{/* Add/Edit Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="bg-linear-to-br from-purple-950 via-purple-900 to-purple-950 border-purple-800 text-white max-w-3xl backdrop-blur-sm">
					<DialogHeader>
						<DialogTitle className="text-white">
							{editingIndex === null ? 'Add Line' : 'Edit Line'}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						{/* Row 1: Item Name, BF, GSM */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-gray-300">
									Item Name
								</Label>
								<Select
									value={draft.itemName}
									onValueChange={(v) =>
										updateDraft('itemName', v)
									}
								>
									<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
										<SelectValue placeholder="Select item name" />
									</SelectTrigger>
									<SelectContent className="bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
										<SelectItem value="Kraft Paper">
											Kraft Paper
										</SelectItem>
										<SelectItem value="Newsprint">
											Newsprint
										</SelectItem>
										<SelectItem value="Coated Paper">
											Coated Paper
										</SelectItem>
										<SelectItem value="Cardboard">
											Cardboard
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">BF</Label>
								<Select
									value={draft.bf}
									onValueChange={(v) => updateDraft('bf', v)}
								>
									<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
										<SelectValue placeholder="Select BF" />
									</SelectTrigger>
									<SelectContent className="bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
										<SelectItem value="14">14</SelectItem>
										<SelectItem value="16">16</SelectItem>
										<SelectItem value="18">18</SelectItem>
										<SelectItem value="20">20</SelectItem>
										<SelectItem value="22">22</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">GSM</Label>
								<Select
									value={draft.gsm}
									onValueChange={(v) => updateDraft('gsm', v)}
								>
									<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
										<SelectValue placeholder="Select GSM" />
									</SelectTrigger>
									<SelectContent className="bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
										<SelectItem value="80">80</SelectItem>
										<SelectItem value="100">100</SelectItem>
										<SelectItem value="120">120</SelectItem>
										<SelectItem value="150">150</SelectItem>
										<SelectItem value="200">200</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Row 2: Width, Length, Unit */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-gray-300">Width</Label>
								<Input
									type="number"
									step="0.01"
									value={draft.width.toFixed(2)}
									onChange={(e) =>
										updateDraft(
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
									value={draft.length.toFixed(2)}
									onChange={(e) =>
										updateDraft(
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
								<Select
									value={draft.unit}
									onValueChange={(v) =>
										updateDraft('unit', v)
									}
								>
									<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
										<SelectItem value="CM">CM</SelectItem>
										<SelectItem value="IN">IN</SelectItem>
										<SelectItem value="MM">MM</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Row 3: Grain, Reel / Pack, Weight (SKU) */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-gray-300">Grain</Label>
								<Select
									value={draft.grain}
									onValueChange={(v) =>
										updateDraft('grain', v)
									}
								>
									<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
										<SelectValue placeholder="Select grain" />
									</SelectTrigger>
									<SelectContent className="bg-[#2c0b5e] border-purple-800 text-white **:data-highlighted:bg-purple-800 **:data-highlighted:text-white">
										<SelectItem value="Long">
											Long
										</SelectItem>
										<SelectItem value="Short">
											Short
										</SelectItem>
										<SelectItem value="Cross">
											Cross
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">
									Reel / Pack
								</Label>
								<Input
									type="number"
									step="0.01"
									value={draft.reelPerPack.toFixed(2)}
									onChange={(e) =>
										updateDraft(
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
									value={draft.weightSku.toFixed(2)}
									onChange={(e) =>
										updateDraft(
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
									value={draft.rate.toFixed(2)}
									onChange={(e) =>
										updateDraft(
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
									value={String(draft.overhead)}
									onChange={(e) =>
										updateDraft(
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
									value={String(draft.adjustment)}
									onChange={(e) =>
										updateDraft(
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
									value={draft.sku}
									onChange={(e) =>
										updateDraft('sku', e.target.value)
									}
									className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-gray-300">Amount</Label>
								<Input
									type="number"
									step="0.01"
									value={amountFor(draft).toFixed(2)}
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
								onClick={() => setIsModalOpen(false)}
								className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-400 bg-gray-800"
							>
								Cancel
							</Button>
							<Button
								onClick={saveDraft}
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
