import { useCallback, useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import { calcularDashboard } from "../utils/dashboardCalculations";

export function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardData();
      const dashboardCalculado = calcularDashboard(data);

      setDashboard(dashboardCalculado);
    } catch (err) {
      setError(
        err.response?.data ||
          "No se pudieron cargar los datos del dashboard. Verifica que el backend esté activo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  return {
    dashboard,
    loading,
    error,
    cargarDashboard,
  };
}