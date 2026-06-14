export type Trend = 'hot' | 'up' | 'stable' | 'down';

export interface RelatedVideo {
  id: number;
  title: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  date: string;
  viral: boolean;
  coverUrl?: string;
  videoUrl?: string;
  shareUrl?: string;
}

export interface Tag {
  tag: string;
  uses: number;
  weekGrowth: number;
  trend: Trend;
  avgViews: number;
  videoCount: number;
  engagement: number;
  relatedVideos: RelatedVideo[];
  category?: string;
}

export interface CatData {
  category: string;
  totalPosts: number;
  weekGrowth: number;
  tags: Tag[];
}

export const CAT_COLORS: Record<string, string> = {
  Gaming:    '#3B82F6',   // blue-500
  Edukasi:   '#1E40AF',   // blue-800
  Komedi:    '#1E293B',   // slate-800
  Fashion:   '#64748B',   // slate-500
  Kuliner:   '#475569',   // slate-600
  Musik:     '#2563EB',   // blue-600
  Lifestyle: '#0F172A',   // slate-900 (midnight blue)
  Teknologi: '#1D4ED8',   // blue-700
};

export const fmt = (n: number) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(1) + 'M'
    : n >= 1_000
    ? (n / 1_000).toFixed(1) + 'K'
    : String(n);

