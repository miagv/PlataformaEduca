function getNombreEstudiante(estudiante) {
  if (!estudiante?.usuario) return "Estudiante no disponible";

  return `${estudiante.usuario.nombres || ""} ${
    estudiante.usuario.apellidos || ""
  }`.trim();
}

export function calcularDashboard(data) {
  const {
    cursos = [],
    estudiantes = [],
    docentes = [],
    evaluaciones = [],
    notas = [],
  } = data;

  const promedioGeneral =
    notas.length > 0
      ? notas.reduce((total, nota) => total + Number(nota.nota || 0), 0) /
        notas.length
      : 0;

  const aprobados = notas.filter((nota) => Number(nota.nota || 0) >= 11).length;

  const porcentajeAprobados =
    notas.length > 0 ? (aprobados / notas.length) * 100 : 0;

  const promedioPorCurso = cursos.map((curso) => {
    const notasCurso = notas.filter(
      (nota) => nota.evaluacion?.curso?.id === curso.id
    );

    const promedio =
      notasCurso.length > 0
        ? notasCurso.reduce(
            (total, nota) => total + Number(nota.nota || 0),
            0
          ) / notasCurso.length
        : 0;

    return {
      curso: curso.nombre,
      promedio: Number(promedio.toFixed(2)),
      cantidadNotas: notasCurso.length,
    };
  });

  const progresoEvaluaciones = evaluaciones.map((evaluacion) => {
    const notasEvaluacion = notas.filter(
      (nota) => nota.evaluacion?.id === evaluacion.id
    );

    const promedio =
      notasEvaluacion.length > 0
        ? notasEvaluacion.reduce(
            (total, nota) => total + Number(nota.nota || 0),
            0
          ) / notasEvaluacion.length
        : 0;

    return {
      evaluacion: evaluacion.titulo,
      curso: evaluacion.curso?.nombre || "Sin curso",
      promedio: Number(promedio.toFixed(2)),
      porcentaje: Number(evaluacion.porcentaje || 0),
      cantidadNotas: notasEvaluacion.length,
    };
  });

  const participacion = [
    {
      nombre: "Estudiantes",
      cantidad: estudiantes.length,
    },
    {
      nombre: "Docentes",
      cantidad: docentes.length,
    },
    {
      nombre: "Cursos",
      cantidad: cursos.length,
    },
    {
      nombre: "Evaluaciones",
      cantidad: evaluaciones.length,
    },
  ];

  const notasRecientes = [...notas]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 6)
    .map((nota) => ({
      id: nota.id,
      estudiante: getNombreEstudiante(nota.estudiante),
      codigo: nota.estudiante?.codigo || "Sin código",
      evaluacion: nota.evaluacion?.titulo || "Sin evaluación",
      curso: nota.evaluacion?.curso?.nombre || "Sin curso",
      nota: Number(nota.nota || 0),
    }));

  return {
    totalCursos: cursos.length,
    totalEstudiantes: estudiantes.length,
    totalDocentes: docentes.length,
    totalEvaluaciones: evaluaciones.length,
    totalNotas: notas.length,
    promedioGeneral: Number(promedioGeneral.toFixed(2)),
    aprobados,
    porcentajeAprobados: Number(porcentajeAprobados.toFixed(2)),
    promedioPorCurso,
    progresoEvaluaciones,
    participacion,
    notasRecientes,
  };
}