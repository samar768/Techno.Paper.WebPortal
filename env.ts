import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		NEXT_PAPERSOFT_FETCH_ALL_URL: z.string().url(),
		NEXT_PAPERSOFT_FETCH_SINGLE_URL: z.string().url(),
		NEXT_PAPERSOFT_LOOKUPS_URL: z.string().url(),
		NEXT_PAPERSOFT_POST_URL: z.string().url(),
		NEXT_PAPERSOFT_SCHEMA_URL: z.string().url(),
	},
	experimental__runtimeEnv: process.env,
});
