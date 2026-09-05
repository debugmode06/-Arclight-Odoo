import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Configure TanStack Query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});
/**
 * Global providers wrapper.
 * Owner: Member 1
 *
 * Add global providers here (e.g., React Query, auth context, theme).
 * Keep this file minimal — one concern per provider.
 */
export function Providers({ children }) {
    return (_jsx(QueryClientProvider, { client: queryClient, children: children }));
}
//# sourceMappingURL=providers.js.map