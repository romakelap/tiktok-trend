export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

export interface ContentCategory {
  name: string;
  color: string;
  active: boolean;
}

export interface NotifSetting {
  key: string;
  label: string;
  desc: string;
  enabled: boolean;
}

export interface ProfileData {
  displayName:   string;
  username:      string;
  bio:           string;
  email:         string;
  phone:         string;
  location:      string;
  website:       string;
  joinDate:      string;
  plan:          'Free' | 'Pro' | 'Business';
  avatar:        string;
  avatarColor:   string;
  socialLinks:   SocialLink[];
  contentCategories: ContentCategory[];
  notifications: NotifSetting[];
  stats: { totalVideos: number; totalViews: number; avgEngagement: number; followers: number };
}

export const INITIAL_PROFILE: ProfileData = {
  displayName:  'Rizky Pratama',
  username:     '@rizkypratama_id',
  bio:          'Content creator & digital strategist 🎯 Berbagi tips growth TikTok, analitik konten, dan strategi viral yang proven. Open for collab!',
  email:        'rizky@vidanalytics.id',
  phone:        '+62 812 3456 7890',
  location:     'Jakarta, Indonesia',
  website:      'rizkypr.com',
  joinDate:     'Bergabung Januari 2025',
  plan:         'Pro',
  avatar:       'RP',
  avatarColor:  '#1A6BFF',
  socialLinks: [
    { platform:'TikTok',    url:'https://tiktok.com/@rizkypratama_id', handle:'@rizkypratama_id' },
    { platform:'Instagram', url:'https://instagram.com/rizkypratama',  handle:'@rizkypratama' },
    { platform:'YouTube',   url:'https://youtube.com/@rizkypratama',   handle:'@rizkypratama' },
  ],
  contentCategories: [
    { name:'Teknologi', color:'#364FC7', active:true },
    { name:'Gaming',    color:'#3B5BDB', active:true },
    { name:'Edukasi',   color:'#1971C2', active:true },
    { name:'Komedi',    color:'#B45309', active:false },
    { name:'Kuliner',   color:'#C92A2A', active:false },
    { name:'Musik',     color:'#2F6D8E', active:false },
    { name:'Lifestyle', color:'#2D6A4F', active:false },
    { name:'Fashion',   color:'#6741D9', active:false },
  ],
  notifications: [
    { key:'email_report',    label:'Laporan Email Mingguan',     desc:'Ringkasan performa konten setiap Senin pagi',          enabled:true  },
    { key:'trending_alert',  label:'Notifikasi Hashtag Trending', desc:'Alert ketika hashtag favorit mulai tren',              enabled:true  },
    { key:'ai_predict',      label:'Update Prediksi AI',         desc:'Notifikasi ketika prediksi baru tersedia',             enabled:false },
    { key:'competitor',      label:'Monitor Kompetitor',         desc:'Alert perubahan signifikan dari creator yang dipantau',enabled:false },
  ],
  stats: { totalVideos:142, totalViews:18400000, avgEngagement:7.4, followers:84200 },
};

export const formatStat = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
};

export const SOCIAL_COLORS: Record<string, string> = {
  TikTok: '#010101',
  Instagram: '#C92A2A',
  YouTube: '#B91C1C',
  Twitter: '#1971C2',
  LinkedIn: '#1A6BFF',
};

export const PLAN_CFG = {
  Free: { color: 'rgba(0,0,0,0.42)', bg: 'rgba(0,0,0,0.06)', label: 'FREE' },
  Pro: { color: '#1A6BFF', bg: 'rgba(26,107,255,0.09)', label: 'PRO' },
  Business: { color: '#1A7A4A', bg: 'rgba(26,122,74,0.08)', label: 'BUSINESS' },
};
