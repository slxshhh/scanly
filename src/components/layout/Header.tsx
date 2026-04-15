import { Github, LogIn, LogOut, User as UserIcon, QrCode } from "lucide-react";
import { useAuth } from "@/src/components/auth/AuthProvider";
import { signInWithGoogle, logout, trackEvent } from "@/src/lib/firebase";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      trackEvent('login', { method: 'google' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      trackEvent('logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center px-6 justify-between">
      <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <QrCode className="w-5 h-5" />
        </div>
        <span className="tracking-tighter">Scanly</span>
      </div>
      <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
        <a 
          href="https://github.com/denyskozak/qr-code-styling" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors flex items-center gap-2"
        >
          <Github className="w-4 h-4" />
          GitHub
        </a>

        {loading ? (
          <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-full border border-gray-100">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || "User"} 
                  className="w-6 h-6 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-3 h-3 text-gray-500" />
                </div>
              )}
              <span className="hidden sm:inline text-gray-700 text-xs">{user.displayName}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleLogin}
            className="rounded-full px-6 shadow-sm"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
