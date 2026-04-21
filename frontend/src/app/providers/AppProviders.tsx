import { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
};
