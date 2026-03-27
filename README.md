# FitFlow - Personal Fitness Companion

A full-stack fitness app built with Next.js that helps users create personalized workout plans, track progress, and execute workouts with real-time timers.

## Features

### Core Features
- **Settings & Preferences** - Configure fitness level, goals, experience, and break durations
- **Intelligent Workout Generator** - Creates personalized 3-6 day workout splits based on user settings
- **ExerciseDB Integration** - Access to thousands of exercises by muscle group, equipment, and difficulty
- **Activity Calendar** - Weekly workout schedule with rest day indicators and muscle group focus areas
- **Workout Library** - Browse and manage all generated workout plans
- **Session Tracking** - Step-by-step exercise execution with set logging
- **Break Timers** - Animated rest timers between sets with pause/resume and skip functionality
- **Progress Feed** - Activity history showing completed workouts with stats
- **Photo Gallery** - Upload and track progress photos over time

### Technical Features
- **Local Storage** - All data persists in browser localStorage
- **Responsive Design** - Mobile-first design that works on all devices
- **Real-time Timers** - Smooth countdown timers with visual feedback
- **Loading States** - Skeleton loaders and empty states for better UX
- **Error Handling** - Graceful error states with retry options

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm

### Installation

1. Clone and install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### 1. Complete Your Settings
Go to Settings and fill out:
- Fitness level (beginner, intermediate, advanced)
- Primary goals (strength, hypertrophy, endurance)
- Years of experience
- Preferences (rest duration, exercises per day)

### 2. Generate a Workout Plan
Visit your Profile and click "Generate New Workout Plan" to create a personalized routine.

### 3. View Your Schedule
Check the Activity page to see this week's workout plan and today's exercises.

### 4. Execute a Workout
Click "Start Your Day" to begin a workout session with:
- Exercise instructions and images
- Set tracking (reps, weight)
- Rest timers between sets
- Progress saving

### 5. Track Progress
- View completed workouts in your Profile feed
- Upload progress photos to track transformation
- Review stats (exercises, duration, muscle groups)

## Project Structure

```
/app                          # Next.js pages and routes
  /activity                   # Activity/calendar view
  /profile                    # Profile and feed
  /settings                   # User settings
  /session                    # Workout execution
  /workouts                   # Workout library
  /api/exercises              # ExerciseDB API route

/components                   # Reusable React components
  /activity                   # Calendar and daily summary
  /profile                    # Stats, feed, photos
  /session                    # Exercise view, set tracker, timers
  /workouts                   # Workout cards
  /shared                     # Loading skeletons, empty states

/lib
  /api                        # ExerciseDB API client
  /storage                    # localStorage wrapper
  /types                      # TypeScript interfaces
  /workout                    # Rep calculator, workout generator
```

## Data Structure

All data is stored in localStorage with the following keys:
- `user_settings` - User preferences and fitness info
- `workouts` - Generated workout plans
- `workout_sessions` - Completed workout sessions
- `workout_completions` - Feed items for activity history
- `photos` - Progress photos

## Technologies Used

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Storage**: Browser localStorage
- **API**: ExerciseDB (RapidAPI) for exercise data
- **UI Components**: shadcn/ui
- **Icons & Images**: Inline SVGs and generated images

## Known Limitations

- Data is stored locally (clears if browser data is deleted)
- ExerciseDB API requires RapidAPI key (can be added to env variables)
- No user authentication
- Limited to browser storage capacity

## Future Enhancements

- Backend database integration (Supabase/Neon)
- User authentication and accounts
- Social features (share workouts, compete)
- Advanced analytics and insights
- Mobile app
- Offline support
- Export workout history
- Custom exercise creation

## Contributing

This is a demonstration project. Feel free to fork and extend!

## License

MIT
