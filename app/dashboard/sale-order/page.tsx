'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'sonner';
import { Edit, Search, Plus, Trash2 } from 'lucide-react';

interface InventoryItem {
	sku: string;
	weight: number;
	dimensions: string;
	material: string;
	productionDate: string;
	location: string;
	status: string;
	qrCode: string;
}

// Delete Confirmation Modal
const DeleteModal = ({
	isOpen,
	onClose,
	onConfirm,
	itemsToDelete,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemsToDelete: string[];
}) => {
	const isMultiple = itemsToDelete.length > 1;
	const heading = isMultiple ? 'Delete Sale Orders' : 'Delete Sale Order';
	const singleLabel = itemsToDelete[0] ?? 'this sale order';

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
									{itemsToDelete.length}
								</span>{' '}
								sale orders? This action cannot be undone.
							</p>
							<div className="rounded-md border border-purple-700/60 bg-purple-900/30 p-3">
								<ul className="space-y-1 text-sm text-gray-200">
									{itemsToDelete.map((sku) => (
										<li key={sku} className="truncate">
											{sku}
										</li>
									))}
								</ul>
							</div>
						</>
					) : (
						<p className="text-gray-300">
							Are you sure you want to delete sale order{' '}
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

export default function InventoryPage() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [locationFilter, setLocationFilter] = useState('all');
	const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
	const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
	const selectAllRef = useRef<HTMLInputElement | null>(null);

	const [inventory, setInventory] = useState<InventoryItem[]>([
		{
			sku: 'DMZSOGST 2021 10',
			weight: 14561,
			dimensions: 'A.R. ENTERPRISE',
			material: 'Dynamic Enterprise',
			productionDate: '2024-06-25',
			location: '2,567,321',
			status: 'In Stock',
			qrCode: 'SOVAN',
		},
		{
			sku: 'DMZSOGST 2021 11',
			weight: 78945,
			dimensions: 'BENGAL BOX',
			material: 'MAA Paper Agency',
			productionDate: '2024-06-24',
			location: '156,890',
			status: 'Reserved',
			qrCode: 'CHAUHAN',
		},
		{
			sku: 'DMZSOGST 2021 12',
			weight: 23467,
			dimensions: 'BISWAS ENTERPRISES',
			material: 'Chandan Majumdar',
			productionDate: '2024-06-23',
			location: '250,670',
			status: 'Dispatched',
			qrCode: 'ARYABHATT',
		},
		{
			sku: 'DMZSOGST 2021 04',
			weight: 13009,
			dimensions: 'IMPACT',
			material: 'MAA Paper Agency',
			productionDate: '2024-06-22',
			location: '1,789,345',
			status: 'In Stock',
			qrCode: 'SOVAN',
		},
	]);

	const filteredInventory = useMemo(() => {
		return inventory.filter((item) => {
			const matchesSearch =
				item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.material.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus =
				statusFilter === 'all' ||
				item.status.toLowerCase().replace(' ', '-') === statusFilter;
			const matchesLocation =
				locationFilter === 'all' ||
				item.location.charAt(0).toLowerCase() === locationFilter;

			return matchesSearch && matchesStatus && matchesLocation;
		});
	}, [inventory, searchTerm, statusFilter, locationFilter]);

	const filteredSelectedCount = useMemo(() => {
		return filteredInventory.reduce(
			(count, item) =>
				selectedSkus.includes(item.sku) ? count + 1 : count,
			0
		);
	}, [filteredInventory, selectedSkus]);

	const areAllFilteredSelected =
		filteredInventory.length > 0 &&
		filteredSelectedCount === filteredInventory.length;

	useEffect(() => {
		if (selectAllRef.current) {
			selectAllRef.current.indeterminate =
				filteredSelectedCount > 0 && !areAllFilteredSelected;
		}
	}, [areAllFilteredSelected, filteredSelectedCount]);

	useEffect(() => {
		setSelectedSkus((prev) =>
			prev.filter((sku) => inventory.some((item) => item.sku === sku))
		);
	}, [inventory]);

	// Validation function
	const validateItem = (item: InventoryItem): string[] => {
		const errors: string[] = [];
		if (!item.sku.trim()) errors.push('SKU is required');
		if (!item.weight || item.weight <= 0)
			errors.push('Weight must be greater than 0');
		if (!item.material.trim()) errors.push('Material type is required');
		return errors;
	};

	// Stable callback that won't cause re-renders
	const handleInputChange = useCallback(
		(field: string, value: string | number) => {
			setEditingItem((prev) =>
				prev ? { ...prev, [field]: value } : null
			);
		},
		[]
	);

	const handleEdit = useCallback(
		(item: InventoryItem) => {
			router.push(
				`/dashboard/sale-order/${encodeURIComponent(item.sku)}`
			);
		},
		[router]
	);

	const handleToggleSelect = useCallback((sku: string) => {
		setSelectedSkus((prev) =>
			prev.includes(sku)
				? prev.filter((value) => value !== sku)
				: [...prev, sku]
		);
	}, []);

	const handleToggleSelectAll = useCallback(() => {
		const filteredSkus = filteredInventory.map((item) => item.sku);
		const filteredSet = new Set(filteredSkus);

		setSelectedSkus((prev) => {
			const prevSet = new Set(prev);
			const shouldUnselect = filteredSkus.every((sku) =>
				prevSet.has(sku)
			);

			if (shouldUnselect) {
				return prev.filter((sku) => !filteredSet.has(sku));
			}

			const next = [...prev];
			filteredSkus.forEach((sku) => {
				if (!prevSet.has(sku)) {
					next.push(sku);
				}
			});
			return next;
		});
	}, [filteredInventory]);

	const handleDelete = useCallback((sku: string) => {
		setItemsToDelete([sku]);
		setIsDeleteModalOpen(true);
	}, []);

	const handleBulkDelete = useCallback(() => {
		setItemsToDelete((prev) =>
			selectedSkus.length ? [...selectedSkus] : prev
		);
		if (selectedSkus.length) {
			setIsDeleteModalOpen(true);
		}
	}, [selectedSkus]);

	const handleCloseDeleteModal = useCallback(() => {
		setIsDeleteModalOpen(false);
		setItemsToDelete([]);
	}, []);

	const handleConfirmDelete = useCallback(() => {
		if (itemsToDelete.length === 0) {
			return;
		}

		const deletingSkus = [...itemsToDelete];
		setInventory((prev) =>
			prev.filter((item) => !deletingSkus.includes(item.sku))
		);
		setSelectedSkus((prev) =>
			prev.filter((sku) => !deletingSkus.includes(sku))
		);
		setIsDeleteModalOpen(false);
		setItemsToDelete([]);

		if (deletingSkus.length === 1) {
			toast.success(`${deletingSkus[0]} has been successfully deleted.`);
			return;
		}

		toast.success(
			`${deletingSkus.length} sale orders have been successfully deleted.`
		);
	}, [itemsToDelete]);

	// Removed handleSaveEdit; editing now happens on dedicated page in future

	const handleAddNew = useCallback(() => {
		router.push('/dashboard/sale-order/new');
	}, [router]);

	const handleSaveNew = useCallback(() => {
		if (editingItem) {
			const errors = validateItem(editingItem);
			if (errors.length > 0) {
				toast.error(errors.join('\n'));
				return;
			}

			// Check for duplicate SKU
			if (inventory.some((item) => item.sku === editingItem.sku)) {
				toast.error('SKU already exists. Please use a unique SKU.');
				return;
			}

			setInventory((prev) => [...prev, editingItem]);
			setEditingItem(null);

			toast.success(
				`${editingItem.sku} has been successfully added to inventory.`
			);
		}
	}, [editingItem, inventory, toast]);

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'In Stock':
				return (
					<Badge className="bg-green-600 hover:bg-green-700">
						In Stock
					</Badge>
				);
			case 'Reserved':
				return (
					<Badge className="bg-yellow-600 hover:bg-yellow-700">
						Reserved
					</Badge>
				);
			case 'Dispatched':
				return (
					<Badge className="bg-blue-600 hover:bg-blue-700">
						Dispatched
					</Badge>
				);
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	return (
		<div className="space-y-6">
			<Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
				<CardHeader>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle className="text-white text-xl">
							Sale Order
						</CardTitle>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
							<div className="flex items-center gap-2">
								<Button
									variant="destructive"
									onClick={handleBulkDelete}
									disabled={selectedSkus.length === 0}
									className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/40 disabled:text-red-200/60"
								>
									<Trash2 className="h-4 w-4" />
									Delete Selected
								</Button>
								{selectedSkus.length > 0 && (
									<Badge className="bg-purple-900/70 text-purple-100 border border-purple-700/70">
										{selectedSkus.length} selected
									</Badge>
								)}
							</div>
							<Button
								onClick={handleAddNew}
								className="bg-purple-600 hover:bg-purple-700 text-white"
							>
								<Plus className="h-4 w-4 mr-1" />
								Add Sale Order
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Filters */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search by Document ID or Party Name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>
						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}
						>
							<SelectTrigger className="w-full sm:w-[180px] bg-purple-800/50 border-purple-700 text-white focus:ring-2 focus:ring-purple-500">
								<SelectValue placeholder="All Statuses" />
							</SelectTrigger>
							<SelectContent className="bg-purple-900 border-purple-700 text-white">
								<SelectItem
									value="all"
									className="text-white hover:bg-purple-600/30 focus:bg-purple-400/30 focus:text-white"
								>
									All Statuses
								</SelectItem>
								<SelectItem
									value="in-stock"
									className="text-white hover:bg-purple-600/30 focus:bg-purple-400/30 focus:text-white"
								>
									In Stock
								</SelectItem>
								<SelectItem
									value="reserved"
									className="text-white hover:bg-purple-600/30 focus:bg-purple-400/30 focus:text-white"
								>
									Reserved
								</SelectItem>
								<SelectItem
									value="dispatched"
									className="text-white hover:bg-purple-600/30 focus:bg-purple-400/30 focus:text-white"
								>
									Dispatched
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Inventory Table */}
					<div className="rounded-lg border border-gray-700 overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/50">
									<TableHead className="w-12 text-gray-300">
										<input
											ref={selectAllRef}
											type="checkbox"
											onChange={handleToggleSelectAll}
											checked={areAllFilteredSelected}
											disabled={
												filteredInventory.length === 0
											}
											className="h-4 w-4 cursor-pointer accent-purple-500"
											aria-label="Select all sale orders"
										/>
									</TableHead>
									<TableHead className="text-gray-300">
										Document ID
									</TableHead>
									<TableHead className="text-gray-300">
										Party Order No
									</TableHead>
									<TableHead className="text-gray-300">
										Party Name
									</TableHead>
									<TableHead className="text-gray-300">
										Delivery At
									</TableHead>
									<TableHead className="text-gray-300">
										Delivery Date
									</TableHead>
									<TableHead className="text-gray-300">
										Total Amount
									</TableHead>
									<TableHead className="text-gray-300">
										Status
									</TableHead>
									<TableHead className="text-gray-300">
										Approved By
									</TableHead>
									<TableHead className="text-gray-300">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredInventory.map((item) => (
									<TableRow
										key={item.sku}
										className="border-gray-700 hover:bg-gray-800/30"
									>
										<TableCell className="w-12 text-gray-300">
											<input
												type="checkbox"
												checked={selectedSkus.includes(
													item.sku
												)}
												onChange={() =>
													handleToggleSelect(item.sku)
												}
												className="h-4 w-4 cursor-pointer accent-purple-500"
												aria-label={`Select sale order ${item.sku}`}
											/>
										</TableCell>
										<TableCell className="font-medium text-white">
											{item.sku}
										</TableCell>
										<TableCell className="text-gray-300">
											{item.weight}
										</TableCell>
										<TableCell className="text-gray-300">
											{item.dimensions}
										</TableCell>
										<TableCell className="text-gray-300">
											{item.material}
										</TableCell>
										<TableCell className="text-gray-300">
											{item.productionDate}
										</TableCell>
										<TableCell className="text-gray-300">
											{item.location}
										</TableCell>
										<TableCell>
											{getStatusBadge(item.status)}
										</TableCell>
										<TableCell className="text-gray-300 font-mono text-sm">
											{item.qrCode}
										</TableCell>
										<TableCell>
											<div className="flex space-x-2">
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														handleEdit(item)
													}
													className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/20"
												>
													<Edit className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Edit now navigates to detail page */}

			{/* Add flow now navigates to /dashboard/sale-order/new */}

			<DeleteModal
				isOpen={isDeleteModalOpen}
				onClose={handleCloseDeleteModal}
				onConfirm={handleConfirmDelete}
				itemsToDelete={itemsToDelete}
			/>
		</div>
	);
}
