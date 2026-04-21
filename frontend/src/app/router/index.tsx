import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Spinner } from "../../components/ui/Spinner";
import { useAuth } from "../providers/AuthProvider";
import { ClientsPage } from "../../pages/ClientsPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { LoginPage } from "../../pages/LoginPage";
import { OpportunitiesPage } from "../../pages/OpportunitiesPage";
import { TasksPage } from "../../pages/TasksPage";

const ProtectedRoute = () => {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

const PublicRoute = () => {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Route>
    </Routes>
  );
};
