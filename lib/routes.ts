import {
  IconChartBar,
  IconClock,
  IconDashboard,
  IconHash,
  IconKey,
  IconNotes,
  IconSettings,
  IconUserCircle,
  IconUsers,
  IconVideo,
  type Icon,
} from "@tabler/icons-react";

/**
 * Central route map. All navigation links (sidebar, headers, redirects,
 * router.push, Link href) should reference values from here rather than
 * hard-coded strings.
 *
 * NOTE on typos: the folders `app/(protected)/hastag` and `app/(protected)/setting`
 * still use the legacy names. The values below match the *current* folder
 * names so navigation works today. Folders will be renamed to `hashtag` and
 * `settings` in the per-page refactor batch for those pages.
 */
export const ROUTES = {
  // Public
  landing: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forget-password",
  testApi: "/test-api",

  // Protected (group is rewritten by Next.js → final URL has no `(protected)`)
  dashboard: "/dashboard",
  analytics: "/analytics",
  nlpInsight: "/nlp-insight",
  hashtag: "/hashtag",
  keyword: "/keyword",
  timeposting: "/timeposting",
  videoLibrary: "/video-library",
  profile: "/profile",
  settings: "/settings",

  // Admin Console
  adminDashboard: "/admin/dashboard",
  adminPipeline: "/admin/pipeline",
  adminUsers: "/admin/users",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export type SidebarNavItem = {
  title: string;
  url: string;
  icon: Icon;
  description?: string;
};

export type SidebarNavGroup = {
  label: string;
  items: SidebarNavItem[];
};

/** Grouped navigation rendered in the protected sidebar. */
export const SIDEBAR_NAV: SidebarNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Global Analysis", url: ROUTES.dashboard, icon: IconDashboard },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Account & Competitor Analysis", url: ROUTES.analytics, icon: IconChartBar },
      { title: "NLP Insights", url: ROUTES.nlpInsight, icon: IconNotes },
    ],
  },
  {
    label: "Content Discovery",
    items: [
      { title: "Global Hashtag", url: ROUTES.hashtag, icon: IconHash },
      { title: "Global Keyword", url: ROUTES.keyword, icon: IconKey },
      { title: "Global Posting Time", url: ROUTES.timeposting, icon: IconClock },
    ],
  },
  {
    label: "Media Library",
    items: [
      { title: "Video Library", url: ROUTES.videoLibrary, icon: IconVideo },
    ],
  },
];

/** Items rendered at the bottom of the sidebar, above the user dropdown. */
export const SIDEBAR_FOOTER_NAV: SidebarNavItem[] = [
  { title: "Profile", url: ROUTES.profile, icon: IconUserCircle },
  { title: "Settings", url: ROUTES.settings, icon: IconSettings },
];

/** Page titles used by SiteHeader breadcrumb. Keyed by final URL path. */
export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.dashboard]: "Global Analysis",
  [ROUTES.analytics]: "Account & Competitor Analysis",
  [ROUTES.nlpInsight]: "NLP Insights",
  [ROUTES.hashtag]: "Global Hashtag Analysis",
  [ROUTES.keyword]: "Global Keyword Analysis",
  [ROUTES.timeposting]: "Global Posting Time Analysis",
  [ROUTES.videoLibrary]: "Video Library",
  [ROUTES.profile]: "Profile",
  [ROUTES.settings]: "Settings",
  [ROUTES.testApi]: "API Test",
};

/** Resolve a page title given the current pathname, with prefix fallback. */
export function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  // Pick the longest matching prefix (so `/dashboard/foo` -> "Dashboard")
  const match = Object.keys(PAGE_TITLES)
    .filter((key) => pathname.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];

  return match ? PAGE_TITLES[match] : "TikTrend BI";
}
