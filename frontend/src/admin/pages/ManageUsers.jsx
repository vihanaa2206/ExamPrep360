import { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.filter((u) => u.email));
      setError(null);
    } catch (err) {
      setError("Unable to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      setLoadingId(id);

      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("User deleted successfully");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRoleChange = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    try {
      setLoadingId(user.id);

      await api.put(
        `/users/${user.id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Role updated");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Role update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleBlock = async (user) => {
    try {
      setLoadingId(user.id);

      await api.put(
        `/users/${user.id}/status`,
        { is_blocked: !user.is_blocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Status updated");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Status update failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-gray-100 transition">
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 capitalize">{user.role}</td>
                  <td className="p-4">
                    <span
                      className={
                        user.is_blocked
                          ? "text-red-500 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {user.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">

                      <button
                        disabled={loadingId === (user._id || user.id)}
                        onClick={() => handleRoleChange(user)}
                        className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        {loadingId === (user._id || user.id)
                          ? "Processing..."
                          : user.role === "admin"
                          ? "Make User"
                          : "Make Admin"}
                      </button>

                      <button
                        disabled={loadingId === (user._id || user.id)}
                        onClick={() => handleBlock(user)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        {user.is_blocked ? "Unblock" : "Block"}
                      </button>

                      <button
                        disabled={loadingId === (user._id || user.id)}
                        onClick={() => handleDelete(user._id || user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;