import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import NotFoundPage from "../components/common/NotFoundPage";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import RoleRoute from "../components/guards/RoleRoute";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CursosPage from "../features/cursos/pages/CursosPage";
import DocentesPage from "../features/docentes/pages/DocentesPage";
import EstudiantesPage from "../features/estudiantes/pages/EstudiantesPage";
import EvaluacionesPage from "../features/evaluaciones/pages/EvaluacionesPage";
import NotasPage from "../features/notas/pages/NotasPage";
import ReportesPage from "../features/reportes/pages/ReportesPage";

import ComingSoonPage from "../features/shared/pages/ComingSoonPage";

import { ROLES } from "../utils/roles";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/registro",
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },

          {
            element: <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCENTE]} />,
            children: [
              {
                path: "/cursos",
                element: <CursosPage />,
              },
              {
                path: "/evaluaciones",
                element: <EvaluacionesPage />,
              },
              {
                path: "/notas",
                element: <NotasPage />,
              },
              {
  path: "/reportes",
  element: <ReportesPage />,
},
            ],
          },

          {
            element: <RoleRoute allowedRoles={[ROLES.ADMIN]} />,
            children: [
              {
                path: "/docentes",
                element: <DocentesPage />,
              },
              {
                path: "/estudiantes",
                element: <EstudiantesPage />,
              },
            ],
          },

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
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;