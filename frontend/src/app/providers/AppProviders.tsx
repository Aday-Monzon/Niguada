import { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
};
