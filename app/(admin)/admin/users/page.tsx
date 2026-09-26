"use client";

import * as React from "react";
import {
  IconUsers,
  IconShield,
  IconUser,
  IconSearch,
  IconCheck,
  IconX,
  IconDotsVertical,
  IconDeviceAnalytics,
} from "@tabler/icons-react";
import { toast } from "sonner";

type UserItem = {
  id: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  lastActive: string;
  requestsCount: number;
};

const INITIAL_USERS: UserItem[] = [
  {
    id: 1,
    fullName: "Nico Revaldo",
    email: "nicorevaldo@gmail.com",
    role: "ADMIN",
    status: "ACTIVE",
    lastActive: "Just now",
    requestsCount: 1420,
  },
  {
    id: 2,
    fullName: "Wasawat (Echotik Crawler)",
    email: "wasawat@cube.asia",
    role: "ADMIN",
    status: "ACTIVE",
    lastActive: "15 mins ago",
    requestsCount: 3820,
  },
  {
    id: 3,
    fullName: "STIKOM Research Team",
    email: "research@stikom.edu",
    role: "USER",
    status: "ACTIVE",
    lastActive: "2 hours ago",
    requestsCount: 640,
  },
  {
    id: 4,
    fullName: "TikTok Content Strategist",
    email: "strategist@cube.asia",
    role: "USER",
    status: "ACTIVE",
    lastActive: "1 day ago",
    requestsCount: 290,
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserItem[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRole = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newRole = u.role === "ADMIN" ? "USER" : "ADMIN";
          toast.success(`Role for ${u.fullName} updated to ${newRole}`);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1">
            User & Access Management
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage user accounts, assign Administrator privileges, and inspect endpoint activity.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users or email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Endpoint Requests</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-sans">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{u.fullName}</div>
                    <div className="text-neutral-400 text-[11px] font-mono">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === "ADMIN"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                          : "bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {u.role === "ADMIN" ? <IconShield className="size-3" /> : <IconUser className="size-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                    {u.requestsCount.toLocaleString()} reqs
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500 text-[11px] whitespace-nowrap">
                    {u.lastActive}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleRole(u.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                    >
                      Toggle {u.role === "ADMIN" ? "to User" : "to Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
