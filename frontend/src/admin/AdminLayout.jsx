import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout() {
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingQueries = async () => {
    try {
      const res = await API.get("/admin/queries");
      const pending = res.data.filter(
        (q) => q.status === "pending"
      ).length;
      setPendingCount(pending);
    } catch (err) {
      console.error("Failed to fetch pending queries", err);
    }
  };

  useEffect(() => {
    fetchPendingQueries();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar pendingCount={pendingCount} />
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
