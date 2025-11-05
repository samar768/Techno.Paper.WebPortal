'use client';

import { useState, useCallback, useMemo } from 'react';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
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
	itemSku,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemSku: string;
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-linear-to-br from-purple-950 via-purple-900 to-purple-950 border-purple-800 text-white max-w-md backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle className="text-white">
						Delete Paper Roll
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p className="text-gray-300">
						Are you sure you want to delete paper roll{' '}
						<span className="font-semibold text-white">
							{itemSku}
						</span>
						? This action cannot be undone.
					</p>
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
							className="bg-red-600 hover:bg-red-700"
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
	const [itemToDelete, setItemToDelete] = useState<string>('');
	const { toast } = useToast();

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

	const handleDelete = useCallback((sku: string) => {
		setItemToDelete(sku);
		setIsDeleteModalOpen(true);
	}, []);

	const handleConfirmDelete = useCallback(() => {
		setInventory((prev) =>
			prev.filter((item) => item.sku !== itemToDelete)
		);
		setIsDeleteModalOpen(false);
		setItemToDelete('');

		toast({
			title: 'Paper roll deleted',
			description: `${itemToDelete} has been successfully deleted.`,
			className: 'bg-green-600 text-white border-green-700',
		});
	}, [itemToDelete, toast]);

	// Removed handleSaveEdit; editing now happens on dedicated page in future

	const handleAddNew = useCallback(() => {
		router.push('/dashboard/sale-order/new');
	}, [router]);

	const handleSaveNew = useCallback(() => {
		if (editingItem) {
			const errors = validateItem(editingItem);
			if (errors.length > 0) {
				toast({
					title: 'Validation Error',
					description: errors.join('\n'),
					variant: 'destructive',
				});
				return;
			}

			// Check for duplicate SKU
			if (inventory.some((item) => item.sku === editingItem.sku)) {
				toast({
					title: 'Validation Error',
					description: 'SKU already exists. Please use a unique SKU.',
					variant: 'destructive',
				});
				return;
			}

			setInventory((prev) => [...prev, editingItem]);
			setEditingItem(null);

			toast({
				title: 'Paper roll added',
				description: `${editingItem.sku} has been successfully added to inventory.`,
				className: 'bg-green-600 text-white border-green-700',
			});
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
					<div className="flex justify-between items-center">
						<CardTitle className="text-white text-xl">
							Sale Order
						</CardTitle>
						<Button
							onClick={handleAddNew}
							className="bg-purple-600 hover:bg-purple-700 text-white"
						>
							<Plus className="h-4 w-4 mr-1" />
							Add Sale Order
						</Button>
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
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														handleDelete(item.sku)
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
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Edit now navigates to detail page */}

			{/* Add flow now navigates to /dashboard/sale-order/new */}

			<DeleteModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleConfirmDelete}
				itemSku={itemToDelete}
			/>
		</div>
	);
}
