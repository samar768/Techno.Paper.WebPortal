import type { NormalizedLookup } from '@/lib/schemas/schema-lookup-data';

export type SaleOrderLookups = {
	voucherTypes: NormalizedLookup[];
	saleVTypes: NormalizedLookup[];
	customers: NormalizedLookup[];
	cities: NormalizedLookup[];
	orderTypes: NormalizedLookup[];
	items: NormalizedLookup[];
	bfs: NormalizedLookup[];
	sizeUnits: NormalizedLookup[];
	grains: NormalizedLookup[];
	gsms: NormalizedLookup[];
};
