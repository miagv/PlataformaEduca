import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "../layout/AppLayout";
import NotFoundPage from "../common/NotFoundPage";
import ProtectedRoute from "../guards/ProtectedRoute";
import RoleRoute from "../guards/RoleRoute";

import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CursosPage from "../features/cursos/pages/CursosPage";
import DocentesPage from "../features/docentes/pages/DocentesPage";
import EstudiantesPage from "../features/estudiantes/pages/EstudiantesPage";
import EvaluacionesPage from "../features/evaluaciones/pages/EvaluacionesPage";
import NotasPage from "../features/notas/pages/NotasPage";
import ReportesPage from "../features/reportes/pages/ReportesPage";
import SalonesPage from "../features/salones/pages/SalonesPage";
import CoordinadoresPage from "../features/coordinadores/pages/CoordinadoresPage";

import ComingSoonPage from "../features/shared/pages/ComingSoonPage";

import { ROLES } from "../utils/roles";

const router = createBrowserRouter([
  // Public routes (no auth required)
  { path: "/login", element: <LoginPage /> },
  { path: "/recuperar-contrasena", element: <ForgotPasswordPage /> },
  { path: "/restablecer-contrasena", element: <ResetPasswordPage /> },

  // Protected routes (auth required)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Navigate to="/dashboard" replace /> },
          { path: "/dashboard", element: <DashboardPage /> },

          // Routes for ADMIN + DOCENTE
          {
            element: <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCENTE]} />,
            children: [
              { path: "/cursos", element: <CursosPage /> },
              { path: "/evaluaciones", element: <EvaluacionesPage /> },
              { path: "/notas", element: <NotasPage /> },
              { path: "/reportes", element: <ReportesPage /> },
              { path: "/salones", element: <SalonesPage /> },
              { path: "/estudiantes", element: <EstudiantesPage /> },
            ],
          },

          // Routes for ADMIN only
          {
            element: <RoleRoute allowedRoles={[ROLES.ADMIN]} />,
            children: [
              { path: "/docentes", element: <DocentesPage /> },
              { path: "/coordinadores", element: <CoordinadoresPage /> },
            ],
          },

          // Routes for ESTUDIANTE only
          {
            element: <RoleRoute allowedRoles={[ROLES.ESTUDIANTE]} />,
            children: [
              {
                path: "/mi-progreso",
                element: (
                  <ComingSoonPage
                    title="Mi progreso académico"
                    description="Aquí podrás revisar tu promedio personal, evolución de notas y rendimiento por curso."
                  />
                ),
              },
              {
                path: "/mis-evaluaciones",
                element: (
                  <ComingSoonPage
                    title="Mis evaluaciones"
                    description="Aquí aparecerán las evaluaciones relacionadas con tus cursos y sus fechas programadas."
                  />
                ),
              },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

export default router;
