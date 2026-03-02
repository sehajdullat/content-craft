import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          <span className="font-serif text-xl font-semibold text-foreground">The Journal</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
