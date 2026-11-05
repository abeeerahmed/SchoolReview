import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { statsApi, institutesApi } from '../api/client';
import { GraduationCap, School, BookOpen, ArrowRight, MapPin, Star, Trophy } from 'lucide-react';

export function Home() {
  const { data: stats, isLoading: loading } = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: () => statsApi.overview().then((r) => r.data),
  });
  const { data: featured } = useQuery({
    queryKey: ['institute', 'random'],
    queryFn: () => institutesApi.random().then((r) => r.data),
  });

  const cards = [
    { label: 'Total Institutes', value: stats?.total_institutes, icon: School },
    { label: 'Primary Schools', value: stats?.primary, icon: BookOpen },
    { label: 'Post-Primary', value: stats?.post_primary, icon: GraduationCap },
    { label: 'Reviews', value: stats?.total_reviews || 0, icon: Star },
  ];

  return (
    <div className="space-y-16 page-enter">
      <section className="py-12 md:py-20 hero-pattern">
        <div className="max-w-3xl">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-4 tracking-widest uppercase">
            Bangladesh Education Reviews
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6 text-[var(--color-text)]">
            Find the best<br />
            <span className="text-emerald-700 dark:text-emerald-400">school for you.</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--color-muted)] max-w-xl mb-8 leading-relaxed">
            Read real reviews from students and parents. Rate schools on teaching, facilities, treatment, and more.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/institutes" className="inline-flex items-center gap-2 bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors text-sm">
              Browse Schools <ArrowRight size={16} />
            </Link>
            <Link to="/rankings" className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium px-5 py-2.5 rounded-lg hover:bg-[var(--color-border)] transition-colors text-sm">
              <Trophy size={16} /> Top Rated
            </Link>
            <Link to="/map" className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium px-5 py-2.5 rounded-lg hover:bg-[var(--color-border)] transition-colors text-sm">
              <MapPin size={16} /> Map
            </Link>
          </div>
        </div>
      </section>

      {featured && featured.institute_name && (
        <section>
          <div className="card p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/20 rounded-bl-full opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className="text-amber-500" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Featured School</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-2">{featured.institute_name}</h2>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                {featured.district}, {featured.division} · {featured.institute_type} · {featured.level}
              </p>
              <Link to={`/institutes/${featured.eiin_or_code}`} className="inline-flex items-center gap-2 bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors text-sm">
                View & Review <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-5">
              <Icon size={20} className="text-emerald-700 dark:text-emerald-400 mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-text)] tabular">
                {loading ? '—' : (value ?? 0).toLocaleString()}
              </p>
              <p className="text-sm text-[var(--color-muted)] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          { to: '/institutes', title: 'Browse Schools', desc: `Explore ${(stats?.total_institutes ?? 0).toLocaleString()} institutes` },
          { to: '/rankings', title: 'Top Rated', desc: 'Highest rated schools by district' },
          { to: '/map', title: 'Map View', desc: 'Find schools near you' },
        ].map(({ to, title, desc }) => (
          <Link key={to} to={to} className="card p-5 group">
            <h3 className="font-semibold text-[var(--color-text)] group-hover:text-emerald-700 transition-colors">{title}</h3>
            <p className="text-sm text-[var(--color-muted)] mt-1">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}