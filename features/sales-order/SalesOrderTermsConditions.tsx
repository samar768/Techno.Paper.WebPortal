'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

const termsData = [
	{ fieldName: 'Duty & taxes', value: 'ED+VAT+INS' },
	{ fieldName: 'Freight', value: 'To Pay' },
	{ fieldName: 'Remark', value: '' },
	{ fieldName: 'Delivery', value: '' },
];

export default function SalesOrderTermsConditions() {
	return (
		<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-white text-xl">
					Terms & Conditions
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-lg border border-purple-900 overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="bg-gray-800/50 border-purple-900 hover:bg-gray-800/50">
								<TableHead className="text-gray-300">
									Field Name
								</TableHead>
								<TableHead className="text-gray-300">
									Value
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{termsData.map((row, idx) => (
								<TableRow
									key={idx}
									className={`border-purple-900 hover:bg-gray-800/30 ${
										idx % 2 === 0
											? 'bg-gray-800/20'
											: 'bg-gray-800/10'
									}`}
								>
									<TableCell className="text-gray-200">
										{row.fieldName}
									</TableCell>
									<TableCell className="text-gray-300">
										{row.value}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
