import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS } from "../charts/chartConfig";

export default function CourseAverageChart({ data = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          Promedio por curso
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Promedio calculado según las notas registradas.
        </p>
      </div>

      <div className="h-80">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            No hay cursos o notas registradas para generar el gráfico.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="curso"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={65}
              />

              <YAxis domain={[0, 20]} />

              <Tooltip
                formatter={(value) => [`${value}`, "Promedio"]}
                labelFormatter={(label) => `Curso: ${label}`}
              />

              <Bar
                dataKey="promedio"
                fill={CHART_COLORS.primary}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}