'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

type ExpenseRow = {
	heads: string;
	per: number;
	amount: number;
};

const initialExpenses: ExpenseRow[] = [
	{ heads: 'Gross Amount', per: 0.0, amount: 227450.0 },
	{ heads: 'Bill Amount', per: 0.0, amount: 0.0 },
	{ heads: 'Round Off', per: 0.0, amount: 0.0 },
	{ heads: 'Net Amount', per: 0.0, amount: 0.0 },
];

type SalesOrderExpensesProps = {
	onDirtyChange?: (dirty: boolean) => void;
	resetToken?: number;
};

export default function SalesOrderExpenses({
	onDirtyChange,
	resetToken = 0,
	readOnly: _readOnly,
}: SalesOrderExpensesProps) {
	const [rows, setRows] = useState<ExpenseRow[]>(() => [...initialExpenses]);
	const [baselineRows, setBaselineRows] = useState<ExpenseRow[]>(() => [
		...initialExpenses,
	]);
	const latestRowsRef = useRef(rows);

	const handleRowChange = useCallback(
		(index: number, key: keyof ExpenseRow, value: number) => {
			setRows((prev) =>
				prev.map((row, idx) =>
					idx === index
						? {
								...row,
								[key]: Number.isFinite(value) ? value : 0,
						  }
						: row
				)
			);
		},
		[]
	);

	useEffect(() => {
		latestRowsRef.current = rows;
	}, [rows]);

	useEffect(() => {
		setBaselineRows(latestRowsRef.current);
	}, [resetToken]);

	const rowsSignature = useMemo(() => JSON.stringify(rows), [rows]);
	const baselineSignature = useMemo(
		() => JSON.stringify(baselineRows),
		[baselineRows]
	);
	const isDirty = rowsSignature !== baselineSignature;

	useEffect(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);

	const numericInputClassName =
		'w-24 bg-purple-950/40 border border-purple-800/60 text-right text-white focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-purple-500 h-8';

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
							{rows.map((row, idx) => (
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
										<Input
											type="number"
											step="0.001"
											value={row.per}
											readOnly
											disabled
											onChange={(event) =>
												handleRowChange(
													idx,
													'per',
													Number.parseFloat(
														event.target.value
													)
												)
											}
											className={numericInputClassName}
										/>
									</TableCell>
									<TableCell className="text-gray-300 text-right">
										<Input
											type="number"
											step="0.01"
											value={row.amount}
											readOnly
											disabled
											onChange={(event) =>
												handleRowChange(
													idx,
													'amount',
													Number.parseFloat(
														event.target.value
													)
												)
											}
											className={numericInputClassName}
										/>
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
