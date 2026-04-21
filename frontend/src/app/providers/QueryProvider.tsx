import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        keepPreviousData: true
      },
      mutations: {
        retry: 0
      }
    }
  });

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
