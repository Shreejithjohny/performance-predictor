import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { ROUTES } from '@/lib/constants';

interface HeaderProps {
  showNav?: boolean;
  activePath?: string;
}

/**
 * Reusable header component used across all pages
 * Mobile-responsive with hamburger menu on small screens
 */
export const Header = ({ showNav = true, activePath }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Predict', href: ROUTES.PREDICT },
    { label: 'Upload', href: ROUTES.UPLOAD },
    { label: 'Analytics', href: ROUTES.ANALYTICS },
    { label: 'Detailed Analytics', href: ROUTES.ANALYTICS_DETAIL },
  ];

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">PerformancePredictor</h1>
          </Link>

          {showNav && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-2">
                {navItems.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={activePath === item.href ? 'default' : 'ghost'}
                      className="transition-colors text-sm"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {showNav && isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                <Button
                  variant={activePath === item.href ? 'default' : 'ghost'}
                  className="w-full justify-start transition-colors"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
