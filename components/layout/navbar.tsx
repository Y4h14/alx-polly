'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const pathname = usePathname();
  
  // Check if user is logged in (placeholder for actual auth check)
  const isLoggedIn = false;
  
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Alx-Polly
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/polls" 
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith('/polls') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Polls
            </Link>
            {isLoggedIn && (
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Button variant="outline" size="sm">
              Logout
            </Button>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}