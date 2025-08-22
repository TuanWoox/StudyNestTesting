import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, //5p
            refetchOnWindowFocus: true,
            refetchOnmount: false,
            refetchOnReconnect: true,
            retry: 1,
        },
    },
});

export default queryClient;
