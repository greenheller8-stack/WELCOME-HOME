
import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { ThemeToggle } from './components/ThemeToggle';
import { MatchTable } from './components/MatchTable';
import { Theme, Match } from './types';
import { fetchLiveMatches } from './services/matchService';
import { format } from 'date-fns';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLiveMatches();
        if (data.length > 0) {
          setMatches(data);
        } else {
          setError('No matches available');
        }
      } catch (err) {
        setError('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  const filters = [
    { id: 'all', label: 'All Matches' },
    { id: 'premier', label: 'Premier League' },
    { id: 'spain', label: 'Copa Del Rey' },
    { id: 'italy', label: 'Serie A' },
    { id: 'germany', label: 'Bundesliga' },
    { id: 'france', label: 'Ligue 1' },
    { id: 'live', label: 'Live Now' },
    { id: 'finished', label: 'Finished Matches' }
  ];

  const countryFilters: Record<string, string> = {
    premier: 'ENGLAND',
    spain: 'SPAIN',
    italy: 'ITALY',
    germany: 'GERMANY',
    france: 'FRANCE',
  };

  const countryPriority: Record<string, number> = {
    ENGLAND: 0,
    SPAIN: 1,
    ITALY: 2,
    GERMANY: 3,
    FRANCE: 4,
  };

  const leaguePriority = (match: Match): number => {
    return countryPriority[match.country] ?? 5;
  };

  const filteredMatches = matches.filter(match => {
    const isFinished = match.status === 'finished';
    if (activeFilter === 'finished') return isFinished;
    if (activeFilter === 'all') return !isFinished;
    if (activeFilter === 'live') return match.status === 'live';
    if (countryFilters[activeFilter]) return !isFinished && match.country === countryFilters[activeFilter];
    return !isFinished;
  }).sort((a, b) => leaguePriority(a) - leaguePriority(b));

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#0A0F1E] text-white' : 'bg-[#F8FAFC] text-[#0A0F1E]'
    }`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4FF00]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4FF00]/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="relative z-20 border-b border-white/10 backdrop-blur-xl sticky top-0 bg-white/5 shadow-lg shadow-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-brand text-xl sm:text-2xl font-bold tracking-tighter">
              E<span className="text-[#D4FF00]">FOOTBALL</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-widest">
              <a href="#" className="hover:text-[#D4FF00] transition-colors">Leagues</a>
              <a href="#" className="hover:text-[#D4FF00] transition-colors">Standings</a>
              <a href="#" className="hover:text-[#D4FF00] transition-colors text-[#D4FF00]">Matches</a>
            </nav>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 py-4 px-4">
            <nav className="flex flex-col gap-4 text-sm font-semibold uppercase tracking-widest">
              <a href="#" className="hover:text-[#D4FF00] transition-colors py-2">Leagues</a>
              <a href="#" className="hover:text-[#D4FF00] transition-colors py-2">Standings</a>
              <a href="#" className="hover:text-[#D4FF00] transition-colors text-[#D4FF00] py-2">Matches</a>
            </nav>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-3 sm:mb-4 tracking-tight leading-none">
            TODAY'S <span className="text-[#D4FF00]">CLASHES</span>
          </h1>
          
          <p className="text-base sm:text-lg opacity-60 max-w-2xl mb-6 sm:mb-8">
            Real-time scores, upcoming fixtures, and detailed statistics. Tracking every pulse of the beautiful game.
          </p>

          <div className="flex items-center gap-3 mb-6 sm:mb-10">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <div className="px-3 sm:px-4 py-2 rounded-xl bg-[#D4FF00]/5 border border-[#D4FF00]/20 backdrop-blur-sm">
               <span className="text-[#D4FF00] font-brand text-lg sm:text-xl font-bold tracking-widest">
                {format(currentTime, 'HH:mm:ss')}
               </span>
               <span className="ml-2 text-[10px] font-black opacity-40 uppercase tracking-tighter">UTC+1</span>
            </div>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>
        </div>

        <section className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-white/5 pb-4 sm:pb-6">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-1 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-tighter transition-all ${
                    activeFilter === filter.id
                      ? 'bg-[#D4FF00] text-[#0A0F1E] shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                      : 'border border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="text-sm font-medium opacity-60">
              Date: <span className="text-[#D4FF00]">{format(new Date(), 'dd MMM yyyy')}</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-[#D4FF00] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg opacity-60">Loading live matches...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 opacity-60">
              <p className="text-lg">{error}</p>
            </div>
          ) : filteredMatches.length > 0 ? (
            <MatchTable matches={filteredMatches} theme={theme} />
          ) : (
            <div className="text-center py-12 opacity-60">
              <p className="text-lg">No matches found for this filter.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 sm:py-12 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Logo size={32} />
          </div>
          <p className="text-xs sm:text-sm opacity-40">
            &copy; 2026 EFOOTBALL GLOBAL. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
