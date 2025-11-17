'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { orpcClient } from '@/lib/orpc';
import {
	normalizeLookup,
	type NormalizedLookup,
} from '@/lib/schemas/schema-lookup-data';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput } from '@/components/ui/command';
import { Button } from '@/components/ui/button';

interface LookupSelectProps {
	lookupCode: string;
	value?: NormalizedLookup | null;
	onChange?: (value: NormalizedLookup | null) => void;
	items?: NormalizedLookup[];
}

/**
 * Normalizes lookup records into NormalizedLookup for the combobox.
 */
function normalizeLookupArray(raw: unknown[]): NormalizedLookup[] {
	const normalized = raw.map((item) => {
		let norm = normalizeLookup(item);

		const hasHeaders =
			Array.isArray(norm.ColumnHeaders) && norm.ColumnHeaders.length > 0;
		if (!hasHeaders) {
			try {
				function findCandidate(obj: any): any | null {
					if (!obj || typeof obj !== 'object') return null;
					const keys = Object.keys(obj || {});
					if (keys.length > 2) return obj;
					for (const prop of [
						'data',
						'Data',
						'row',
						'Row',
						'values',
						'Values',
						'columns',
						'Columns',
						'record',
						'Record',
					]) {
						if (obj[prop] && typeof obj[prop] === 'object')
							return obj[prop];
					}
					return null;
				}

				const candidate = findCandidate(item as any);
				if (
					candidate &&
					typeof candidate === 'object' &&
					!Array.isArray(candidate)
				) {
					if (candidate.ColumnHeaders) {
						let headers: string[] = [];
						if (Array.isArray(candidate.ColumnHeaders)) {
							headers = candidate.ColumnHeaders.map((h: any) =>
								h == null ? '' : String(h).trim()
							).filter((h: string) => h.length > 0);
						} else if (
							typeof candidate.ColumnHeaders === 'string'
						) {
							headers = candidate.ColumnHeaders.split(/[|,;]+/)
								.map((s: string) => s.trim())
								.filter((s: string) => s.length > 0);
						}

						let additional: string[] = [];
						if (Array.isArray(candidate.Additional)) {
							additional = candidate.Additional.map((v: any) =>
								v == null ? '' : String(v)
							);
						} else if (typeof candidate.Additional === 'string') {
							additional = candidate.Additional.split(
								/[|,;]+/
							).map((s: string) => s.trim());
						} else if (
							candidate.Additional &&
							typeof candidate.Additional === 'object'
						) {
							additional = headers.map((h) => {
								const v = candidate.Additional[h];
								return v == null ? '' : String(v);
							});
						}

						if (headers.length > 0) {
							norm.ColumnHeaders = headers;
							norm.Additional = additional;
						} else {
							const skip = new Set([
								'Code',
								'Description',
								'code',
								'description',
							]);
							const entries = Object.entries(candidate).filter(
								([k]) => !skip.has(k)
							);
							if (entries.length > 0) {
								norm.ColumnHeaders = entries.map(([k]) =>
									k.toString()
								);
								norm.Additional = entries.map(([, v]) =>
									v == null ? '' : String(v)
								);
							}
						}
					}
				}
			} catch (e) {
				// If anything goes wrong, just leave norm as-is
			}
		}

		return norm;
	});

	return normalized;
}

/**
 * Pure client combobox; receives NormalizedLookup[] and renders
 * a searchable table inside the popover.
 */
