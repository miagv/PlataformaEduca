export default function LoadingScreen({ message = "Cargando..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="rounded-2xl bg-white px-10 py-8 text-center shadow-lg ring-1 ring-slate-100">
        <div className="mx-auto flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-blue-100 border-t-[#012169]" />
        </div>
        <p className="mt-5 font-semibold text-[#012169]">{message}</p>
      </div>
    </div>
  );
}
