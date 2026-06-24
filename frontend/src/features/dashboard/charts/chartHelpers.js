import { GRADE_RANGES } from "./chartConfig";

export function calculateAverage(values = []) {
  if (!values.length) return 0;

  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);

  return Number((total / values.length).toFixed(2));
}

export function getCourseAverageData(cursos = [], notas = []) {
  return cursos.map((curso) => {
    const notasDelCurso = notas.filter(
      (nota) => nota.evaluacion?.curso?.id === curso.id
    );

    const promedio = calculateAverage(
      notasDelCurso.map((nota) => nota.nota)
    );

    return {
      id: curso.id,
      curso: curso.nombre,
      promedio,
      cantidadNotas: notasDelCurso.length,
    };
  });
}

export function getGradeDistributionData(notas = []) {
  return GRADE_RANGES.map((range) => {
    const cantidad = notas.filter((nota) => {
      const valor = Number(nota.nota);

      return valor >= range.min && valor <= range.max;
    }).length;

    return {
      rango: range.label,
      cantidad,
    };
  });
}

export function getGeneralAverage(notas = []) {
  return calculateAverage(notas.map((nota) => nota.nota));
}

export function getApprovedPercentage(notas = [], minimumGrade = 11) {
  if (!notas.length) return 0;

  const aprobadas = notas.filter(
    (nota) => Number(nota.nota) >= minimumGrade
  ).length;

  return Number(((aprobadas / notas.length) * 100).toFixed(1));
}

export function getRecentEvaluations(evaluaciones = [], limit = 5) {
  return [...evaluaciones]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, limit);
}

export function getEvaluationsByCourse(evaluaciones = []) {
  const grouped = {};

  evaluaciones.forEach((evaluacion) => {
    const cursoName = evaluacion.curso?.nombre || "Sin curso";

    if (!grouped[cursoName]) {
      grouped[cursoName] = 0;
    }

    grouped[cursoName] += 1;
  });

  return Object.entries(grouped).map(([curso, cantidad]) => ({
    curso,
    cantidad,
  }));
}