export const ALL_DATA: CatData[] = [
  { category:'Gaming', totalPosts:284000, weekGrowth:18.4, tags:[
    { tag:'#fyp',           uses:94200, weekGrowth:8.1,  trend:'hot',    avgViews:2840000, videoCount:412, engagement:88, relatedVideos:[
      {id:1,title:'Aku Coba PUBG Mobile 2025 — Grafis Gila!',          views:2100000,likes:310000,comments:44000,duration:'14:32',date:'3 hr lalu', viral:true},
      {id:2,title:'Review Jujur Genshin Impact Update 5.4',             views:1870000,likes:258000,comments:38500,duration:'18:07',date:'7 hr lalu', viral:true},
      {id:3,title:'Main Free Fire Pakai HP Kentang — Masih Bisa Booyah?',views:1590000,likes:162000,comments:39800,duration:'8:55',date:'18 hr lalu',viral:true},
    ]},
    { tag:'#gaming',        uses:48200, weekGrowth:21.3, trend:'hot',    avgViews:1980000, videoCount:287, engagement:82, relatedVideos:[
      {id:4,title:'Build META Season 33 Mobile Legends — Mythic',       views:1540000,likes:209000,comments:32100,duration:'11:45',date:'10 hr lalu',viral:false},
      {id:5,title:'Cara Grinding Item Rare Honkai Star Rail',            views:1320000,likes:181000,comments:28700,duration:'9:20', date:'14 hr lalu',viral:false},
    ]},
    { tag:'#mobilelegends', uses:31400, weekGrowth:14.7, trend:'hot',    avgViews:1540000, videoCount:198, engagement:79, relatedVideos:[
      {id:6,title:'Hero META Season Baru — Tier List Lengkap',          views:1780000,likes:241000,comments:36200,duration:'12:20',date:'5 hr lalu', viral:true},
      {id:7,title:'Top 5 Hero OP yang Wajib Dicoba',                    views:1320000,likes:189000,comments:28400,duration:'9:15', date:'8 hr lalu', viral:false},
    ]},
    { tag:'#pubgmobile',    uses:27800, weekGrowth:11.2, trend:'up',     avgViews:1320000, videoCount:176, engagement:74, relatedVideos:[
      {id:8,title:'Tips Chicken Dinner PUBG Mobile 2025',               views:1420000,likes:198000,comments:31200,duration:'10:40',date:'6 hr lalu', viral:false},
    ]},
    { tag:'#freefireindo',  uses:22100, weekGrowth:9.8,  trend:'up',     avgViews:1100000, videoCount:143, engagement:71, relatedVideos:[
      {id:9,title:'Cara Booyah Pakai HP Budget — Beneran Works!',       views:1180000,likes:154000,comments:24800,duration:'8:20', date:'9 hr lalu', viral:false},
    ]},
    { tag:'#genshinimpact', uses:18900, weekGrowth:4.2,  trend:'stable', avgViews:940000,  videoCount:121, engagement:68, relatedVideos:[
      {id:10,title:'Character Build F2P Genshin Impact 5.4',            views:980000, likes:132000,comments:21400,duration:'16:30',date:'11 hr lalu',viral:false},
    ]},
    { tag:'#gamingid',      uses:16300, weekGrowth:6.1,  trend:'stable', avgViews:820000,  videoCount:98,  engagement:65, relatedVideos:[
      {id:11,title:'Review Game Indie Indonesia Terbaik 2025',           views:860000, likes:112000,comments:18200,duration:'14:15',date:'13 hr lalu',viral:false},
    ]},
    { tag:'#mobilegaming',  uses:14700, weekGrowth:7.4,  trend:'up',     avgViews:740000,  videoCount:92,  engagement:63, relatedVideos:[
      {id:12,title:'5 Game Mobile Terbaik yang Harus Dicoba',            views:780000, likes:94000, comments:15600,duration:'11:00',date:'15 hr lalu',viral:false},
    ]},
    { tag:'#tipsgaming',    uses:11200, weekGrowth:12.6, trend:'up',     avgViews:560000,  videoCount:78,  engagement:61, relatedVideos:[
      {id:13,title:'Tips Pro Player yang Jarang Diketahui',              views:620000, likes:82000, comments:13400,duration:'9:45', date:'17 hr lalu',viral:false},
    ]},
    { tag:'#esports',       uses:8900,  weekGrowth:-2.1, trend:'down',   avgViews:445000,  videoCount:62,  engagement:54, relatedVideos:[
      {id:14,title:'Highlights M6 World Championship — Epic Plays',     views:480000, likes:64000, comments:10800,duration:'7:30', date:'20 hr lalu',viral:false},
    ]},
  ]},
  { category:'Komedi', totalPosts:372000, weekGrowth:24.3, tags:[
    { tag:'#viral',   uses:82100, weekGrowth:28.4, trend:'hot',    avgViews:3820000, videoCount:498, engagement:94, relatedVideos:[
      {id:15,title:'Reaksi Bule Pertama Kali Makan Durian — Auto Kabur!',views:6100000,likes:920000,comments:138000,duration:'4:47',date:'1 hr lalu', viral:true},
      {id:16,title:'Prank Bos Pakai Suara AI — Hampir Kena Pecat',       views:2870000,likes:441000,comments:61200, duration:'5:12',date:'4 hr lalu', viral:true},
    ]},
    { tag:'#fyp',     uses:94200, weekGrowth:8.1,  trend:'hot',    avgViews:2840000, videoCount:412, engagement:88, relatedVideos:[
      {id:17,title:'Ketika Nyokap Tau Password WiFi Udah Ganti',         views:3200000,likes:520000,comments:72000, duration:'3:45',date:'1 hr lalu', viral:true},
      {id:18,title:'POV: Pertama Kali Kerja di Startup — Culture Shock', views:2100000,likes:287000,comments:43200, duration:'5:30',date:'3 hr lalu', viral:true},
    ]},
    { tag:'#komedi',  uses:61200, weekGrowth:19.6, trend:'hot',    avgViews:2410000, videoCount:367, engagement:91, relatedVideos:[
      {id:19,title:'Ekspektasi vs Realita Makan di Resto Bintang 5',     views:1950000,likes:298000,comments:45300, duration:'4:55',date:'8 hr lalu', viral:true},
      {id:20,title:'Bahasa Gaul Gen Z yang Bikin Orang Tua Bingung',     views:1430000,likes:187000,comments:29400, duration:'6:30',date:'11 hr lalu',viral:false},
    ]},
    { tag:'#lucu',    uses:54800, weekGrowth:17.2, trend:'hot',    avgViews:2190000, videoCount:328, engagement:89, relatedVideos:[
      {id:21,title:'Driver Ojol vs Cuaca Ekstrem — Drama Tiada Henti',   views:1420000,likes:94000, comments:10100, duration:'7:18',date:'16 hr lalu',viral:false},
    ]},
    { tag:'#prank',   uses:48300, weekGrowth:23.8, trend:'hot',    avgViews:1940000, videoCount:289, engagement:86, relatedVideos:[
      {id:22,title:'Prank Teman Pakai Suara Hantu — Hampir Pingsan!',    views:2340000,likes:368000,comments:54200, duration:'6:10',date:'5 hr lalu', viral:true},
    ]},
    { tag:'#ngakak',  uses:37600, weekGrowth:14.4, trend:'up',     avgViews:1500000, videoCount:224, engagement:83, relatedVideos:[
      {id:23,title:'Ngakak! Kucing Gue Bisa Niru Suara Owner',           views:1680000,likes:228000,comments:36100, duration:'2:58',date:'7 hr lalu', viral:true},
    ]},
    { tag:'#hiburan', uses:29400, weekGrowth:10.2, trend:'up',     avgViews:1180000, videoCount:178, engagement:79, relatedVideos:[
      {id:24,title:'Review Film Indonesia 2025 — Jujur Banget Nih!',     views:1240000,likes:168000,comments:27600, duration:'12:20',date:'12 hr lalu',viral:false},
    ]},
    { tag:'#genz',    uses:22100, weekGrowth:16.9, trend:'up',     avgViews:882000,  videoCount:134, engagement:81, relatedVideos:[
      {id:25,title:'Hal yang Cuma Dimengerti Gen Z — Part 3',            views:980000, likes:138000,comments:22400, duration:'4:20',date:'14 hr lalu',viral:false},
    ]},
    { tag:'#storytime',uses:17800, weekGrowth:8.7, trend:'up',     avgViews:712000,  videoCount:107, engagement:75, relatedVideos:[
      {id:26,title:'Story Time: Mantan Tiba-Tiba Ngirim Pesan Lagi',     views:780000, likes:104000,comments:17800, duration:'8:45',date:'16 hr lalu',viral:false},
    ]},
    { tag:'#receh',   uses:14200, weekGrowth:5.1,  trend:'stable', avgViews:568000,  videoCount:87,  engagement:71, relatedVideos:[
      {id:27,title:'Jokes Receh yang Tetap Bikin Ketawa',                views:620000, likes:82000, comments:13600, duration:'3:30',date:'19 hr lalu',viral:false},
    ]},
  ]},
  { category:'Kuliner', totalPosts:248000, weekGrowth:21.2, tags:[
    { tag:'#fyp',           uses:94200, weekGrowth:8.1,  trend:'hot',    avgViews:2840000, videoCount:412, engagement:88, relatedVideos:[
      {id:28,title:'Mie Ayam Pak Kumis Jakarta — Antri 2 Jam Demi Ini!',views:2300000,likes:312000,comments:43200,duration:'9:44', date:'2 hr lalu', viral:true},
    ]},
    { tag:'#kuliner',       uses:52800, weekGrowth:24.1, trend:'hot',    avgViews:2110000, videoCount:316, engagement:86, relatedVideos:[
      {id:29,title:'Masak Rendang 8 Jam — Resep Asli Minang Nenek',     views:1980000,likes:264000,comments:38100,duration:'25:30',date:'6 hr lalu', viral:true},
      {id:30,title:'Street Food Surabaya — 10 Tempat Wajib Coba',       views:1610000,likes:201000,comments:29800,duration:'17:20',date:'9 hr lalu', viral:false},
    ]},
    { tag:'#kulinerjakarta',uses:38100, weekGrowth:19.4, trend:'hot',    avgViews:1524000, videoCount:229, engagement:83, relatedVideos:[
      {id:31,title:'Soto Betawi Pak Haji — Legendaris Sejak 1978',       views:1640000,likes:218000,comments:32400,duration:'11:15',date:'4 hr lalu', viral:true},
      {id:32,title:'10 Warteg Hidden Gem Jakarta Pusat',                 views:1280000,likes:168000,comments:24800,duration:'14:30',date:'8 hr lalu', viral:false},
    ]},
    { tag:'#streetfood',    uses:34600, weekGrowth:15.8, trend:'up',     avgViews:1384000, videoCount:208, engagement:80, relatedVideos:[
      {id:33,title:'Street Food Bandung Malam — Surga Kuliner!',         views:1480000,likes:196000,comments:28800,duration:'15:40',date:'7 hr lalu', viral:false},
    ]},
    { tag:'#resep',         uses:31200, weekGrowth:17.3, trend:'hot',    avgViews:1248000, videoCount:187, engagement:82, relatedVideos:[
      {id:34,title:'Cara Bikin Boba Sendiri di Rumah — Hemat 80%!',     views:1080000,likes:138000,comments:22500,duration:'12:10',date:'13 hr lalu',viral:false},
    ]},
    { tag:'#masakanindo',   uses:27400, weekGrowth:12.6, trend:'up',     avgViews:1096000, videoCount:164, engagement:78, relatedVideos:[
      {id:35,title:'Nasi Goreng Spesial Resep Rahasia Chef Bintang 5',   views:1160000,likes:152000,comments:23600,duration:'8:50', date:'11 hr lalu',viral:false},
    ]},
    { tag:'#mukbang',       uses:24800, weekGrowth:6.4,  trend:'stable', avgViews:992000,  videoCount:149, engagement:74, relatedVideos:[
      {id:36,title:'Mukbang Nasi Padang Porsi XL — Sanggup Habis?',     views:680000, likes:65000, comments:11400,duration:'8:05', date:'19 hr lalu',viral:false},
    ]},
    { tag:'#foodreview',    uses:21600, weekGrowth:9.8,  trend:'up',     avgViews:864000,  videoCount:130, engagement:76, relatedVideos:[
      {id:37,title:'Review Resto Viral Jakarta — Terlalu Mahal?',        views:920000, likes:122000,comments:19800,duration:'10:30',date:'14 hr lalu',viral:false},
    ]},
    { tag:'#hiddengem',     uses:16200, weekGrowth:28.4, trend:'hot',    avgViews:648000,  videoCount:97,  engagement:84, relatedVideos:[
      {id:38,title:'Hidden Gem Kuliner Yogya yang Wajib Kamu Coba',      views:740000, likes:98000, comments:16200,duration:'13:20',date:'16 hr lalu',viral:false},
    ]},
    { tag:'#warteg',        uses:12800, weekGrowth:11.2, trend:'up',     avgViews:512000,  videoCount:77,  engagement:73, relatedVideos:[
      {id:39,title:'Warteg Budget 10 Ribu — Masih Ada di Jakarta?',      views:580000, likes:76000, comments:12600,duration:'7:40', date:'18 hr lalu',viral:false},
    ]},
  ]},
  { category:'Teknologi', totalPosts:176000, weekGrowth:15.3, tags:[
    { tag:'#ai',            uses:52100, weekGrowth:34.8, trend:'hot',    avgViews:2084000, videoCount:313, engagement:89, relatedVideos:[
      {id:40,title:'ChatGPT vs Gemini vs Claude — Siapa Terbaik 2025?', views:1290000,likes:141000,comments:27800,duration:'21:15',date:'5 hr lalu', viral:true},
      {id:41,title:'Pelajar SMA Bikin AI Sendiri — Dilirik Google!',     views:3620000,likes:492000,comments:67100,duration:'9:05', date:'4 hr lalu', viral:true},
    ]},
    { tag:'#fyp',           uses:94200, weekGrowth:8.1,  trend:'hot',    avgViews:2840000, videoCount:412, engagement:88, relatedVideos:[
      {id:42,title:'Review Xiaomi 15 Ultra — HP 10 Juta Ini Layak?',    views:1540000,likes:168000,comments:31200,duration:'18:50',date:'2 hr lalu', viral:true},
    ]},
    { tag:'#chatgpt',       uses:31600, weekGrowth:42.1, trend:'hot',    avgViews:1264000, videoCount:190, engagement:87, relatedVideos:[
      {id:43,title:'Tools AI Gratis Terbaik 2025 — Wajib Coba!',        views:980000, likes:108000,comments:21400,duration:'14:30',date:'9 hr lalu', viral:false},
    ]},
    { tag:'#review',        uses:44200, weekGrowth:18.2, trend:'hot',    avgViews:1768000, videoCount:265, engagement:85, relatedVideos:[
      {id:44,title:'Build PC Gaming 5 Juta — Bisa Main AAA?',           views:980000, likes:112000,comments:21400,duration:'25:40',date:'11 hr lalu',viral:false},
    ]},
    { tag:'#teknologi',     uses:36800, weekGrowth:12.4, trend:'hot',    avgViews:1472000, videoCount:221, engagement:82, relatedVideos:[
      {id:45,title:'5 Gadget Terbaik 2025 yang Wajib Kamu Tahu',        views:1120000,likes:148000,comments:24600,duration:'12:45',date:'7 hr lalu', viral:false},
    ]},
    { tag:'#gadget',        uses:28400, weekGrowth:9.6,  trend:'up',     avgViews:1136000, videoCount:171, engagement:79, relatedVideos:[
      {id:46,title:'Unboxing Samsung Galaxy S25 — Worth It?',           views:1240000,likes:162000,comments:26800,duration:'16:20',date:'6 hr lalu', viral:false},
    ]},
    { tag:'#reviewhp',      uses:24700, weekGrowth:11.3, trend:'up',     avgViews:988000,  videoCount:148, engagement:77, relatedVideos:[
      {id:47,title:'Review iPhone 17 Pro — Kamera Terbaik Tahun Ini?', views:1080000,likes:142000,comments:23400,duration:'19:10',date:'8 hr lalu', viral:false},
    ]},
    { tag:'#coding',        uses:14200, weekGrowth:13.7, trend:'up',     avgViews:568000,  videoCount:85,  engagement:72, relatedVideos:[
      {id:48,title:'Belajar React dari Nol — Build Project Nyata',      views:620000, likes:82000, comments:13800,duration:'28:40',date:'12 hr lalu',viral:false},
    ]},
    { tag:'#pcgaming',      uses:19300, weekGrowth:7.8,  trend:'up',     avgViews:772000,  videoCount:116, engagement:74, relatedVideos:[
      {id:49,title:'Setup PC Gaming Budget 10 Juta — Full Build Guide', views:840000, likes:110000,comments:18200,duration:'22:30',date:'10 hr lalu',viral:false},
    ]},
    { tag:'#windows11',     uses:16800, weekGrowth:4.2,  trend:'stable', avgViews:672000,  videoCount:101, engagement:70, relatedVideos:[
      {id:50,title:'Tips & Trik Windows 11 yang Jarang Diketahui',      views:950000, likes:89000, comments:13600,duration:'12:10',date:'16 hr lalu',viral:false},
    ]},
  ]},
  { category:'Edukasi', totalPosts:198000, weekGrowth:12.1, tags:[
    { tag:'#fyp',         uses:94200,weekGrowth:8.1, trend:'hot',    avgViews:2840000,videoCount:412,engagement:88, relatedVideos:[
      {id:51,title:'Belajar Python dari NOL sampai Bisa Kerja — Part 1',views:1650000,likes:198000,comments:27300,duration:'22:14',date:'2 hr lalu',viral:true},
    ]},
    { tag:'#belajar',     uses:39400,weekGrowth:16.2,trend:'hot',    avgViews:1620000,videoCount:241,engagement:80, relatedVideos:[
      {id:52,title:'Cara Dapat Beasiswa LPDP 2025 — Tips Lengkap',    views:1420000,likes:173000,comments:22800,duration:'16:40',date:'5 hr lalu',viral:false},
      {id:53,title:'Matematika SMA Kelas 12 — Integral 30 Menit',      views:1100000,likes:141000,comments:18500,duration:'31:05',date:'9 hr lalu',viral:false},
    ]},
    { tag:'#edukasi',     uses:34100,weekGrowth:13.4,trend:'hot',    avgViews:1410000,videoCount:208,engagement:77, relatedVideos:[
      {id:54,title:'English Speaking Lancar dalam 21 Hari — Challenge',views:970000, likes:122000,comments:16700,duration:'12:30',date:'12 hr lalu',viral:false},
    ]},
    { tag:'#beasiswa',    uses:18600,weekGrowth:22.4,trend:'hot',    avgViews:762000, videoCount:112,engagement:76, relatedVideos:[
      {id:55,title:'Beasiswa S2 Luar Negeri 2025 — Panduan Lengkap',  views:840000, likes:112000,comments:18200,duration:'18:20',date:'7 hr lalu',viral:false},
    ]},
    { tag:'#tips',        uses:29800,weekGrowth:9.7, trend:'up',     avgViews:1190000,videoCount:187,engagement:74, relatedVideos:[
      {id:56,title:'Tips Belajar Efektif untuk Ujian Nasional 2025',   views:980000, likes:128000,comments:20600,duration:'14:50',date:'10 hr lalu',viral:false},
    ]},
    { tag:'#python',      uses:16900,weekGrowth:18.8,trend:'up',     avgViews:694000, videoCount:96, engagement:73, relatedVideos:[
      {id:57,title:'Python untuk Data Science — Belajar dari Nol',    views:740000, likes:98000, comments:15800,duration:'24:20',date:'11 hr lalu',viral:false},
    ]},
    { tag:'#pelajar',     uses:21200,weekGrowth:11.1,trend:'up',     avgViews:870000, videoCount:138,engagement:70, relatedVideos:[
      {id:58,title:'Cara Belajar Sambil Kerja — Time Management',      views:920000, likes:122000,comments:19600,duration:'16:10',date:'13 hr lalu',viral:false},
    ]},
    { tag:'#mahasiswa',   uses:14200,weekGrowth:4.3, trend:'stable', avgViews:583000, videoCount:89, engagement:64, relatedVideos:[
      {id:59,title:'Survive Biaya Hidup Mahasiswa di Jakarta',         views:640000, likes:84000, comments:13800,duration:'12:40',date:'15 hr lalu',viral:false},
    ]},
    { tag:'#kampus',      uses:11700,weekGrowth:3.1, trend:'stable', avgViews:481000, videoCount:71, engagement:61, relatedVideos:[
      {id:60,title:'Memilih Jurusan Kuliah yang Tepat — Tips Lengkap', views:520000, likes:68000, comments:11200,duration:'15:30',date:'17 hr lalu',viral:false},
    ]},
    { tag:'#investasi',   uses:9400, weekGrowth:7.8, trend:'up',     avgViews:386000, videoCount:58, engagement:67, relatedVideos:[
      {id:61,title:'Cara Invest Saham untuk Pemula 2025',              views:960000, likes:86000, comments:16700,duration:'19:55',date:'20 hr lalu',viral:false},
    ]},
  ]},
  { category:'Musik', totalPosts:201000, weekGrowth:9.4, tags:[
    { tag:'#fyp',            uses:94200,weekGrowth:8.1, trend:'hot',    avgViews:2840000,videoCount:412,engagement:88, relatedVideos:[
      {id:62,title:'Bocah 7 Tahun Main Piano Chopin — Banjir Air Mata Juri',views:4780000,likes:760000,comments:98400,duration:'5:33',date:'2 hr lalu',viral:true},
    ]},
    { tag:'#viral',          uses:82100,weekGrowth:28.4,trend:'hot',    avgViews:3284000,videoCount:492,engagement:91, relatedVideos:[
      {id:63,title:'Dance Challenge Goyang Tular Tembus 40 Negara',     views:5200000,likes:840000,comments:112000,duration:'2:58',date:'1 hr lalu',viral:true},
    ]},
    { tag:'#musik',          uses:44200,weekGrowth:10.8,trend:'hot',    avgViews:1768000,videoCount:265,engagement:79, relatedVideos:[
      {id:64,title:'Cover Cinta Luar Biasa Andmesh — Versi Jazz',      views:1720000,likes:214000,comments:28900,duration:'4:55',date:'3 hr lalu',viral:true},
    ]},
    { tag:'#cover',          uses:38900,weekGrowth:14.2,trend:'hot',    avgViews:1556000,videoCount:234,engagement:82, relatedVideos:[
      {id:65,title:'Chord Gitar Pemula — 10 Lagu Hits Indonesia 2025', views:1350000,likes:168000,comments:23400,duration:'20:40',date:'7 hr lalu',viral:false},
    ]},
    { tag:'#musikindonesia', uses:32400,weekGrowth:8.6, trend:'up',     avgViews:1296000,videoCount:194,engagement:76, relatedVideos:[
      {id:66,title:'Lagu Indonesia Terbaik Sepanjang Masa — Ranking',  views:1120000,likes:148000,comments:24200,duration:'14:20',date:'8 hr lalu',viral:false},
    ]},
    { tag:'#laguindo',       uses:28700,weekGrowth:7.4, trend:'up',     avgViews:1148000,videoCount:172,engagement:74, relatedVideos:[
      {id:67,title:'10 Lagu Indonesia yang Viral di Luar Negeri',      views:980000, likes:128000,comments:20800,duration:'11:30',date:'10 hr lalu',viral:false},
    ]},
    { tag:'#gitar',          uses:22100,weekGrowth:5.2, trend:'stable', avgViews:884000, videoCount:133,engagement:70, relatedVideos:[
      {id:68,title:'Chord Gitar Progressif — Belajar dari Dasar',      views:840000, likes:112000,comments:18200,duration:'18:40',date:'12 hr lalu',viral:false},
    ]},
    { tag:'#piano',          uses:19800,weekGrowth:9.4, trend:'up',     avgViews:792000, videoCount:119,engagement:73, relatedVideos:[
      {id:69,title:'Piano Otodidak 6 Bulan — Ini Hasilnya!',           views:1300000,likes:117000,comments:16000,duration:'8:30', date:'17 hr lalu',viral:false},
    ]},
    { tag:'#beatbox',        uses:16300,weekGrowth:11.7,trend:'up',     avgViews:652000, videoCount:98, engagement:75, relatedVideos:[
      {id:70,title:'Beatbox Level Dewa — Tutorial Step by Step',       views:1110000,likes:131000,comments:18700,duration:'13:22',date:'12 hr lalu',viral:false},
    ]},
    { tag:'#acoustic',       uses:13600,weekGrowth:4.8, trend:'stable', avgViews:544000, videoCount:82, engagement:68, relatedVideos:[
      {id:71,title:'Akustik Session Karya Sendiri — Live Recording',   views:580000, likes:78000, comments:12800,duration:'6:40', date:'19 hr lalu',viral:false},
    ]},
  ]},
  { category:'Fashion', totalPosts:142000, weekGrowth:-4.8, tags:[
    { tag:'#fyp',         uses:94200,weekGrowth:8.1,  trend:'hot',    avgViews:2840000,videoCount:412,engagement:88, relatedVideos:[
      {id:72,title:'OOTD Budget 200 Ribu — Tetap Kece!',              views:980000,likes:91000,comments:12400,duration:'8:10',date:'5 hr lalu',viral:false},
    ]},
    { tag:'#fashion',     uses:28400,weekGrowth:-3.1, trend:'stable', avgViews:1140000,videoCount:184,engagement:58, relatedVideos:[
      {id:73,title:'Trend Fashion 2025 — Ini yang Wajib Kamu Tahu',   views:840000,likes:78000,comments:11200,duration:'10:20',date:'8 hr lalu',viral:false},
    ]},
    { tag:'#ootd',        uses:24100,weekGrowth:-2.4, trend:'stable', avgViews:980000, videoCount:157,engagement:62, relatedVideos:[
      {id:74,title:'Review Thrift Shop Bandung — Worth It atau Nggak?',views:810000,likes:74000,comments:10300,duration:'14:22',date:'10 hr lalu',viral:false},
    ]},
    { tag:'#outfitinspo', uses:19800,weekGrowth:4.2,  trend:'up',     avgViews:794000, videoCount:128,engagement:64, relatedVideos:[
      {id:75,title:'Outfit Inspo untuk Berbagai Acara — Part 2',      views:720000,likes:66000,comments:9400,duration:'9:15',date:'12 hr lalu',viral:false},
    ]},
    { tag:'#thriftshop',  uses:17200,weekGrowth:8.6,  trend:'up',     avgViews:688000, videoCount:112,engagement:67, relatedVideos:[
      {id:76,title:'Thrift Shop Haul di Pasar Senen — Temuan Gila!',  views:760000,likes:70000,comments:10100,duration:'12:30',date:'14 hr lalu',viral:false},
    ]},
    { tag:'#style',       uses:21300,weekGrowth:-4.2, trend:'down',   avgViews:852000, videoCount:139,engagement:55, relatedVideos:[
      {id:77,title:'Style Guide Pria Modern 2025 — Tips Berpakaian',  views:680000,likes:62000,comments:8800,duration:'11:40',date:'15 hr lalu',viral:false},
    ]},
    { tag:'#outfit',      uses:18700,weekGrowth:-5.1, trend:'down',   avgViews:748000, videoCount:122,engagement:54, relatedVideos:[
      {id:78,title:'5 Outfit Kerja Anti Ribet untuk Cewek Kantoran',  views:650000,likes:57000,comments:6600,duration:'9:33',date:'20 hr lalu',viral:false},
    ]},
    { tag:'#fashionid',   uses:14600,weekGrowth:-1.8, trend:'stable', avgViews:584000, videoCount:94, engagement:59, relatedVideos:[
      {id:79,title:'Fashion Lokal Indonesia vs Brand Luar — Perbandingan',views:620000,likes:58000,comments:8400,duration:'13:20',date:'16 hr lalu',viral:false},
    ]},
    { tag:'#haul',        uses:12400,weekGrowth:2.1,  trend:'stable', avgViews:496000, videoCount:81, engagement:61, relatedVideos:[
      {id:80,title:'Haul Belanja Online 2 Juta — Semua Worth It?',    views:540000,likes:50000,comments:7200,duration:'14:10',date:'18 hr lalu',viral:false},
    ]},
    { tag:'#aesthetic',   uses:10900,weekGrowth:6.3,  trend:'up',     avgViews:436000, videoCount:71, engagement:65, relatedVideos:[
      {id:81,title:'Aesthetic Room Tour — Budget Friendly Setup',      views:480000,likes:45000,comments:6600,duration:'10:50',date:'20 hr lalu',viral:false},
    ]},
  ]},
  { category:'Lifestyle', totalPosts:118000, weekGrowth:-3.1, tags:[
    { tag:'#fyp',           uses:94200,weekGrowth:8.1, trend:'hot',    avgViews:2840000,videoCount:412,engagement:88, relatedVideos:[
      {id:82,title:'Morning Routine 5 AM Productive — 30 Hari Challenge',views:920000,likes:81000,comments:11200,duration:'11:20',date:'4 hr lalu',viral:false},
    ]},
    { tag:'#challenge',     uses:28400,weekGrowth:11.2,trend:'hot',    avgViews:1136000,videoCount:171,engagement:79, relatedVideos:[
      {id:83,title:'Digital Detox 7 Hari — Berhasil atau Gagal?',      views:540000,likes:38000,comments:3600,duration:'16:15',date:'21 hr lalu',viral:false},
    ]},
    { tag:'#morningroutine',uses:19600,weekGrowth:7.4, trend:'up',     avgViews:784000, videoCount:118,engagement:72, relatedVideos:[
      {id:84,title:'Morning Routine 5 AM yang Mengubah Hidup Gue',     views:840000,likes:92000,comments:14800,duration:'13:40',date:'6 hr lalu',viral:false},
    ]},
    { tag:'#produktif',     uses:18900,weekGrowth:9.8, trend:'up',     avgViews:756000, videoCount:114,engagement:74, relatedVideos:[
      {id:85,title:'Cara Kerja Produktif dari Rumah — WFH Tips',       views:780000,likes:86000,comments:14200,duration:'12:20',date:'8 hr lalu',viral:false},
    ]},
    { tag:'#skincare',      uses:21300,weekGrowth:3.6, trend:'stable', avgViews:852000, videoCount:128,engagement:67, relatedVideos:[
      {id:86,title:'Skincare Routine Pria Budget 100 Ribuan — Review', views:750000,likes:54000,comments:7800,duration:'9:40',date:'14 hr lalu',viral:false},
    ]},
    { tag:'#selfcare',      uses:16200,weekGrowth:2.1, trend:'stable', avgViews:648000, videoCount:97, engagement:65, relatedVideos:[
      {id:87,title:'Self-Care Weekend Routine yang Wajib Dicoba',      views:680000,likes:60000,comments:9800,duration:'11:10',date:'16 hr lalu',viral:false},
    ]},
    { tag:'#lifestyle',     uses:22400,weekGrowth:-4.1,trend:'down',   avgViews:896000, videoCount:135,engagement:58, relatedVideos:[
      {id:88,title:'Gaya Hidup Minimalisme — Cara Saya Berubah',       views:740000,likes:66000,comments:10800,duration:'14:30',date:'18 hr lalu',viral:false},
    ]},
    { tag:'#minimalis',     uses:14100,weekGrowth:5.2, trend:'up',     avgViews:564000, videoCount:85, engagement:68, relatedVideos:[
      {id:89,title:'Cara Declutter Kamar Kos Biar Zen & Aesthetic',   views:780000,likes:67000,comments:9400,duration:'14:55',date:'9 hr lalu',viral:false},
    ]},
    { tag:'#vlog',          uses:8700, weekGrowth:-5.6,trend:'down',   avgViews:348000, videoCount:52, engagement:51, relatedVideos:[
      {id:90,title:'Day in My Life: Freelancer di Bali 2025',          views:380000,likes:34000,comments:5600,duration:'18:40',date:'21 hr lalu',viral:false},
    ]},
    { tag:'#aesthetic',     uses:10900,weekGrowth:6.3, trend:'up',     avgViews:436000, videoCount:66, engagement:65, relatedVideos:[
      {id:91,title:'Aesthetic Cafe Tour Jakarta — Best Hidden Spots',  views:460000,likes:42000,comments:7200,duration:'12:20',date:'19 hr lalu',viral:false},
    ]},
  ]},
];

export const getTrendConfig = (t: Trend) => {
  // Semantic: red=danger/hot, green=positive/growth, gray=neutral, red-muted=decline
  const configs = {
    hot:    { bg: 'rgba(185,28,28,0.07)',  text: '#B91C1C',  border: 'rgba(185,28,28,0.15)',  label: 'HOT' },
    up:     { bg: 'rgba(26,122,74,0.08)',   text: '#1A7A4A',  border: 'rgba(26,122,74,0.15)',   label: 'NAIK' },
    stable: { bg: 'rgba(0,0,0,0.05)',       text: 'rgba(0,0,0,0.42)', border: 'rgba(0,0,0,0.09)', label: 'STABIL' },
    down:   { bg: 'rgba(185,28,28,0.07)',  text: '#B91C1C',  border: 'rgba(185,28,28,0.15)',  label: 'TURUN' },
  };
  return configs[t];
};
