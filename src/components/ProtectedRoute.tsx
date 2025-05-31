import { memo, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type Role = 'student' | 'driver' | 'coordinator' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: Role;
}

// Use React.memo to prevent unnecessary re-renders
const ProtectedRoute = memo(({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading, session } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Only show loading spinner if authentication is taking longer than 100ms
  // This prevents flashing of loading state for quick auth checks
  useEffect(() => {
    if (!isLoading) {
      setShowLoader(false);
      return;
    }
    
    const timer = setTimeout(() => {
      if (isLoading) {
        setShowLoader(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Handle authentication errors
  useEffect(() => {
    if (!isLoading && !session && !isAuthenticated) {
      setAuthError('Your session has expired. Please log in again.');
      toast.error('Session expired. Please log in again.');
    }
  }, [isLoading, session, isAuthenticated]);

  // If still loading auth state and we should show the loader
  if (isLoading && showLoader) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="text-lg text-muted-foreground">Loading authentication...</span>
        </div>
      </div>
    );
  }

  // If there's an auth error, show error message
  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-semibold">Authentication Error</h2>
          <p className="text-muted-foreground">{authError}</p>
          <Button asChild>
            <Link to="/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and doesn't match, redirect to appropriate dashboard
  if (role && user?.role !== role) {
    const redirectPath = (() => {
      switch (user?.role) {
        case 'student': return '/student';
        case 'driver': return '/driver';
        case 'coordinator': return '/coordinator';
        case 'admin': return '/admin';
        default: return '/';
      }
    })();
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
