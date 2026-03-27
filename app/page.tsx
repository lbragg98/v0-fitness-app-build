import Link from 'next/link'

export const metadata = {
  title: 'FitFlow - Home',
  description: 'Your personal fitness companion',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">FitFlow</h1>
          <p className="text-xl text-muted-foreground">Your Personal Fitness Companion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link
            href="/profile"
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold text-card-foreground mb-2">Profile</h2>
            <p className="text-muted-foreground text-sm">View stats and generate workout plans</p>
          </Link>

          <Link
            href="/activity"
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold text-card-foreground mb-2">Activity</h2>
            <p className="text-muted-foreground text-sm">Weekly schedule and daily plans</p>
          </Link>

          <Link
            href="/workouts"
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold text-card-foreground mb-2">Workouts</h2>
            <p className="text-muted-foreground text-sm">Manage your workout library</p>
          </Link>

          <Link
            href="/settings"
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold text-card-foreground mb-2">Settings</h2>
            <p className="text-muted-foreground text-sm">Configure your fitness preferences</p>
          </Link>

          <Link
            href="/test-exercises"
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold text-card-foreground mb-2">Test ExerciseDB</h2>
            <p className="text-muted-foreground text-sm">Browse exercises by muscle group</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
