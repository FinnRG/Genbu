export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      team: {
        Row: {
          name: string;
          color: string;
          id: string;
          created_at: string;
        };
        Insert: {
          name: string;
          color: string;
          id?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          color?: string;
          id?: string;
          created_at?: string;
        };
      };
      user: {
        Row: {
          id: string;
          email: string;
          name: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
        };
      };
      whiteboard: {
        Row: {
          data: Json;
          room_key: string;
          id: string;
          created_at: string;
        };
        Insert: {
          data: Json;
          room_key: string;
          id?: string;
          created_at?: string;
        };
        Update: {
          data?: Json;
          room_key?: string;
          id?: string;
          created_at?: string;
        };
      };
      user_team: {
        Row: {
          user_id: string;
          team_id: string;
        };
        Insert: {
          user_id: string;
          team_id: string;
        };
        Update: {
          user_id?: string;
          team_id?: string;
        };
      };
      team_invite: {
        Row: {
          inviter_id: string;
          invitee_id: string;
          created_at: string | null;
          team_id: string;
        };
        Insert: {
          inviter_id: string;
          invitee_id: string;
          created_at?: string | null;
          team_id: string;
        };
        Update: {
          inviter_id?: string;
          invitee_id?: string;
          created_at?: string | null;
          team_id?: string;
        };
      };
    };
    Functions: {
      get_teams_for_authenticated_user: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
  };
}

