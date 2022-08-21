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
      folder: {
        Row: {
          team_id: string | null;
          created_at: string;
          created_by: string;
          parent_id: string | null;
          name: string;
          id: string;
        };
        Insert: {
          team_id?: string | null;
          created_at?: string;
          created_by: string;
          parent_id?: string | null;
          name: string;
          id?: string;
        };
        Update: {
          team_id?: string | null;
          created_at?: string;
          created_by?: string;
          parent_id?: string | null;
          name?: string;
          id?: string;
        };
      };
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
          folder_id: string;
          name: string;
        };
        Insert: {
          data: Json;
          room_key: string;
          id?: string;
          created_at?: string;
          folder_id: string;
          name: string;
        };
        Update: {
          data?: Json;
          room_key?: string;
          id?: string;
          created_at?: string;
          folder_id?: string;
          name?: string;
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

