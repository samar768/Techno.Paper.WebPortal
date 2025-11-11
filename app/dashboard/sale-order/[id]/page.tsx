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
import SalesOrderHeader from '@/features/sales-order/SalesOrderHeader';
import SalesOrderDetails from '@/features/sales-order/SalesOrderDetails';
import SalesOrderTermsConditions from '@/features/sales-order/SalesOrderTermsConditions';
import SalesOrderExpenses from '@/features/sales-order/SalesOrderExpenses';
import { Dock, DockIcon } from '@/components/ui/dock';
import { Separator } from '@/components/ui/separator';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	MessageCircleIcon,
	FileTextIcon,
	UploadCloudIcon,
	Link2Icon,
	SaveIcon,
	FileOutputIcon,
	FileText as FileTextLucideIcon,
	CheckCircle2Icon,
} from 'lucide-react';

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
		<>
			<div className="pb-24">
				<SalesOrderHeader />
				<br />
				<SalesOrderDetails />
				<br />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<SalesOrderTermsConditions />
					<SalesOrderExpenses />
				</div>
			</div>

			{/* Fixed bottom dock */}
			<TooltipProvider>
				<div className="fixed inset-x-0 bottom-4 z-40 flex justify-center pointer-events-none">
					<div className="w-full max-w-6xl px-4 flex justify-center pointer-events-auto">
						<Dock
							direction="middle"
							className="w-full flex items-center justify-between gap-10 bg-background/95 border border-border shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
							disableMagnification
						>
							{/* Left: icon + label vertically aligned, similar to mockup */}
							<div className="flex items-end gap-10 pl-6">
								<DockIcon className="!cursor-default">
									<div className="flex flex-col items-center gap-1">
										<div className="relative">
											<MessageCircleIcon className="h-5 w-5 text-slate-600" />
											<span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white">
												1
											</span>
										</div>
										<span className="text-[10px] font-medium text-slate-800 whitespace-nowrap">
											History & Notes
										</span>
									</div>
								</DockIcon>

								<DockIcon className="!cursor-default">
									<div className="flex flex-col items-center gap-1">
										<FileTextIcon className="h-5 w-5 text-slate-500" />
										<span className="text-[10px] font-medium text-slate-800">
											Introduction
										</span>
									</div>
								</DockIcon>

								<DockIcon className="!cursor-default">
									<div className="flex flex-col items-center gap-1">
										<UploadCloudIcon className="h-5 w-5 text-slate-500" />
										<span className="text-[10px] font-medium text-slate-800">
											Attachments
										</span>
									</div>
								</DockIcon>

								<DockIcon className="!cursor-default">
									<div className="flex flex-col items-center gap-1">
										<div className="relative">
											<Link2Icon className="h-5 w-5 text-slate-500" />
											<span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-semibold text-white">
												1
											</span>
										</div>
										<span className="text-[10px] font-medium text-slate-800">
											Links
										</span>
									</div>
								</DockIcon>
							</div>

							<Separator
								orientation="vertical"
								className="h-10 bg-border/70"
							/>

							{/* Right: action buttons */}
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									className="h-8 px-4 text-xs"
									type="button"
								>
									<SaveIcon className="mr-2 h-3 w-3" />
									Save
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="h-8 px-4 text-xs"
									type="button"
								>
									<FileOutputIcon className="mr-2 h-3 w-3" />
									Draft
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="h-8 px-4 text-xs"
									type="button"
								>
									<FileTextLucideIcon className="mr-2 h-3 w-3" />
									Print PDF
								</Button>
								<Button
									variant="default"
									size="sm"
									className="h-8 px-5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
									type="button"
								>
									<CheckCircle2Icon className="mr-2 h-3 w-3" />
									Save & Approve
								</Button>
							</div>
						</Dock>
					</div>
				</div>
			</TooltipProvider>
		</>
	);
}
