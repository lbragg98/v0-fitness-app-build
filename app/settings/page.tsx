import { SettingsForm } from '@/components/settings/settings-form';

export const metadata = {
  title: 'Settings - FitFlow',
  description: 'Configure your fitness preferences',
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your fitness preferences to get started</p>
        </div>
        <SettingsForm />
      </div>
    </main>
  );
}