function LookupCombobox({
	items,
	selected,
	onSelect,
}: {
	items: NormalizedLookup[];
	selected: NormalizedLookup | null;
	onSelect: (item: NormalizedLookup) => void;
}) {
	const ROW_HEIGHT = 36;
	const DEFAULT_VISIBLE_COUNT = 8;
	const OVERSCAN = 4;
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [scrollTop, setScrollTop] = useState(0);
	const [containerHeight, setContainerHeight] = useState(
		ROW_HEIGHT * DEFAULT_VISIBLE_COUNT
	);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Derive union of all ColumnHeaders used by any item.
	const extractHeadersFromItem = useCallback((it: any): string[] => {
		if (Array.isArray(it?.ColumnHeaders) && it.ColumnHeaders.length > 0) {
			return it.ColumnHeaders.map((h: any) =>
				(h ?? '').toString().trim()
			).filter((h: string) => h.length > 0);
		}

		if (typeof it?.ColumnHeaders === 'string' && it.ColumnHeaders.trim()) {
			return it.ColumnHeaders.split(/[|,;]+/)
				.map((s: string) => s.trim())
				.filter((s: string) => s.length > 0);
		}

		if (
			it?.Additional &&
			typeof it.Additional === 'object' &&
			!Array.isArray(it.Additional)
		) {
			return Object.keys(it.Additional).map((k) => k.toString().trim());
		}

		return [];
	}, []);

	const getValueForHeader = useCallback((it: any, header: string): string => {
		if (!it) return '';

		if (
			it?.Additional &&
			typeof it.Additional === 'object' &&
			!Array.isArray(it.Additional)
		) {
			const v = it.Additional[header];
			return v == null ? '' : String(v);
		}

		if (Array.isArray(it?.ColumnHeaders) && Array.isArray(it?.Additional)) {
			const idx = it.ColumnHeaders.findIndex(
				(h: any) => (h ?? '').toString().trim() === header
			);
			if (idx >= 0)
				return it.Additional[idx] == null
					? ''
					: String(it.Additional[idx]);
			return '';
		}

		if (
			typeof it?.ColumnHeaders === 'string' &&
			Array.isArray(it?.Additional)
		) {
			const cols = it.ColumnHeaders.split(/[|,;]+/).map((s: string) =>
				s.trim()
			);
			const idx = cols.findIndex((c: string) => c === header);
			if (idx >= 0)
				return it.Additional[idx] == null
					? ''
					: String(it.Additional[idx]);
			return '';
		}

		if (typeof it?.Additional === 'string') {
			return it.Additional;
		}

		return '';
	}, []);

	const dynamicHeaders: string[] = useMemo(
		() =>
			Array.from(
				items.reduce((set, item) => {
					for (const h of extractHeadersFromItem(item)) {
						if (h && h.length > 0) set.add(h);
					}
					return set;
				}, new Set<string>())
			),
		[extractHeadersFromItem, items]
	);

	const filteredItems = useMemo(() => {
		if (!search.trim()) return items;
		const term = search.toLowerCase();

		return items.filter((item) => {
			const inCode = item.Code.toLowerCase().includes(term);
			const inDescription = item.Description.toLowerCase().includes(term);
			const inAdditional = (item.Additional || []).some((val) =>
				(val || '').toLowerCase().includes(term)
			);

			return inCode || inDescription || inAdditional;
		});
	}, [items, search]);

	const totalCount = filteredItems.length;
	const columnCount = 2 + dynamicHeaders.length;
	const totalHeight = totalCount * ROW_HEIGHT;
	const itemsPerViewport = Math.max(
		1,
		Math.ceil(containerHeight / ROW_HEIGHT)
	);
	const startIndex = Math.max(
		0,
		Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN
	);
	const endIndex = Math.min(
		totalCount,
		startIndex + itemsPerViewport + OVERSCAN * 2
	);
	const visibleItems = filteredItems.slice(startIndex, endIndex);
	const offsetTop = startIndex * ROW_HEIGHT;
	const bottomPadding = Math.max(
		0,
		totalHeight - offsetTop - visibleItems.length * ROW_HEIGHT
	);

	const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
		setScrollTop(event.currentTarget.scrollTop);
	}, []);

	useEffect(() => {
		if (!open) return;

		const node = scrollContainerRef.current;
		if (!node) return;

		const updateHeight = () => {
			setContainerHeight(
				node.clientHeight || ROW_HEIGHT * DEFAULT_VISIBLE_COUNT
			);
		};

		updateHeight();

		let resizeObserver: ResizeObserver | null = null;

		if (typeof ResizeObserver !== 'undefined') {
			resizeObserver = new ResizeObserver(updateHeight);
			resizeObserver.observe(node);
		} else {
			window.addEventListener('resize', updateHeight);
		}

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect();
			} else {
				window.removeEventListener('resize', updateHeight);
			}
		};
	}, [DEFAULT_VISIBLE_COUNT, ROW_HEIGHT, open]);

	useEffect(() => {
		if (!open) return;
		const node = scrollContainerRef.current;
		if (node) {
			node.scrollTop = 0;
		}
		setScrollTop(0);
	}, [open, search]);

	useEffect(() => {
		const maxScroll = Math.max(0, totalHeight - containerHeight);
		if (scrollTop > maxScroll) {
			setScrollTop(maxScroll);
			if (scrollContainerRef.current) {
				scrollContainerRef.current.scrollTop = maxScroll;
			}
		}
	}, [containerHeight, scrollTop, totalHeight]);

	const handleSelect = (item: NormalizedLookup) => {
		onSelect(item);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
					type="button"
				>
					{selected
						? selected.Description || selected.Code
						: 'Select value...'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[720px] p-0">
				<Command>
					<CommandInput
						placeholder="Search..."
						value={search}
						onValueChange={setSearch}
					/>
					{totalCount === 0 ? (
						<CommandEmpty>No results found.</CommandEmpty>
					) : (
						<div
							className="max-h-80 overflow-auto"
							onScroll={handleScroll}
							ref={scrollContainerRef}
						>
							<table className="min-w-full border-collapse text-xs">
								<thead className="bg-muted">
									<tr>
										<th className="px-2 py-1 text-left font-semibold text-foreground border-b border-border whitespace-nowrap">
											Code
										</th>
										<th className="px-2 py-1 text-left font-semibold text-foreground border-b border-border whitespace-nowrap">
											Description
										</th>
										{dynamicHeaders.map((header) => (
											<th
												key={header}
												className="px-2 py-1 text-left font-semibold text-foreground border-b border-border whitespace-nowrap"
											>
												{header}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{offsetTop > 0 && (
										<tr
											aria-hidden="true"
											className="pointer-events-none"
										>
											<td
												colSpan={columnCount}
												style={{
													height: offsetTop,
													padding: 0,
												}}
											/>
										</tr>
									)}
									{visibleItems.map((item, virtualIndex) => {
										const rowIndex =
											startIndex + virtualIndex;
										const isSelected =
											!!selected &&
											selected.Code === item.Code &&
											selected.Description ===
												item.Description;

										return (
											<tr
												key={`${item.Code}-${rowIndex}`}
												onClick={() =>
													handleSelect(item)
												}
												className={cn(
													'cursor-pointer hover:bg-muted/70',
													rowIndex % 2 === 0
														? 'bg-background'
														: 'bg-muted/30',
													isSelected &&
														'bg-primary/10'
												)}
												style={{ height: ROW_HEIGHT }}
											>
												<td className="px-2 py-1 align-top border-b border-border text-foreground whitespace-nowrap">
													{item.Code}
												</td>
												<td className="px-2 py-1 align-top border-b border-border text-foreground whitespace-nowrap">
													{item.Description}
												</td>
												{dynamicHeaders.map(
													(header) => {
														const value =
															getValueForHeader(
																item as any,
																header
															);
														return (
															<td
																key={`${item.Code}-${header}`}
																className="px-2 py-1 align-top border-b border-border text-foreground whitespace-nowrap"
															>
																{value || ''}
															</td>
														);
													}
												)}
											</tr>
										);
									})}
									{bottomPadding > 0 && (
										<tr
											aria-hidden="true"
											className="pointer-events-none"
										>
											<td
												colSpan={columnCount}
												style={{
													height: bottomPadding,
													padding: 0,
												}}
											/>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	);
}

/**
 * LookupSelect component that fetches lookup data based on lookupCode
 * and provides a searchable combobox.
 */
export function LookupSelect({
	lookupCode,
	value,
	onChange,
	items: injectedItems,
}: LookupSelectProps) {
	const [items, setItems] = useState<NormalizedLookup[]>(injectedItems ?? []);
	const [loading, setLoading] = useState(injectedItems === undefined);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (injectedItems !== undefined) {
			setItems(injectedItems);
			setLoading(false);
			setError(null);
			return;
		}

		let isMounted = true;

		async function load() {
			try {
				const lookupData = await orpcClient.lookups.getLookupData({
					lookupCode,
				});

				const sourceArray = Array.isArray((lookupData as any)?.data)
					? (lookupData as any).data
					: Array.isArray(lookupData)
					? lookupData
					: [];

				const normalized = normalizeLookupArray(
					sourceArray as unknown[]
				);

				if (isMounted) {
					setItems(normalized);
				}
			} catch (e) {
				if (isMounted) {
					setError('Failed to load lookup data.');
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		load();

		return () => {
			isMounted = false;
		};
	}, [lookupCode, injectedItems]);

	if (loading) {
		return (
			<Button
				variant="outline"
				disabled
				className="w-full justify-between"
			>
				Loading...
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		);
	}

	if (error) {
		return (
			<Button
				variant="outline"
				disabled
				className="w-full justify-between"
			>
				Error loading data
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		);
	}

	return (
		<LookupCombobox
			items={items}
			selected={value || null}
			onSelect={(item) => onChange?.(item)}
		/>
	);
}
