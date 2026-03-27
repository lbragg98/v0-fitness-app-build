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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/settings"
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold text-card-foreground mb-2">Settings</h2>
            <p className="text-muted-foreground text-sm">Configure your fitness preferences and goals</p>
          </Link>

          <Link
            href="/test-exercises"
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold text-card-foreground mb-2">Test ExerciseDB</h2>
            <p className="text-muted-foreground text-sm">Browse exercises by muscle group (testing)</p>
          </Link>
        </div>

        <div className="mt-8 p-6 bg-secondary rounded-lg">
          <h3 className="text-lg font-bold mb-4 text-foreground">Implementation Status</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-foreground">Step 1: Storage Layer & Type Definitions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-foreground">Step 2: Settings Page</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-foreground">Step 3: ExerciseDB API Integration</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-muted-foreground">○</span>
              <span className="text-muted-foreground">Step 4: Workout Generator</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
