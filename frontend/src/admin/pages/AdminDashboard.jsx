import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Welcome Admin 👋
      </h2>

      <p className="text-gray-600 mb-6">
        From here you can manage exams, users, and platform data efficiently.
      </p>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">
            👥 Manage Users
          </h3>
          <p className="text-gray-600 mb-4">
            View all users, change roles, block/unblock or delete users.
          </p>

          <Link
            to="/admin/users"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            Go to Manage Users
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">
            📩 User Queries
          </h3>
          <p className="text-gray-600 mb-4">
            View and respond to user submitted queries.
          </p>

          <Link
            to="/admin/queries"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
          >
            View Queries
          </Link>
        </div>

      </div>
    </div>
  );
}