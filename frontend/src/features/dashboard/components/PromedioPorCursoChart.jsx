import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PromedioPorCursoChart({ data }) {
  if (!data.length) {
    return (
      <div className="flex h-80 items-center justify-center text-slate-500">
        No hay cursos ni notas suficientes para generar el gráfico.
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="curso"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={60}
          />

          <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />

          <Tooltip
            formatter={(value, name) => {
              if (name === "promedio") return [`${value} / 20`, "Promedio"];
              return [value, name];
            }}
          />

          <Bar
            dataKey="promedio"
            name="promedio"
            radius={[8, 8, 0, 0]}
            fill="#2563eb"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}