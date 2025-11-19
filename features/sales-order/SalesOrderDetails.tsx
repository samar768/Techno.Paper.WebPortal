'use client';

import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type CellContext,
	type ColumnDef,
	type RowData,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableFooter,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { LookupSelect } from '@/components/ui/lookup-select';
import { type NormalizedLookup } from '@/lib/schemas/schema-lookup-data';
import type { SaleOrderLookups } from '@/lib/lookup-types';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type YesNo = 'Y' | 'N';

type SalesOrderLine = {
	id: string;
	itemCode: string;
	itemName: string;
	description: string;
	bf: string;
	width: number;
	length: number;
	unit: string;
	grain: string;
	gsm: string;
	reelPerPack: number;
	weightSecUnit: number;
	secUnit: string;
	weightSku: number;
	tolerance: YesNo;
	sku: string;
	rate: number;
	overhead: number;
	adjustment: number;
};

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (
			rowIndex: number,
			columnId: keyof SalesOrderLine,
			value: SalesOrderLine[keyof SalesOrderLine]
		) => void;
	}
}

const editableInputClassName =
	'w-full h-8 bg-transparent border-none text-gray-300 focus:ring-0 focus:ring-offset-0 p-0';

type BaseCellProps<TKey extends keyof SalesOrderLine> = {
	ctx: CellContext<SalesOrderLine, unknown>;
	columnKey: TKey;
	editingRowIndex: number | null;
};

type NumberCellProps<TKey extends keyof SalesOrderLine> =
	BaseCellProps<TKey> & {
		decimal?: boolean;
	};

function NumberCell<TKey extends keyof SalesOrderLine>({
	ctx,
	columnKey,
	editingRowIndex,
	decimal,
}: NumberCellProps<TKey>) {
	const { row, table } = ctx;
	const isEditing = editingRowIndex === row.index;
	const value = row.original[columnKey] as number | string | undefined;
	if (!isEditing) {
		const numericValue = Number(value ?? 0);
		const displayValue = Number.isFinite(numericValue)
			? numericValue.toFixed(decimal ? 2 : 0)
			: '-';
		return <span className="text-gray-300">{displayValue}</span>;
	}

	return (
		<Input
			type="number"
			step={decimal ? '0.01' : '1'}
			value={value ?? ''}
			onChange={(event) => {
				const parsed = Number.parseFloat(event.target.value);
				table.options.meta?.updateData(
					row.index,
					columnKey,
					(Number.isNaN(parsed)
						? 0
						: parsed) as SalesOrderLine[typeof columnKey]
				);
			}}
			className={editableInputClassName}
		/>
	);
}

function TextCell<TKey extends keyof SalesOrderLine>({
	ctx,
	columnKey,
	editingRowIndex,
}: BaseCellProps<TKey>) {
	const { row, table } = ctx;
	const isEditing = editingRowIndex === row.index;
	const value = (row.original[columnKey] as string | undefined) ?? '';
	if (!isEditing) {
		return <span className="text-gray-300">{value || '-'}</span>;
	}

	return (
		<Input
			value={value}
			onChange={(event) =>
				table.options.meta?.updateData(
					row.index,
					columnKey,
					event.target.value as SalesOrderLine[typeof columnKey]
				)
			}
			className={editableInputClassName}
		/>
	);
}

function LookupCell<TKey extends keyof SalesOrderLine>({
	ctx,
	columnKey,
	lookupCode,
	items,
	editingRowIndex,
	codeAccessor,
	mapSelection,
}: {
	ctx: CellContext<SalesOrderLine, unknown>;
	columnKey: TKey;
	lookupCode: string;
	items?: NormalizedLookup[];
	editingRowIndex: number | null;
	codeAccessor?: (line: SalesOrderLine) => string | undefined;
	mapSelection?: (item: NormalizedLookup | null) => Partial<SalesOrderLine>;
}) {
	const { row, table } = ctx;
	const isEditing = editingRowIndex === row.index;
	const currentLine = row.original;
	const columnValue = currentLine[columnKey] as string | undefined;
	const codeValue = codeAccessor?.(currentLine) ?? columnValue;
	const lookupValue = resolveLookupValue(items, codeValue, columnValue);

	if (!isEditing) {
		const displayValue =
			lookupValue?.Description && lookupValue.Description.length > 0
				? lookupValue.Description
				: columnValue && columnValue.length > 0
				? columnValue
				: '-';
		return <span className="text-gray-300">{displayValue}</span>;
	}

	const handleLookupChange = (item: NormalizedLookup | null) => {
		const updates =
			mapSelection?.(item) ??
			({
				[columnKey]: item?.Code ?? '',
			} as Partial<SalesOrderLine>);

		Object.entries(updates).forEach(([key, val]) => {
			table.options.meta?.updateData(
				row.index,
				key as keyof SalesOrderLine,
				val as SalesOrderLine[keyof SalesOrderLine]
			);
		});
	};

	return (
		<div className="max-w-xs">
			<LookupSelect
				lookupCode={lookupCode}
				value={lookupValue}
				onChange={handleLookupChange}
				items={items}
			/>
		</div>
	);
}

