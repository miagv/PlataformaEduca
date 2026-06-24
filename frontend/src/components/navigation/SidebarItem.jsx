import { NavLink } from "react-router-dom";

export default function SidebarItem({ to, icon: Icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <Icon size={20} />
      <span>{children}</span>
    </NavLink>
  );
}