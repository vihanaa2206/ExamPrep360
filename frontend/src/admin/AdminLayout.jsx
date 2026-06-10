import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout() {
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Protect admin route
    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchPendingQueries();
  }, []);

  const fetchPendingQueries = async () => {
    try {
      const res = await API.get("/admin/queries");
      const pending = res.data.filter(q => q.status === "pending").length;
      setPendingCount(pending);
    } catch (err) {
      console.error("Failed to fetch pending queries", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar pendingCount={pendingCount} />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
