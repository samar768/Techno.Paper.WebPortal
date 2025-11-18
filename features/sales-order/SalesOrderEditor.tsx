'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SalesOrderHeader from '@/features/sales-order/SalesOrderHeader';
import SalesOrderDetails from '@/features/sales-order/SalesOrderDetails';
import SalesOrderTermsConditions from '@/features/sales-order/SalesOrderTermsConditions';
import SalesOrderExpenses from '@/features/sales-order/SalesOrderExpenses';
import SalesOrderFooterOption1 from '@/features/sales-order/SalesOrderFooter';
import type { SaleOrderLookups } from '@/lib/lookup-types';

type SectionKey = 'header' | 'details' | 'expenses' | 'terms';

type SalesOrderEditorProps = {
	lookups: SaleOrderLookups;
	startEmptyLines?: boolean;
};

const createCleanDirtyState = (): Record<SectionKey, boolean> => ({
	header: false,
	details: false,
	expenses: false,
	terms: false,
});

export default function SalesOrderEditor({
	lookups,
	startEmptyLines = false,
}: SalesOrderEditorProps) {
	const [dirtySections, setDirtySections] = useState<
		Record<SectionKey, boolean>
	>(() => createCleanDirtyState());
	const [resetToken, setResetToken] = useState(0);
	const headerSaveHandlerRef = useRef<(() => boolean) | null>(null);

	const hasChanges = useMemo(
		() => Object.values(dirtySections).some(Boolean),
		[dirtySections]
	);

	const handleDirtyChange = useCallback(
		(section: SectionKey, dirty: boolean) => {
			setDirtySections((prev) => {
				if (prev[section] === dirty) {
					return prev;
				}
				return { ...prev, [section]: dirty };
			});
		},
		[]
	);

	const registerHeaderSaveHandler = useCallback((handler: () => boolean) => {
		headerSaveHandlerRef.current = handler;
	}, []);

	const handleSave = useCallback(() => {
		if (!hasChanges) {
			return;
		}

		const result = headerSaveHandlerRef.current
			? headerSaveHandlerRef.current()
			: true;

		if (!result) {
			return;
		}

		setDirtySections(createCleanDirtyState());
		setResetToken((token) => token + 1);
	}, [hasChanges]);

	return (
		<div className="space-y-4 pb-16">
			<div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-purple-800/60 bg-gray-900/60 p-4">
				<div>
					<p className="text-sm uppercase tracking-wider text-purple-200/80">
						Sales Order Actions
					</p>
					<p className="text-lg font-semibold text-white">
						{hasChanges
							? 'Unsaved changes detected'
							: 'All changes saved'}
					</p>
				</div>
				<Button
					data-dirty={hasChanges}
					onClick={handleSave}
					disabled={!hasChanges}
					className={`flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 ${
						hasChanges
							? 'bg-amber-500 text-gray-900 hover:bg-amber-500/90 shadow-lg shadow-amber-400/40'
							: ''
					}`}
				>
					<Save className="h-4 w-4" />
					Save Changes
				</Button>
			</div>

			<SalesOrderHeader
				lookups={lookups}
				onDirtyChange={(dirty) => handleDirtyChange('header', dirty)}
				onRegisterSaveHandler={registerHeaderSaveHandler}
				resetToken={resetToken}
			/>

			<SalesOrderDetails
				lookups={lookups}
				onDirtyChange={(dirty) => handleDirtyChange('details', dirty)}
				resetToken={resetToken}
				startEmpty={startEmptyLines}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<SalesOrderTermsConditions
					onDirtyChange={(dirty) => handleDirtyChange('terms', dirty)}
					resetToken={resetToken}
				/>
				<SalesOrderExpenses
					onDirtyChange={(dirty) =>
						handleDirtyChange('expenses', dirty)
					}
					resetToken={resetToken}
				/>
			</div>

			<SalesOrderFooterOption1 />
		</div>
	);
}
