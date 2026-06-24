import { useCallback, useEffect, useState } from "react";
import {
  createNota,
  getNotas,
  getNotasPorEstudiante,
} from "../services/notaService";

export function useNotas() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarNotas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotas();
      setNotas(data);
    } catch (err) {
      setError(
        err.response?.data ||
          "No se pudieron cargar las notas. Verifica que el backend esté activo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarNotas();
  }, [cargarNotas]);

  const cargarNotasPorEstudiante = async (estudianteId) => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotasPorEstudiante(estudianteId);
      setNotas(data);
    } catch (err) {
      setError(
        err.response?.data ||
          "No se pudieron cargar las notas del estudiante."
      );
    } finally {
      setLoading(false);
    }
  };

  const guardarNota = async (nota) => {
    try {
      setActionLoading(true);
      setError("");

      const notaGuardada = await createNota(nota);

      setNotas((prev) => [...prev, notaGuardada]);

      return notaGuardada;
    } catch (err) {
      const message =
        err.response?.data ||
        "No se pudo registrar la nota. Revisa los datos ingresados.";

      setError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    notas,
    loading,
    actionLoading,
    error,
    cargarNotas,
    cargarNotasPorEstudiante,
    guardarNota,
  };
}