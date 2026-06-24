export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName = "bg-blue-100 text-blue-600",
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>

          {description && (
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          )}
        </div>

        {Icon && (
          <div className={`rounded-xl p-3 ${iconClassName}`}>
            <Icon size={23} />
          </div>
        )}
      </div>
    </article>
  );
}