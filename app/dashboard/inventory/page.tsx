'use client';

import { useState, useCallback, useMemo } from 'react';
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
import { Edit, Search, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

// Move EditModal outside to prevent re-creation
const EditModal = ({
	isOpen,
	onClose,
	onSave,
	title,
	editingItem,
	onInputChange,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSave: () => void;
	title: string;
	editingItem: InventoryItem | null;
	onInputChange: (field: string, value: string | number) => void;
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-linear-to-br from-purple-950 via-purple-900 to-purple-950 border-purple-800 text-white max-w-2xl backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle className="text-white">{title}</DialogTitle>
				</DialogHeader>
				{editingItem && (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="edit-sku"
									className="text-gray-300"
								>
									SKU
								</Label>
								<Input
									id="edit-sku"
									value={editingItem.sku}
									onChange={(e) =>
										onInputChange('sku', e.target.value)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="edit-weight"
									className="text-gray-300"
								>
									Weight (kg)
								</Label>
								<Input
									id="edit-weight"
									type="number"
									value={String(editingItem.weight)}
									onChange={(e) =>
										onInputChange(
											'weight',
											Number.parseFloat(e.target.value) ||
												0
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="edit-dimensions"
									className="text-gray-300"
								>
									Dimensions
								</Label>
								<Input
									id="edit-dimensions"
									value={editingItem.dimensions}
									onChange={(e) =>
										onInputChange(
											'dimensions',
											e.target.value
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="edit-material"
									className="text-gray-300"
								>
									Material
								</Label>
								<Select
									value={editingItem.material}
									onValueChange={(value) =>
										onInputChange('material', value)
									}
								>
									<SelectTrigger className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="bg-gray-800 border-gray-600 text-white">
										<SelectItem
											value="Kraft Paper"
											className="text-white hover:bg-gray-700 focus:bg-gray-700"
										>
											Kraft Paper
										</SelectItem>
										<SelectItem
											value="Newsprint"
											className="text-white hover:bg-gray-700 focus:bg-gray-700"
										>
											Newsprint
										</SelectItem>
										<SelectItem
											value="Coated Paper"
											className="text-white hover:bg-gray-700 focus:bg-gray-700"
										>
											Coated Paper
										</SelectItem>
										<SelectItem
											value="Cardboard"
											className="text-white hover:bg-gray-700 focus:bg-gray-700"
										>
											Cardboard
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="edit-location"
									className="text-gray-300"
								>
									Location
								</Label>
								<Input
									id="edit-location"
									value={editingItem.location}
									onChange={(e) =>
										onInputChange(
											'location',
											e.target.value
										)
									}
									className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="edit-status"
									className="text-gray-300"
								>
									Status
								</Label>
								<Select
									value={editingItem.status}
									onValueChange={(value) =>
										onInputChange('status', value)
									}
								>
									<SelectTrigger className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="bg-gray-800 border-gray-600 text-white">
										<SelectItem
											value="In Stock"
											className="text-white hover:bg-gray-700 focus:bg-gray-700"
										>
											In Stock
										</SelectItem>
										<SelectItem
											value="Reserved"
											className="text-white hover:bg-gray-700 focus:bg-gray-700"
										>
											Reserved
										</SelectItem>
										<SelectItem
											value="Dispatched"
											className="text-white hover:bg-gray-700 focus:bg-gray-700"
										>
											Dispatched
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex justify-end space-x-2 pt-4">
							<Button
								variant="outline"
								onClick={onClose}
								className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-400 bg-gray-800"
							>
								Cancel
							</Button>
							<Button
								onClick={onSave}
								className="bg-purple-600 hover:bg-purple-700"
							>
								Save Changes
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

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
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [locationFilter, setLocationFilter] = useState('all');
	const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<string>('');
	const [inventory, setInventory] = useState<InventoryItem[]>([
		{
			sku: 'SKU-001',
			weight: 45.2,
			dimensions: '120×80×15',
			material: 'Kraft Paper',
			productionDate: '2024-06-25',
			location: 'A-12',
			status: 'In Stock',
			qrCode: 'QR001234',
		},
		{
			sku: 'SKU-002',
			weight: 52.8,
			dimensions: '140×90×18',
			material: 'Newsprint',
			productionDate: '2024-06-24',
			location: 'B-06',
			status: 'Reserved',
			qrCode: 'QR001235',
		},
		{
			sku: 'SKU-003',
			weight: 38.1,
			dimensions: '100×70×12',
			material: 'Coated Paper',
			productionDate: '2024-06-23',
			location: 'C-15',
			status: 'Dispatched',
			qrCode: 'QR001236',
		},
		{
			sku: 'SKU-004',
			weight: 61.5,
			dimensions: '160×100×20',
			material: 'Cardboard',
			productionDate: '2024-06-22',
			location: 'A-08',
			status: 'In Stock',
			qrCode: 'QR001237',
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

	const handleEdit = useCallback((item: InventoryItem) => {
		setEditingItem({ ...item });
		setIsEditModalOpen(true);
	}, []);

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

		toast.success(`${itemToDelete} has been successfully deleted.`);
	}, [itemToDelete]);

	const handleSaveEdit = useCallback(() => {
		if (editingItem) {
			const errors = validateItem(editingItem);
			if (errors.length > 0) {
				toast.error(errors.join('\n'));
				return;
			}

			setInventory((prev) =>
				prev.map((item) =>
					item.sku === editingItem.sku ? editingItem : item
				)
			);
			setIsEditModalOpen(false);
			setEditingItem(null);
			toast.success(`${editingItem.sku} has been successfully updated.`);
		}
	}, [editingItem, toast]);

	const handleAddNew = useCallback(() => {
		setEditingItem({
			sku: '',
			weight: 0,
			dimensions: '',
			material: '',
			productionDate: '',
			location: '',
			status: 'In Stock',
			qrCode: '',
		});
		setIsAddModalOpen(true);
	}, []);

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
			setIsAddModalOpen(false);
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
					<div className="flex justify-between items-center">
						<CardTitle className="text-white text-xl">
							Paper Roll Inventory
						</CardTitle>
						<Button
							onClick={handleAddNew}
							className="bg-purple-600 hover:bg-purple-700 text-white"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Roll
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Filters */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search by SKU or material..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>
						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}
						>
							<SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-purple-500">
								<SelectValue placeholder="All Statuses" />
							</SelectTrigger>
							<SelectContent className="bg-gray-800 border-gray-600 text-white">
								<SelectItem
									value="all"
									className="text-white hover:bg-gray-700 focus:bg-gray-700"
								>
									All Statuses
								</SelectItem>
								<SelectItem
									value="in-stock"
									className="text-white hover:bg-gray-700 focus:bg-gray-700"
								>
									In Stock
								</SelectItem>
								<SelectItem
									value="reserved"
									className="text-white hover:bg-gray-700 focus:bg-gray-700"
								>
									Reserved
								</SelectItem>
								<SelectItem
									value="dispatched"
									className="text-white hover:bg-gray-700 focus:bg-gray-700"
								>
									Dispatched
								</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={locationFilter}
							onValueChange={setLocationFilter}
						>
							<SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-purple-500">
								<SelectValue placeholder="All Locations" />
							</SelectTrigger>
							<SelectContent className="bg-gray-800 border-gray-600 text-white">
								<SelectItem
									value="all"
									className="text-white hover:bg-gray-700 focus:bg-gray-700"
								>
									All Locations
								</SelectItem>
								<SelectItem
									value="a"
									className="text-white hover:bg-gray-700 focus:bg-gray-700"
								>
									Zone A
								</SelectItem>
								<SelectItem
									value="b"
									className="text-white hover:bg-gray-700 focus:bg-gray-700"
								>
									Zone B
								</SelectItem>
								<SelectItem
									value="c"
									className="text-white hover:bg-gray-700 focus:bg-gray-700"
								>
									Zone C
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
										SKU
									</TableHead>
									<TableHead className="text-gray-300">
										Weight (kg)
									</TableHead>
									<TableHead className="text-gray-300">
										Dimensions
									</TableHead>
									<TableHead className="text-gray-300">
										Material
									</TableHead>
									<TableHead className="text-gray-300">
										Production Date
									</TableHead>
									<TableHead className="text-gray-300">
										Location
									</TableHead>
									<TableHead className="text-gray-300">
										Status
									</TableHead>
									<TableHead className="text-gray-300">
										QR Code
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

			<EditModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onSave={handleSaveEdit}
				title="Edit Paper Roll"
				editingItem={editingItem}
				onInputChange={handleInputChange}
			/>

			<EditModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onSave={handleSaveNew}
				title="Add New Paper Roll"
				editingItem={editingItem}
				onInputChange={handleInputChange}
			/>

			<DeleteModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleConfirmDelete}
				itemSku={itemToDelete}
			/>
		</div>
	);
}
