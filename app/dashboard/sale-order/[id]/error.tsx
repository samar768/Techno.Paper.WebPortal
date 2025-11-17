'use client';

import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="space-y-3 p-4 border border-red-800 bg-red-950/30 rounded">
			<h2 className="text-red-300 font-semibold">
				Something went wrong loading this sale order.
			</h2>
			<div className="text-sm text-red-200/80">{error.message}</div>
			<button
				onClick={() => reset()}
				className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
			>
				Try again
			</button>
		</div>
	);
}
