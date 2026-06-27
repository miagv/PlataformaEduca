import { useCallback, useEffect, useState } from "react";
import {
  createCurso,
  deleteCurso,
  getCursos,
  getMisCursos,
  updateCurso,
} from "../services/cursoService";

export function useCursos({ misCursos = false } = {}) {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarCursos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = misCursos ? await getMisCursos() : await getCursos();
      setCursos(data);
    } catch (err) {
      setError(
        err.response?.data ||
          "No se pudieron cargar los cursos. Verifica que el backend esté activo."
      );
    } finally {
      setLoading(false);
    }
  }, [misCursos]);

  useEffect(() => {
    cargarCursos();
  }, [cargarCursos]);

  const guardarCurso = async (curso, cursoId = null) => {
    try {
      setActionLoading(true);
      setError("");

      let cursoGuardado;

      if (cursoId) {
        cursoGuardado = await updateCurso(cursoId, curso);

        setCursos((prevCursos) =>
          prevCursos.map((item) =>
            item.id === cursoId ? cursoGuardado : item
          )
        );
      } else {
        cursoGuardado = await createCurso(curso);

        setCursos((prevCursos) => [...prevCursos, cursoGuardado]);
      }

      return cursoGuardado;
    } catch (err) {
      const message =
        err.response?.data ||
        "No se pudo guardar el curso. Verifica los datos enviados.";

      setError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const eliminarCurso = async (cursoId) => {
    try {
      setActionLoading(true);
      setError("");

      await deleteCurso(cursoId);

      setCursos((prevCursos) =>
        prevCursos.filter((curso) => curso.id !== cursoId)
      );
    } catch (err) {
      const message =
        err.response?.data ||
        "No se pudo eliminar el curso. Puede estar relacionado con otros registros.";

      setError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    cursos,
    loading,
    actionLoading,
    error,
    cargarCursos,
    guardarCurso,
    eliminarCurso,
  };
}