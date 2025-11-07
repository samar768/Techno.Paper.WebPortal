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

const expensesData = [
	{ heads: 'Gross Amount', per: 0.0, amount: 227450.0 },
	{ heads: 'Bill Amount', per: 0.0, amount: 0.0 },
	{ heads: 'Round Off', per: 0.0, amount: 0.0 },
	{ heads: 'Net Amount', per: 0.0, amount: 0.0 },
];

export default function SalesOrderExpenses() {
	return (
		<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-white text-xl">Expenses</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-lg border border-purple-900 overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="bg-gray-800/50 border-purple-900 hover:bg-gray-800/50">
								<TableHead className="text-gray-300">
									Heads
								</TableHead>
								<TableHead className="text-gray-300 text-right">
									Per
								</TableHead>
								<TableHead className="text-gray-300 text-right">
									Amount
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{expensesData.map((row, idx) => (
								<TableRow
									key={idx}
									className={`border-purple-900 hover:bg-gray-800/30 ${
										idx % 2 === 0
											? 'bg-gray-800/20'
											: 'bg-gray-800/10'
									}`}
								>
									<TableCell className="text-gray-200">
										{row.heads}
									</TableCell>
									<TableCell className="text-gray-300 text-right">
										{row.per.toFixed(3)}
									</TableCell>
									<TableCell className="text-gray-300 text-right">
										{row.amount.toFixed(2)}
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
