import { os } from '@orpc/server';
import { z } from 'zod';
import { env } from '@/env';
import {
	schemaTransformers,
	NormalizedLookup,
} from '@/lib/schemas/schema-lookup-data';

// TODO:
// Implement caching via middleware https://orpc.unnoq.com/docs/middleware#middleware-output

const getLookupData = os
	.input(z.object({ lookupCode: z.string() }))
	.handler(async ({ input }) => {
		try {
			// fetch lookup data from the API
			const url = `${env.NEXT_PAPERSOFT_LOOKUPS_URL}?LookupCode=${input.lookupCode}`;
			const response = await fetch(url);
			const jsonData = await response.json();

			// check if an error exists
			if (jsonData?.Error) {
				console.error('Error fetching lookup data:', jsonData.Error);
				return [];
			}

			// retrieve json data
			const rawData = jsonData.Data ? JSON.parse(jsonData.Data) : null;
			if (!rawData) {
				console.error('No data found in response');
				return [];
			}

			// try each schema in turn and return the normalized data
			for (const { schema, transform } of schemaTransformers) {
				const validation = schema.safeParse(
					Array.isArray(rawData) ? rawData[0] : rawData
				);
				if (validation.success) {
					const normalized: NormalizedLookup[] = (
						Array.isArray(rawData) ? rawData : [rawData]
					).map(transform);
					return normalized;
				}
			}
		} catch (error) {
			console.error('Error fetching lookup data:', error);
			return [];
		}
	});

export const router = {
	lookups: {
		getLookupData,
	},
};
