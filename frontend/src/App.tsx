import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NetworkBanner } from './components/NetworkBanner';
import { Star, Menu, X, Moon, Sun } from 'lucide-react';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Institutes = lazy(() => import('./pages/Institutes').then((m) => ({ default: m.Institutes })));
const InstituteDetail = lazy(() => import('./pages/InstituteDetail').then((m) => ({ default: m.InstituteDetail })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const AuthCallback = lazy(() => import('./pages/AuthCallback').then((m) => ({ default: m.AuthCallback })));
const Rankings = lazy(() => import('./pages/Rankings').then((m) => ({ default: m.Rankings })));
const Map = lazy(() => import('./pages/Map').then((m) => ({ default: m.Map })));

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/institutes', label: 'Institutes' },
    { to: '/rankings', label: 'Rankings' },
    { to: '/map', label: 'Map' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <Star size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-[var(--color-text)]">SchoolReview</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-emerald-700 text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]'}`
              }>{label}</NavLink>
            ))}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2">
                {user?.avatar && <img src={user.avatar} alt="" className="w-7 h-7 rounded-full" />}
                <span className="text-sm text-[var(--color-muted)]">{user?.name}</span>
                <button onClick={logout} className="text-xs text-red-500 hover:text-red-700">Logout</button>
              </div>
            ) : (
              <NavLink to="/login" className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-700 text-white hover:bg-emerald-800">
                Sign In
              </NavLink>
            )}
            <button onClick={() => setDark(!dark)} className="p-1.5 rounded-md text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors" aria-label="Toggle dark mode">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setDark(!dark)} className="p-1.5 text-[var(--color-muted)]">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 text-[var(--color-muted)]">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-3 space-y-1 border-t border-[var(--color-border)] pt-3">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--color-muted)]">{label}</NavLink>
            ))}
            {!isAuthenticated && (
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-emerald-700">Sign In</NavLink>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function Loading() {
  return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" /></div>;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() { if (this.state.hasError) { return <div style={{color:'red',padding:20}}><h1>Error</h1><pre>{String(this.state.error)}</pre></div>; } return this.props.children; }
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <NetworkBanner />
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/institutes" element={<Institutes />} />
                <Route path="/institutes/:eiin" element={<InstituteDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/rankings" element={<Rankings />} />
                <Route path="/map" element={<Map />} />
              </Routes>
            </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}