# Genbu

__!This Project is currently in alpha!__

Genbu is a web-based collaborative whiteboard tool that has similarities to products like OneNote or Xournal++. By using technologies like CRDT's, WebRTC and Supabase Realtime, collaboration and synchronization is prioritized.

For Genbu, data security is a top priority. Profiles are private, WebRTC rooms are encrypted, and because the entire project is and always will be open source, anyone can host it themselves.

## How Genbu uses Supabase

Note: Genbu uses supabase-js v2.

- Supabase Auth
    - Sign-in/Sign-up
    - RLS-Policies (for every table)
- Supabase Database
    - Database Triggers to create a queryable profile table
    - Database Functions to create better RLS policies
- Supabase Functions
    - Mainly used to keep complex logic out of the frontend and to ensure cryptographically secure keys
- Supabase Realtime
    - Sync open invite count, folders, teams

## Features

- Teams
    - invite other users with their email adress
    - set your own team color
- Whiteboards
    - automatic synchronization
    - free drawing
    - erasing
    - draggable

## Roadmap

- Team Management
- Better drawing features
- Export whiteboards
- Limit access to whiteboards
- Folders
- Social Logins