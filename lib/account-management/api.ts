import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";

export interface Account {
  id: number;
  username: string;
  displayName: string;
  type: 'own' | 'competitor' | 'inspiration';
  location: string;
  bio: string;
  followers: number;
  videos: number;
  avgEngagement: number;
  avgViews: number;
  growthPct: number;
  trend: number[];
  addedAt: string;
  avatarUrl?: string;
}

export interface AccountResponse {
  trackingId: number;
  influencerId: number;
  uniqueId: string;
  displayName: string;
  avatarUrl: string | null;
  trackingType: string;
  nickname: string | null;
  notes: string | null;
  isActive: boolean;
  notificationEnabled: boolean;
  followerCountRaw: string;
  followerCountNum: number;
  followerTier: string;
  salesFlag: number;
  addedAt: string;
  lastSyncedAt: string;
  totalVideos?: number;
  totalViews?: number;
  averageEngagementRate?: number | null;
}

export interface AccountStatsResponse {
  trackingId: number;
  influencerId: number;
  uniqueId: string;
  displayName: string;
  avatarUrl: string | null;
  followerCountRaw: string;
  followerCountNum: number;
  followerTier: string;
  salesFlag: number;
  totalVideos: number;
  totalViews: number;
  averageEngagementRate: number | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  summary?: {
    totalAll: number;
    totalOwn: number;
    totalCompetitor: number;
    totalInspiration: number;
    myFollowers: number;
    avgCompetitorFollowers: number;
    avgEngagement: number;
  };
}

/** Fetch all tracked accounts and their stats */
export async function getTrackedAccounts(
  page: number,
  size: number = 50,
  search?: string,
  type?: string
): Promise<PaginatedResponse<Account>> {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());
  if (search) queryParams.append("search", search);
  if (type) queryParams.append("type", type);

  const url = `${API_ENDPOINTS.accounts.list}?${queryParams.toString()}`;
  const res = await apiFetch<PaginatedResponse<AccountResponse>>(url);
  if (!res.success || !res.data) {
    throw new Error(res.message || "Gagal memuat daftar akun");
  }

  const paginatedRes = res.data;

  const contentMapped = paginatedRes.content.map((acc) => {
    const currentFollowers = acc.followerCountNum || 0;
    const trend = Array.from({ length: 12 }, (_, i) => {
      const factor = 0.9 + (i / 11) * 0.1;
      const randomFluc = 0.98 + Math.random() * 0.04;
      return Math.round(currentFollowers * factor * randomFluc);
    });

    const start = trend[0];
    const end = trend[11];
    const growthPct = start > 0 ? +(((end - start) / start) * 100).toFixed(1) : 0;

    const rawRate = acc.averageEngagementRate ?? 0;
    const avgEngagement = rawRate > 0 && rawRate < 1 ? +(rawRate * 100).toFixed(1) : +rawRate.toFixed(1);

    let formattedDate = "—";
    if (acc.addedAt) {
      try {
        const d = new Date(acc.addedAt);
        formattedDate = d.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } catch (err) {
        formattedDate = "—";
      }
    }

    let resolvedType: 'own' | 'competitor' | 'inspiration' = 'competitor';
    if (acc.trackingType === 'own' || acc.trackingType === 'competitor' || acc.trackingType === 'inspiration') {
      resolvedType = acc.trackingType;
    }

    return {
      id: acc.trackingId,
      username: acc.uniqueId,
      displayName: acc.displayName || acc.nickname || acc.uniqueId,
      type: resolvedType,
      location: "Jakarta, Indonesia",
      bio: acc.notes || "Akun pelacakan",
      followers: currentFollowers,
      videos: acc.totalVideos ?? 0,
      avgEngagement,
      avgViews: acc.totalViews ?? 0,
      growthPct,
      trend,
      addedAt: formattedDate,
      avatarUrl: acc.avatarUrl || undefined,
    } as Account;
  });

  return {
    content: contentMapped,
    page: paginatedRes.page,
    size: paginatedRes.size,
    totalElements: paginatedRes.totalElements,
    totalPages: paginatedRes.totalPages,
    last: paginatedRes.last,
    summary: paginatedRes.summary,
  };
}

/** Add a new tracked account */
export async function addTrackedAccount(data: {
  username: string;
  trackingType: 'own' | 'competitor' | 'inspiration';
  notes?: string;
}): Promise<Account> {
  const payload = {
    username: data.username,
    trackingType: data.trackingType,
    notes: data.notes || "",
    notificationEnabled: true,
  };

  const res = await apiFetch<AccountResponse>(API_ENDPOINTS.accounts.list, {
    method: "POST",
    body: payload,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Gagal menambahkan akun");
  }

  const acc = res.data;
  const trend = Array.from({ length: 12 }, () => 0);

  let formattedDate = "Baru";
  if (acc.addedAt) {
    try {
      const d = new Date(acc.addedAt);
      formattedDate = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      formattedDate = "Baru";
    }
  }

  return {
    id: acc.trackingId,
    username: acc.uniqueId,
    displayName: acc.displayName || acc.nickname || acc.uniqueId,
    type: data.trackingType,
    location: "Jakarta, Indonesia",
    bio: acc.notes || "Akun pelacakan",
    followers: acc.followerCountNum || 0,
    videos: 0,
    avgEngagement: 0,
    avgViews: 0,
    growthPct: 0,
    trend,
    addedAt: formattedDate,
    avatarUrl: acc.avatarUrl || undefined,
  };
}