const createLineId = () => {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}
	return Math.random().toString(36).slice(2, 10);
};

const createLine = (
	overrides: Partial<Omit<SalesOrderLine, 'id'>> = {}
): SalesOrderLine => ({
	id: createLineId(),
	itemCode: '',
	itemName: '',
	description: '',
	bf: '',
	width: 0,
	length: 0,
	unit: '',
	grain: '',
	gsm: '',
	reelPerPack: 0,
	weightSecUnit: 0,
	secUnit: 'Kg.',
	weightSku: 0,
	tolerance: 'Y',
	sku: '',
	rate: 0,
	overhead: 0,
	adjustment: 0,
	...overrides,
});

const seededLines: SalesOrderLine[] = [
	createLine({
		itemCode: 'KP-001',
		itemName: 'Kraft Paper',
		bf: '14',
		width: 120,
		length: 150,
		unit: 'CM',
		grain: 'Long',
		gsm: '80',
		reelPerPack: 6,
		weightSku: 3450,
		rate: 25,
	}),
	createLine({
		itemCode: 'KP-002',
		itemName: 'Kraft Paper B',
		bf: '16',
		width: 100,
		length: 120,
		unit: 'CM',
		grain: 'Short',
		gsm: '90',
		reelPerPack: 3,
		weightSku: 1700,
		rate: 25,
	}),
];

const createLookupValue = (
	code?: string,
	description?: string
): NormalizedLookup | null => {
	if (!code && !description) return null;
	return {
		Code: code ?? description ?? '',
		Description: description ?? code ?? '',
		ColumnHeaders: [],
		Additional: [],
	};
};

const resolveLookupValue = (
	items: NormalizedLookup[] | undefined,
	code?: string,
	description?: string
) =>
	items?.find((item) => item.Code === code) ??
	createLookupValue(code, description);

type SalesOrderDetailsProps = {
	lookups?: SaleOrderLookups;
	onDirtyChange?: (dirty: boolean) => void;
	resetToken?: number;
	startEmpty?: boolean;
	readOnly?: boolean;
};

