import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { authService } from '@/services/auth';

export function Settings() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Account Settings</h1>
            
            <div className="bg-secondary rounded-lg p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Preferences</h2>
                
                <div className="flex items-center justify-between p-4 bg-background rounded-md">
                  <div>
                    <h3 className="font-medium">Language</h3>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent border rounded-md px-3 py-2"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-md">
                  <div>
                    <h3 className="font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <h2 className="text-xl font-semibold">Account Actions</h2>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}