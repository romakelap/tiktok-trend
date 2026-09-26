"use client";

import * as React from "react";
import {
  IconUsers,
  IconShield,
  IconUser,
  IconSearch,
  IconCheck,
  IconX,
  IconRefresh,
  IconClock,
  IconCalendar,
  IconShieldCheck,
  IconShieldLock,
} from "@tabler/icons-react";
import { toast } from "sonner";

type UserItem = {
  userId: number;
  email: string;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  registeredAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchUsers = React.useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      if (json.success && json.data?.usersList) {
        setUsers(json.data.usersList);
      }
    } catch {
      toast.error("Gagal memuat data akun pengguna");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              <IconShieldCheck className="w-3.5 h-3.5" />
              Sanitized Audit Feed
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Total {users.length} Akun Terdaftar
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            Registered Users &amp; Access Monitoring
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Daftar akun pengguna terdaftar di MySQL Aiven, status sesi, dan rekam aktivitas login tanpa mengekspos kredensial sensitif.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <IconRefresh className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Memuat..." : "Refresh Akun"}</span>
        </button>
      </div>

      {/* Search and Table Container */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, username, atau role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white text-neutral-900 dark:text-neutral-100"
            />
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            {filteredUsers.length} pengguna ditemukan
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-500 dark:text-neutral-400 flex flex-col items-center gap-2">
            <IconRefresh className="w-5 h-5 animate-spin" />
            <span>Mengambil data pengguna terdaftar dari MySQL...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Role Akses</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4">Aktivitas Terakhir</th>
                  <th className="py-3 px-4">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredUsers.map((u) => (
                  <tr key={u.userId} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                          {u.username.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-neutral-100">{u.fullName}</p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/60"
                          : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                      }`}>
                        {u.role === "SUPER_ADMIN" ? <IconShield className="w-3 h-3" /> : <IconUser className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {u.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 font-mono text-[11px]">
                      {u.lastLogin}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                      {u.registeredAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
