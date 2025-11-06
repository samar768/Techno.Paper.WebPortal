'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const frameworks = [
	{
		value: 'next.js',
		label: 'Next.js',
	},
	{
		value: 'sveltekit',
		label: 'SvelteKit',
	},
	{
		value: 'nuxt.js',
		label: 'Nuxt.js',
	},
	{
		value: 'remix',
		label: 'Remix',
	},
	{
		value: 'astro',
		label: 'Astro',
	},
];

export default function SalesOrderHeader() {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');

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
			</div>

			<Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
				<CardHeader>
					<CardTitle className="text-white text-xl">
						Sales Order Header Details
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label
								htmlFor="materialType"
								className="text-gray-300"
							>
								Voucher Type{' '}
								<span className="text-red-400">*</span>
							</Label>
							<Select value="" onValueChange={() => {}}>
								<SelectTrigger className="w-full bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
									<SelectValue placeholder="Select material type" />
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-600 text-white">
									<SelectItem
										value="kraft-paper"
										className="text-white hover:bg-gray-700 focus:bg-gray-700"
									>
										Kraft Paper
									</SelectItem>
									<SelectItem
										value="newsprint"
										className="text-white hover:bg-gray-700 focus:bg-gray-700"
									>
										Newsprint
									</SelectItem>
									<SelectItem
										value="coated-paper"
										className="text-white hover:bg-gray-700 focus:bg-gray-700"
									>
										Coated Paper
									</SelectItem>
									<SelectItem
										value="cardboard"
										className="text-white hover:bg-gray-700 focus:bg-gray-700"
									>
										Cardboard
									</SelectItem>
									<SelectItem
										value="tissue-paper"
										className="text-white hover:bg-gray-700 focus:bg-gray-700"
									>
										Tissue Paper
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="weight" className="text-gray-300">
								Weight (kg){' '}
								<span className="text-red-400">*</span>
							</Label>
							<Input
								id="weight"
								placeholder="e.g., 45.2"
								value={''}
								onChange={() => {}}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
