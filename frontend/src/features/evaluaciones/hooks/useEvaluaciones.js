import { useCallback, useEffect, useState } from "react";
import {
  createEvaluacion,
  deleteEvaluacion,
  getEvaluaciones,
  updateEvaluacion,
} from "../services/evaluacionService";

export function useEvaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarEvaluaciones = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEvaluaciones();
      setEvaluaciones(data);
    } catch (err) {
      setError(
        err.response?.data ||
          "No se pudieron cargar las evaluaciones. Verifica que el backend esté activo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEvaluaciones();
  }, [cargarEvaluaciones]);

  const guardarEvaluacion = async (evaluacion, evaluacionId = null) => {
    try {
      setActionLoading(true);
      setError("");

      let evaluacionGuardada;

      if (evaluacionId) {
        evaluacionGuardada = await updateEvaluacion(
          evaluacionId,
          evaluacion
        );

        setEvaluaciones((prev) =>
          prev.map((item) =>
            item.id === evaluacionId ? evaluacionGuardada : item
          )
        );
      } else {
        evaluacionGuardada = await createEvaluacion(evaluacion);

        setEvaluaciones((prev) => [...prev, evaluacionGuardada]);
      }

      return evaluacionGuardada;
    } catch (err) {
      const message =
        err.response?.data ||
        "No se pudo guardar la evaluación. Revisa los datos ingresados.";

      setError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const eliminarEvaluacion = async (evaluacionId) => {
    try {
      setActionLoading(true);
      setError("");

      await deleteEvaluacion(evaluacionId);

      setEvaluaciones((prev) =>
        prev.filter((evaluacion) => evaluacion.id !== evaluacionId)
      );
    } catch (err) {
      const message =
        err.response?.data ||
        "No se pudo eliminar la evaluación. Puede tener notas asociadas.";

      setError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    evaluaciones,
    loading,
    actionLoading,
    error,
    cargarEvaluaciones,
    guardarEvaluacion,
    eliminarEvaluacion,
  };
}