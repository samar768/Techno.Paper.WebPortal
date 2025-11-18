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

type TermRow = {
	fieldName: string;
	value: string;
};

const initialTerms: TermRow[] = [
	{ fieldName: 'Duty & taxes', value: 'ED+VAT+INS' },
	{ fieldName: 'Freight', value: 'To Pay' },
	{ fieldName: 'Remark', value: '' },
	{ fieldName: 'Delivery', value: '' },
];

type SalesOrderTermsConditionsProps = {
	onDirtyChange?: (dirty: boolean) => void;
	resetToken?: number;
};

export default function SalesOrderTermsConditions({
	onDirtyChange,
	resetToken = 0,
}: SalesOrderTermsConditionsProps) {
	const [rows, setRows] = useState<TermRow[]>(() => [...initialTerms]);
	const [baselineRows, setBaselineRows] = useState<TermRow[]>(() => [
		...initialTerms,
	]);
	const latestRowsRef = useRef(rows);

	const handleValueChange = useCallback((index: number, value: string) => {
		setRows((prev) =>
			prev.map((row, idx) =>
				idx === index
					? {
							...row,
							value,
					  }
					: row
			)
		);
	}, []);

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
										{row.fieldName}
									</TableCell>
									<TableCell className="text-gray-300">
										<Input
											value={row.value}
											readOnly
											disabled
											onChange={(event) =>
												handleValueChange(
													idx,
													event.target.value
												)
											}
											className="w-full bg-purple-950/40 border border-purple-800/60 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-purple-500"
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