const DeleteModal = ({
	isOpen,
	onClose,
	onConfirm,
	itemsToDelete,
	itemSummaries,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemsToDelete: string[];
	itemSummaries: string[];
}) => {
	const count = itemSummaries.length || itemsToDelete.length;
	const isMultiple = count > 1;
	const heading = isMultiple ? 'Delete Line Items' : 'Delete Line Item';
	const singleLabel = itemSummaries[0] ?? 'this line item';

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					onClose();
				}
			}}
		>
			<DialogContent className="bg-linear-to-br from-purple-950 via-purple-900 to-purple-950 border-purple-800 text-white max-w-md backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle className="text-white">{heading}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					{isMultiple ? (
						<>
							<p className="text-gray-300">
								Are you sure you want to delete{' '}
								<span className="font-semibold text-white">
									{count}
								</span>{' '}
								line items? This action cannot be undone.
							</p>
							{itemSummaries.length > 0 && (
								<div className="rounded-md border border-purple-700/60 bg-purple-900/30 p-3">
									<ul className="space-y-1 text-sm text-gray-200">
										{itemSummaries.map((summary, index) => (
											<li
												key={`${summary}-${index}`}
												className="truncate"
											>
												{summary}
											</li>
										))}
									</ul>
								</div>
							)}
						</>
					) : (
						<p className="text-gray-300">
							Are you sure you want to delete{' '}
							<span className="font-semibold text-white">
								{singleLabel}
							</span>
							? This action cannot be undone.
						</p>
					)}
					<div className="flex justify-end space-x-2 pt-4">
						<Button
							variant="outline"
							onClick={onClose}
							className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-400 bg-gray-800"
						>
							Cancel
						</Button>
						<Button
							onClick={onConfirm}
							disabled={itemsToDelete.length === 0}
							className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/40 disabled:text-red-200/60"
						>
							Delete
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default function SalesOrderDetails({
	lookups,
	onDirtyChange,
	resetToken = 0,
	startEmpty = false,
	readOnly = false,
}: SalesOrderDetailsProps) {
	const initialLines = startEmpty ? [] : seededLines;
	const [lines, setLines] = useState<SalesOrderLine[]>(initialLines);
	const [baselineLines, setBaselineLines] =
		useState<SalesOrderLine[]>(initialLines);
	const latestLinesRef = useRef(lines);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [pendingDeletion, setPendingDeletion] = useState<string[]>([]);
	const [pendingSummaries, setPendingSummaries] = useState<string[]>([]);
	const selectAllRef = useRef<HTMLInputElement | null>(null);
	const selectionCount = selectedRows.length;
	const hasSelection = selectionCount > 0;
	const selectableIds = useMemo(() => lines.map((line) => line.id), [lines]);

	const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
	const editingRowRef = useRef<HTMLTableRowElement | null>(null);

	const linesSignature = useMemo(() => JSON.stringify(lines), [lines]);
	const baselineSignature = useMemo(
		() => JSON.stringify(baselineLines),
		[baselineLines]
	);
	const isDirty = linesSignature !== baselineSignature;

	useEffect(() => {
		latestLinesRef.current = lines;
	}, [lines]);

	useEffect(() => {
		setBaselineLines(latestLinesRef.current);
	}, [resetToken]);

	useEffect(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);

	useEffect(() => {
		setSelectedRows([]);
	}, [resetToken]);

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

	const addRow = useCallback(() => {
		if (readOnly) {
			return;
		}
		setLines((prev) => {
			const nextLine = createLine();
			const next = [...prev, nextLine];
			setEditingRowIndex(next.length - 1);
			return next;
		});
	}, [readOnly]);

	useEffect(() => {
		if (editingRowIndex === null) return;
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (target.closest('[data-slot="popover-content"]')) {
				return;
			}
			if (
				editingRowRef.current &&
				!editingRowRef.current.contains(target)
			) {
				setEditingRowIndex(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [editingRowIndex]);

	const handleRowClick = useCallback(
		(rowIndex: number) => {
			if (readOnly) {
				return;
			}
			setEditingRowIndex((current) =>
				current === rowIndex ? current : rowIndex
			);
		},
		[readOnly]
	);

	const handleToggleRow = useCallback((rowId: string) => {
		setSelectedRows((prev) =>
			prev.includes(rowId)
				? prev.filter((id) => id !== rowId)
				: [...prev, rowId]
		);
	}, []);

	const areAllSelected =
		selectableIds.length > 0 &&
		selectedRows.length === selectableIds.length;

	useEffect(() => {
		if (selectAllRef.current) {
			selectAllRef.current.indeterminate =
				selectedRows.length > 0 && !areAllSelected;
		}
	}, [selectedRows.length, areAllSelected]);

	useEffect(() => {
		setSelectedRows((prev) =>
			prev.filter((id) => selectableIds.includes(id))
		);
	}, [selectableIds]);

	const handleToggleSelectAll = useCallback(() => {
		setSelectedRows((prev) =>
			prev.length === selectableIds.length ? [] : selectableIds
		);
	}, [selectableIds]);

	const handleOpenDelete = useCallback(
		(targetRows: string[]) => {
			if (!targetRows.length) {
				return;
			}
			setPendingDeletion(targetRows);
			setPendingSummaries(
				targetRows
					.map((id) => lines.find((line) => line.id === id))
					.filter((line): line is SalesOrderLine => Boolean(line))
					.map((line) =>
						[line.itemName || 'Untitled Item', line.itemCode]
							.filter(Boolean)
							.join(' • ')
					)
			);
			setIsDeleteModalOpen(true);
		},
		[lines]
	);

	const handleBulkDelete = useCallback(() => {
		if (!selectedRows.length) {
			return;
		}
		handleOpenDelete(selectedRows);
	}, [handleOpenDelete, selectedRows]);

	const handleConfirmDelete = useCallback(() => {
		if (!pendingDeletion.length) {
			return;
		}

		setLines((prev) =>
			prev.filter((line) => !pendingDeletion.includes(line.id))
		);
		setSelectedRows((prev) =>
			prev.filter((id) => !pendingDeletion.includes(id))
		);
		setIsDeleteModalOpen(false);
		setPendingDeletion([]);
		setPendingSummaries([]);

		if (pendingDeletion.length === 1) {
			toast.success('Line item deleted successfully.');
			return;
		}

		toast.success(
			`${pendingDeletion.length} line items deleted successfully.`
		);
	}, [pendingDeletion]);

	const handleCloseDeleteModal = useCallback(() => {
		setIsDeleteModalOpen(false);
		setPendingDeletion([]);
		setPendingSummaries([]);
	}, []);

	const updateData = useCallback(
		(
			rowIndex: number,
			columnId: keyof SalesOrderLine,
			value: SalesOrderLine[keyof SalesOrderLine]
		) => {
			if (readOnly) {
				return;
			}
			setLines((prev) =>
				prev.map((row, idx) =>
					idx === rowIndex
						? { ...row, [columnId]: value as never }
						: row
				)
			);
		},
		[readOnly]
	);

	const columns = useMemo<ColumnDef<SalesOrderLine>[]>(
		() => [
			{
				id: 'select',
				header: () => (
					<input
						ref={selectAllRef}
						type="checkbox"
						onChange={handleToggleSelectAll}
						checked={areAllSelected}
						className="h-4 w-4 cursor-pointer accent-purple-500"
						aria-label="Select all line items"
						disabled={readOnly}
					/>
				),
				cell: ({ row }) => (
					<input
						type="checkbox"
						checked={selectedRows.includes(row.original.id)}
						onMouseDown={(event) => event.stopPropagation()}
						onClick={(event) => event.stopPropagation()}
						onChange={(event) => {
							event.stopPropagation();
							handleToggleRow(row.original.id);
						}}
						className="h-4 w-4 cursor-pointer accent-purple-500"
						aria-label={`Select line item ${row.index + 1}`}
						disabled={readOnly}
					/>
				),
				size: 40,
				enableSorting: false,
				enableColumnFilter: false,
			},
			{
				id: 'serial',
				header: () => <span className="text-gray-300">S. No.</span>,
				cell: ({ row }) => (
					<span className="text-white">{row.index + 1}</span>
				),
			},
			{
				accessorKey: 'itemName',
				header: () => <span className="text-gray-300">Item Name</span>,
				cell: (ctx) => (
					<LookupCell
						ctx={ctx}
						columnKey="itemName"
						lookupCode="SORD_FHPGD_Item"
						items={lookups?.items}
						editingRowIndex={editingRowIndex}
						codeAccessor={(line) => line.itemCode}
						mapSelection={(item) => ({
							itemName: item?.Description ?? '',
							itemCode: item?.Code ?? '',
						})}
					/>
				),
			},
			{
				accessorKey: 'bf',
				header: () => <span className="text-gray-300">BF</span>,
				cell: (ctx) => (
					<LookupCell
						ctx={ctx}
						columnKey="bf"
						lookupCode="SORD_FHPGD_BF"
						items={lookups?.bfs}
						editingRowIndex={editingRowIndex}
						mapSelection={(item) => ({ bf: item?.Code ?? '' })}
					/>
				),
			},
			{
				accessorKey: 'width',
				header: () => <span className="text-gray-300">Width</span>,
				cell: (ctx) => (
					<NumberCell
						ctx={ctx}
						columnKey="width"
						editingRowIndex={editingRowIndex}
						decimal
					/>
				),
			},
			{
				accessorKey: 'length',
				header: () => <span className="text-gray-300">Length</span>,
				cell: (ctx) => (
					<NumberCell
						ctx={ctx}
						columnKey="length"
						editingRowIndex={editingRowIndex}
						decimal
					/>
				),
			},
			{
				accessorKey: 'unit',
				header: () => <span className="text-gray-300">Unit</span>,
				cell: (ctx) => (
					<LookupCell
						ctx={ctx}
						columnKey="unit"
						lookupCode="SORD_FHPGD_SizeUnit"
						items={lookups?.sizeUnits}
						editingRowIndex={editingRowIndex}
					/>
				),
			},
			{
				accessorKey: 'grain',
				header: () => <span className="text-gray-300">Grain</span>,
				cell: (ctx) => (
					<LookupCell
						ctx={ctx}
						columnKey="grain"
						lookupCode="SORD_FHPGD_Grain"
						items={lookups?.grains}
						editingRowIndex={editingRowIndex}
					/>
				),
			},
			{
				accessorKey: 'gsm',
				header: () => <span className="text-gray-300">GSM</span>,
				cell: (ctx) => (
					<LookupCell
						ctx={ctx}
						columnKey="gsm"
						lookupCode="SORD_FHPGD_GSM"
						items={lookups?.gsms}
						editingRowIndex={editingRowIndex}
					/>
				),
			},
			{
				accessorKey: 'reelPerPack',
				header: () => (
					<span className="text-gray-300">Reel / Pack</span>
				),
				cell: (ctx) => (
					<NumberCell
						ctx={ctx}
						columnKey="reelPerPack"
						editingRowIndex={editingRowIndex}
						decimal
					/>
				),
			},
			{
				accessorKey: 'weightSku',
				header: () => (
					<span className="text-gray-300">Weight (SKU)</span>
				),
				cell: (ctx) => (
					<NumberCell
						ctx={ctx}
						columnKey="weightSku"
						editingRowIndex={editingRowIndex}
						decimal
					/>
				),
			},
			{
				accessorKey: 'sku',
				header: () => <span className="text-gray-300">SKU</span>,
				cell: (ctx) => (
					<TextCell
						ctx={ctx}
						columnKey="sku"
						editingRowIndex={editingRowIndex}
					/>
				),
			},
			{
				accessorKey: 'rate',
				header: () => <span className="text-gray-300">Rate</span>,
				cell: (ctx) => (
					<NumberCell
						ctx={ctx}
						columnKey="rate"
						editingRowIndex={editingRowIndex}
						decimal
					/>
				),
			},
			{
				id: 'amount',
				header: () => <span className="text-gray-300">Amount</span>,
				cell: ({ row }) => (
					<span className="text-gray-300">
						{amountFor(row.original).toFixed(2)}
					</span>
				),
			},
			{
				accessorKey: 'overhead',
				header: () => <span className="text-gray-300">OH</span>,
				cell: (ctx) => (
					<NumberCell
						ctx={ctx}
						columnKey="overhead"
						editingRowIndex={editingRowIndex}
						decimal
					/>
				),
			},
			{
				accessorKey: 'adjustment',
				header: () => <span className="text-gray-300">Adj</span>,
				cell: (ctx) => (
					<NumberCell
						ctx={ctx}
						columnKey="adjustment"
						editingRowIndex={editingRowIndex}
						decimal
					/>
				),
			},
		],
		[
			editingRowIndex,
			lookups,
			amountFor,
			handleToggleRow,
			handleToggleSelectAll,
			areAllSelected,
			selectedRows,
			readOnly,
		]
	);

	const table = useReactTable({
		data: lines,
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			updateData,
		},
	});

	return (
		<div className="space-y-4">
			<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm">
				<CardHeader>
					<div className="flex items-center justify-between gap-4">
						<CardTitle className="text-white text-xl">
							Sales Order Details
						</CardTitle>
						<div className="flex items-center gap-2">
							<Button
								onClick={addRow}
								className="bg-purple-600 hover:bg-purple-700 text-white"
								disabled={readOnly}
							>
								<Plus className="h-4 w-4 mr-1" /> Add Row
							</Button>
							{hasSelection && (
								<Button
									onClick={handleBulkDelete}
									className="bg-red-600 hover:bg-red-700 text-white"
									disabled={readOnly}
								>
									<Trash2 className="h-4 w-4 mr-1" /> Delete
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-lg border border-purple-900 overflow-hidden">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow
										key={headerGroup.id}
										className="bg-gray-800/50 border-purple-900 hover:bg-gray-800/50"
									>
										{headerGroup.headers.map((header) => (
											<TableHead
												key={header.id}
												className="text-gray-300"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column
																.columnDef
																.header,
															header.getContext()
													  )}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											ref={
												row.index === editingRowIndex
													? editingRowRef
													: undefined
											}
											className={`border-purple-900 hover:bg-gray-800/30 ${
												editingRowIndex !== row.index
													? 'cursor-pointer'
													: ''
											}`}
											onClick={() =>
												handleRowClick(row.index)
											}
										>
											{row
												.getVisibleCells()
												.map((cell) => (
													<TableCell
														key={cell.id}
														className="text-gray-300"
													>
														{flexRender(
															cell.column
																.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="text-center text-gray-400"
										>
											No lines added yet.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
							<TableFooter>
								<TableRow className="bg-gray-800/50 border-purple-900">
									<TableCell colSpan={9} />
									<TableCell className="text-gray-300 font-semibold">
										{totals.totalQuantity.toFixed(2)}
									</TableCell>
									<TableCell className="text-gray-300 font-semibold">
										{totals.totalWeight.toFixed(2)}
									</TableCell>
									<TableCell colSpan={5} />
								</TableRow>
							</TableFooter>
						</Table>
					</div>
				</CardContent>
			</Card>
			<DeleteModal
				isOpen={isDeleteModalOpen}
				onClose={handleCloseDeleteModal}
				onConfirm={handleConfirmDelete}
				itemsToDelete={pendingDeletion}
				itemSummaries={pendingSummaries}
			/>
		</div>
	);
}
