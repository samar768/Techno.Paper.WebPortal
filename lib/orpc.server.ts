import 'server-only';

import { createRouterClient } from '@orpc/server';
import { router } from '../router/';
import type { RouterClient } from '@orpc/server';

globalThis.$client = createRouterClient(router, {
	/**
	 * Provide initial context if needed.
	 *
	 * Because this client instance is shared across all requests,
	 * only include context that's safe to reuse globally.
	 * For per-request context, use middleware context or pass a function as the initial context.
	 */
	context: async () => ({}),
});

export const orpcServerClient = globalThis.$client as RouterClient<
	typeof router
>;
