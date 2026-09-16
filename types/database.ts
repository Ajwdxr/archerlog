// ─── Enums ───

export type SessionStatus = 'draft' | 'open' | 'live' | 'completed' | 'cancelled';

export type BowType =
  | 'Horse Bow'
  | 'Traditional Bow'
  | 'Recurve'
  | 'Longbow'
  | 'Compound'
  | 'Other';

export type MemberRole = 'member' | 'organizer' | 'admin';

export type PosterType = 'individual' | 'session';

// ─── Table Interfaces ───

export interface Community {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bow_type: BowType | null;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
}

export interface Session {
  id: string;
  community_id: string | null;
  name: string;
  venue: string | null;
  session_date: string;
  start_time: string | null;
  bow_type: BowType | null;
  distance_m: number | null;
  ends_count: number;
  arrows_per_end: number;
  maximum_arrow_score: number;
  status: SessionStatus;
  join_code: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionArcher {
  id: string;
  session_id: string;
  user_id: string | null;
  display_name: string;
  bow_type: BowType | null;
  joined_at: string;
}

export interface End {
  id: string;
  session_archer_id: string;
  end_number: number;
  total_score: number;
  submitted_at: string | null;
}

export interface Arrow {
  id: string;
  end_id: string;
  arrow_number: number;
  display_value: string;
  numeric_value: number;
  created_at: string;
}

export interface Result {
  id: string;
  session_id: string;
  session_archer_id: string;
  total_score: number;
  total_arrows: number;
  average_score: number | null;
  x_count: number;
  ten_count: number;
  rank: number | null;
  created_at: string;
}

export interface Poster {
  id: string;
  session_id: string;
  session_archer_id: string | null;
  poster_type: PosterType;
  template: string | null;
  image_url: string | null;
  created_at: string;
}

// ─── Insert Types (Omit auto-generated fields) ───

export type CommunityInsert = Omit<Community, 'id' | 'created_at'>;
export type ProfileInsert = Omit<Profile, 'created_at'>;
export type SessionInsert = Omit<Session, 'id' | 'created_at' | 'updated_at' | 'status'> & {
  status?: SessionStatus;
};
export type SessionArcherInsert = Omit<SessionArcher, 'id' | 'joined_at'>;
export type EndInsert = Omit<End, 'id' | 'submitted_at'> & { submitted_at?: string };
export type ArrowInsert = Omit<Arrow, 'id' | 'created_at'>;
export type ResultInsert = Omit<Result, 'id' | 'created_at'>;

// ─── Supabase Database Type ───

export interface Database {
  public: {
    Tables: {
      communities: {
        Row: Community;
        Insert: CommunityInsert;
        Update: Partial<CommunityInsert>;
      };
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
      };
      community_members: {
        Row: CommunityMember;
        Insert: Omit<CommunityMember, 'id' | 'created_at'>;
        Update: Partial<Omit<CommunityMember, 'id' | 'created_at'>>;
      };
      sessions: {
        Row: Session;
        Insert: SessionInsert;
        Update: Partial<SessionInsert>;
      };
      session_archers: {
        Row: SessionArcher;
        Insert: SessionArcherInsert;
        Update: Partial<SessionArcherInsert>;
      };
      ends: {
        Row: End;
        Insert: EndInsert;
        Update: Partial<EndInsert>;
      };
      arrows: {
        Row: Arrow;
        Insert: ArrowInsert;
        Update: Partial<ArrowInsert>;
      };
      results: {
        Row: Result;
        Insert: ResultInsert;
        Update: Partial<ResultInsert>;
      };
      posters: {
        Row: Poster;
        Insert: Omit<Poster, 'id' | 'created_at'>;
        Update: Partial<Omit<Poster, 'id' | 'created_at'>>;
      };
    };
  };
}

// ─── View / Join Types ───

/** Leaderboard entry with all ranking data */
export interface LeaderboardEntry {
  session_archer_id: string;
  display_name: string;
  bow_type: BowType | null;
  total_score: number;
  total_arrows: number;
  completed_ends: number;
  average: number;
  x_count: number;
  ten_count: number;
  nine_count: number;
  rank: number;
}

/** Score entry for an individual arrow in the score keypad */
export interface ArrowScore {
  display_value: string;
  numeric_value: number;
}

/** Available score options for a session */
export const DEFAULT_SCORE_OPTIONS: ArrowScore[] = [
  { display_value: '10', numeric_value: 10 },
  { display_value: '9', numeric_value: 9 },
  { display_value: '8', numeric_value: 8 },
  { display_value: '7', numeric_value: 7 },
  { display_value: '6', numeric_value: 6 },
  { display_value: '5', numeric_value: 5 },
  { display_value: '4', numeric_value: 4 },
  { display_value: '3', numeric_value: 3 },
  { display_value: '2', numeric_value: 2 },
  { display_value: '1', numeric_value: 1 },
  { display_value: '0', numeric_value: 0 },
  { display_value: 'X', numeric_value: 10 },
];

export const BOW_TYPES: BowType[] = [
  'Horse Bow',
  'Traditional Bow',
  'Recurve',
  'Longbow',
  'Compound',
  'Other',
];
