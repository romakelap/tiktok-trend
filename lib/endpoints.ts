export const API_ENDPOINTS = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    refreshToken: "/api/auth/refresh-token",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },

  users: {
    me: "/api/users/me",
    preferences: "/api/users/preferences",
  },

  accounts: {
    list: "/api/accounts",
    competitors: "/api/accounts/competitors",
    stats: (id: number | string) => `/api/accounts/${id}/stats`,
    followerHistory: (id: number | string) =>
      `/api/accounts/${id}/followers/history`,
  },

  dashboard: {
    summary: "/api/dashboard/summary",
    engagementTrend: "/api/dashboard/engagement/trend",
    followerGrowth: "/api/dashboard/follower/growth",
    postingHeatmap: "/api/dashboard/posting/heatmap",
    postingOptimal: "/api/dashboard/posting/optimal",
    performanceComparison: "/api/dashboard/performance/comparison",
    competitorBenchmark: "/api/dashboard/competitor/benchmark",
  },

  videos: {
    list: "/api/videos",
    detail: (id: number | string) => `/api/videos/${id}`,
    engagementHistory: (id: number | string) =>
      `/api/videos/${id}/engagement/history`,
    trending: "/api/videos/trending",
    top: "/api/videos/top",
    durationStats: "/api/videos/stats/duration",
    captionStats: "/api/videos/stats/caption",
    emojiStats: "/api/videos/stats/emoji",
  },

  ml: {
    triggerInference: "/api/ml/inference/trigger",
    predictions: "/api/ml/predictions",
    predictionDetail: (videoId: number | string) =>
      `/api/ml/predictions/${videoId}`,
    clusterVideos: "/api/ml/cluster/videos",
    models: "/api/ml/models",
  },

  summary: {
    generate: "/api/summary/generate",
    weekly: "/api/summary/weekly",
    monthly: "/api/summary/monthly",
    keywords: "/api/summary/keywords",
    insights: "/api/summary/insights",
  },

  hashtags: {
    trending: "/api/hashtags/trending",
    leaderboard: "/api/hashtags/leaderboard",
    competition: "/api/hashtags/competition",
    performance: (id: number | string) => `/api/hashtags/${id}/performance`,
    benchmark: "/api/hashtags/benchmark",
    recommend: "/api/hashtags/recommend",
    combinations: "/api/hashtags/recommend/combinations",
  },

  analytics: {
    contentPerformance: "/api/analytics/content/performance",
    historical: "/api/analytics/historical",
    optimalSchedule: "/api/analytics/schedule/optimal",
    contentRecommend: "/api/analytics/content/recommend",
    forecast: "/api/analytics/forecast",
    correlation: "/api/analytics/correlation",
    hashtagNetwork: "/api/analytics/hashtag-network",
    revenueAnalysis: "/api/analytics/revenue",
    contentTrend: "/api/analytics/content-trend",
  },

  export: {
    excel: "/api/export/excel",
    csv: "/api/export/csv",
    history: "/api/export/history",
    delete: (id: number | string) => `/api/export/history/${id}`,
  },

  category: {
    comparison: "/api/category/comparison",
    detail: (category: string) => `/api/category/${category}/detail`,
    hashtags: (category: string) => `/api/category/${category}/hashtags`,
    keywords: (category: string) => `/api/category/${category}/keywords`,
    postingTime: (category: string) => `/api/category/${category}/posting-time`,
    topVideos: (category: string) => `/api/category/${category}/top-videos`,
    combine: "/api/category/combine",
  },
} as const;