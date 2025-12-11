'use server';

import { cacheLife, cacheTag } from 'next/cache';
import type { NormalizedLookup } from '@/lib/schemas/schema-lookup-data';
import { orpcServerClient } from '@/lib/orpc.server';
import type { SaleOrderLookups } from '@/lib/lookup-types';

const LOOKUP_CACHE_LIFE = 'days' as const;

export async function getLookupByCode(
	code: string
): Promise<NormalizedLookup[]> {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag(`lookup:${code}`);
	const data = await orpcServerClient.lookups.getLookupData({
		lookupCode: code,
	});
	return Array.isArray(data) ? data : [];
}

export async function getVoucherTypes() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_FHP_TYPE');
	return getLookupByCode('SORD_FHP_TYPE');
}

export async function getSaleVTypes() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_FHP_Sale_VType');
	return getLookupByCode('SORD_FHP_Sale_VType');
}

export async function getCustomers() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_CUSTOMER');
	return getLookupByCode('SORD_CUSTOMER');
}

export async function getCities() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_FHP_City');
	return getLookupByCode('SORD_FHP_City');
}

export async function getOrderTypes() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_FHP_OrderType');
	return getLookupByCode('SORD_FHP_OrderType');
}

export async function getItems() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_FHPGD_Item');
	return getLookupByCode('SORD_FHPGD_Item');
}

export async function getBFs() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_FHPGD_BF');
	return getLookupByCode('SORD_FHPGD_BF');
}

export async function getSizeUnits() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_FHPGD_SizeUnit');
	return getLookupByCode('SORD_FHPGD_SizeUnit');
}

export async function getGrains() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_FHPGD_Grain');
	return getLookupByCode('SORD_FHPGD_Grain');
}

export async function getGSMs() {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('lookup:SORD_FHPGD_GSM');
	return getLookupByCode('SORD_FHPGD_GSM');
}

export async function getSaleOrderLookups(): Promise<SaleOrderLookups> {
	'use cache';
	cacheLife(LOOKUP_CACHE_LIFE);
	cacheTag('sale-order-lookups');

	const [
		voucherTypes,
		saleVTypes,
		customers,
		cities,
		orderTypes,
		items,
		bfs,
		sizeUnits,
		grains,
		gsms,
	] = await Promise.all([
		getVoucherTypes(),
		getSaleVTypes(),
		getCustomers(),
		getCities(),
		getOrderTypes(),
		getItems(),
		getBFs(),
		getSizeUnits(),
		getGrains(),
		getGSMs(),
	]);

	return {
		voucherTypes,
		saleVTypes,
		customers,
		cities,
		orderTypes,
		items,
		bfs,
		sizeUnits,
		grains,
		gsms,
	};
}
