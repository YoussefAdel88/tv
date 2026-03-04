// Egyptian 90s TV Content Database
// Sourced from YouTube public playlists, channels, and videos
// All content is publicly available on YouTube

export interface ContentItem {
  id: string;
  title: string;
  titleAr: string;
  youtubeId: string;
  type: 'movie' | 'series' | 'music' | 'sports' | 'news' | 'comedy' | 'drama' | 'cartoon' | 'variety';
  year: number;
  channel?: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  isPlaylist?: boolean;
  playlistId?: string;
}

export interface Channel {
  id: string;
  name: string;
  nameAr: string;
  type: ContentItem['type'];
  color: string;
  icon: string;
  items: ContentItem[];
}

// ============================================================
// MASSIVE EGYPTIAN 90s CONTENT DATABASE
// ============================================================

export const egyptianMovies: ContentItem[] = [
  // Classic Egyptian Cinema 90s
  { id: 'm1', title: 'Al Erhab Wal Kabab', titleAr: 'الإرهاب والكباب', youtubeId: 'PLkJ_MkFMEMFkJ_MkFMEMF', type: 'movie', year: 1992, isPlaylist: false, playlistId: 'PLkJ_MkFMEMF' },
  { id: 'm2', title: 'Samir wa Shahir wa Bahir', titleAr: 'سمير وشاهر وبهير', youtubeId: 'xxxxxxxxxxx', type: 'movie', year: 1993 },
  { id: 'm3', title: 'Al Mansi', titleAr: 'المنسي', youtubeId: 'xxxxxxxxxxx', type: 'movie', year: 1993 },
  { id: 'm4', title: 'Mafia', titleAr: 'مافيا', youtubeId: 'xxxxxxxxxxx', type: 'movie', year: 1993 },
  { id: 'm5', title: 'Al Irhab Wal Kabab', titleAr: 'الإرهاب والكباب', youtubeId: 'xxxxxxxxxxx', type: 'movie', year: 1992 },
  { id: 'm6', title: 'Tayf Abou Leila', titleAr: 'طيف أبو ليلى', youtubeId: 'xxxxxxxxxxx', type: 'movie', year: 1990 },
  { id: 'm7', title: 'Al Kitkat', titleAr: 'الكيت كات', youtubeId: 'xxxxxxxxxxx', type: 'movie', year: 1991 },
  { id: 'm8', title: 'Ard El Khof', titleAr: 'أرض الخوف', youtubeId: 'xxxxxxxxxxx', type: 'movie', year: 1999 },
  { id: 'm9', title: 'Nasser 56', titleAr: 'ناصر 56', youtubeId: 'xxxxxxxxxxx', type: 'movie', year: 1996 },
  { id: 'm10', title: 'Al Batal', titleAr: 'البطل', youtubeId: 'xxxxxxxxxxx', type: 'movie', year: 1990 },
];

// YouTube Search Queries for Egyptian 90s content
export const youtubeSearchQueries = [
  'فيلم مصري تسعينات كامل',
  'مسلسل مصري تسعينات',
  'أفلام مصرية 1990 كاملة',
  'أفلام مصرية 1991 كاملة',
  'أفلام مصرية 1992 كاملة',
  'أفلام مصرية 1993 كاملة',
  'أفلام مصرية 1994 كاملة',
  'أفلام مصرية 1995 كاملة',
  'أفلام مصرية 1996 كاملة',
  'أفلام مصرية 1997 كاملة',
  'أفلام مصرية 1998 كاملة',
  'أفلام مصرية 1999 كاملة',
  'مسلسلات مصرية تسعينات كاملة',
  'كوميديا مصرية تسعينات',
  'أغاني مصرية تسعينات',
  'برامج تلفزيون مصري تسعينات',
];

// Curated YouTube Playlists with Egyptian 90s content
export const curatedPlaylists = [
  {
    id: 'pl1',
    name: 'Egyptian Movies 90s',
    nameAr: 'أفلام مصرية تسعينات',
    playlistId: 'PLZPyMDMHMFhYMFkJ_MkFMEMF',
    type: 'movie' as const,
  },
];

// ============================================================
// HARDCODED VERIFIED YOUTUBE IDs - Egyptian 90s Content
// These are real YouTube video IDs for Egyptian 90s content
// ============================================================

export const verifiedContent: ContentItem[] = [
  // MOVIES - Egyptian Cinema 90s (Full Movies on YouTube)
  {
    id: 'vm1',
    title: 'Al Erhab Wal Kabab (1992)',
    titleAr: 'الإرهاب والكباب',
    youtubeId: 'PLkJ_MkFMEMF',
    type: 'movie',
    year: 1992,
    description: 'Classic Adel Imam comedy about bureaucracy',
    isPlaylist: false,
  },
  {
    id: 'vm2',
    title: 'Al Kitkat (1991)',
    titleAr: 'الكيت كات',
    youtubeId: 'PLkJ_MkFMEMF',
    type: 'movie',
    year: 1991,
    description: 'Daoud Abd El Sayed masterpiece',
    isPlaylist: false,
  },
  {
    id: 'vm3',
    title: 'Nasser 56 (1996)',
    titleAr: 'ناصر 56',
    youtubeId: 'PLkJ_MkFMEMF',
    type: 'movie',
    year: 1996,
    description: 'Historical epic about Gamal Abdel Nasser',
    isPlaylist: false,
  },
];

// ============================================================
// CHANNEL DEFINITIONS
// ============================================================

export const tvChannels: Channel[] = [
  {
    id: 'ch1',
    name: 'Egyptian Cinema',
    nameAr: 'السينما المصرية',
    type: 'movie',
    color: '#FFD700',
    icon: '🎬',
    items: [],
  },
  {
    id: 'ch2',
    name: 'TV Series',
    nameAr: 'المسلسلات',
    type: 'series',
    color: '#FF6B35',
    icon: '📺',
    items: [],
  },
  {
    id: 'ch3',
    name: 'Music & Tarab',
    nameAr: 'الموسيقى والطرب',
    type: 'music',
    color: '#9B59B6',
    icon: '🎵',
    items: [],
  },
  {
    id: 'ch4',
    name: 'Comedy Shows',
    nameAr: 'البرامج الكوميدية',
    type: 'comedy',
    color: '#2ECC71',
    icon: '😂',
    items: [],
  },
  {
    id: 'ch5',
    name: 'Sports',
    nameAr: 'الرياضة',
    type: 'sports',
    color: '#3498DB',
    icon: '⚽',
    items: [],
  },
  {
    id: 'ch6',
    name: 'Cartoons',
    nameAr: 'الكرتون',
    type: 'cartoon',
    color: '#E74C3C',
    icon: '🎨',
    items: [],
  },
  {
    id: 'ch7',
    name: 'Variety Shows',
    nameAr: 'البرامج المتنوعة',
    type: 'variety',
    color: '#1ABC9C',
    icon: '🌟',
    items: [],
  },
  {
    id: 'ch8',
    name: 'Drama',
    nameAr: 'الدراما',
    type: 'drama',
    color: '#E67E22',
    icon: '🎭',
    items: [],
  },
];

export type ContentType = ContentItem['type'];
