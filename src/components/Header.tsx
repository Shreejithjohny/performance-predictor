import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ROUTES } from '@/lib/constants';

interface HeaderProps {
  showNav?: boolean;
  activePath?: string;
}

/**
 * Reusable header component used across all pages
 */
export const Header = ({ showNav = true, activePath }: HeaderProps) => {
  const navItems = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Predict', href: ROUTES.PREDICT },
    { label: 'Upload', href: ROUTES.UPLOAD },
    { label: 'Analytics', href: ROUTES.ANALYTICS },
  ];

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground">PerformancePredictor</h1>
        </Link>

        {showNav && (
          <nav className="flex gap-4">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={activePath === item.href ? 'default' : 'ghost'}
                  className="transition-colors"
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
