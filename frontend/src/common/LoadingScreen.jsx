export default function LoadingScreen({ message = "Cargando..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-lg">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

        <p className="mt-4 font-semibold text-slate-700">{message}</p>
      </div>
    </div>
  );
}