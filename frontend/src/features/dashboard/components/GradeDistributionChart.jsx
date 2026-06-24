import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { CHART_COLORS } from "../charts/chartConfig";

const COLORS = [
  CHART_COLORS.danger,
  CHART_COLORS.warning,
  CHART_COLORS.info,
  CHART_COLORS.success,
];

export default function GradeDistributionChart({ data = [] }) {
  const hasData = data.some((item) => item.cantidad > 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          Distribución de notas
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Cantidad de notas por rango de calificación.
        </p>
      </div>

      <div className="h-80">
        {!hasData ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            Aún no existen notas para mostrar la distribución.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="cantidad"
                nameKey="rango"
                cx="50%"
                cy="50%"
                outerRadius={95}
                label
              >
                {data.map((item, index) => (
                  <Cell
                    key={`${item.rango}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => [`${value}`, "Notas"]} />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}