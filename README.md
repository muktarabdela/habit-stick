# Habit Stick

A simple and effective habit tracking application built with Next.js and Supabase. Track your daily habits with an intuitive calendar interface.

## Features

- Create and manage habits
- Track habit completion on a calendar
- Simple and intuitive user interface
- Real-time updates
- Responsive design

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase (Backend and Database)
- date-fns (Date manipulation)

## Prerequisites

- Node.js 18.17 or later
- npm or yarn
- A Supabase account and project

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a Supabase project and set up the database:

   Create the following tables in your Supabase database:

   `habits` table:

   ```sql
   create table habits (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users(id),
     name text not null,
     description text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

   `habit_track` table:

   ```sql
   create table habit_track (
     id uuid default uuid_generate_v4() primary key,
     habit_id uuid references habits(id) on delete cascade,
     date date not null,
     completed boolean default false,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

4. Copy `.env.local.example` to `.env.local` and update with your Supabase credentials:

   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` with your Supabase project URL and anon key.

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Add a new habit using the form at the top of the page
2. Select a habit from the list to view its tracking calendar
3. Click on any date in the calendar to toggle the habit's completion status for that day
4. Use the calendar navigation to view different months

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
