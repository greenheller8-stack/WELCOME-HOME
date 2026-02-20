
import React, { useState } from 'react';
import { Match, MatchStatus, Theme } from '../types';
import { format } from 'date-fns';
import { Clock, Play, CheckCircle } from 'lucide-react';

interface MatchTableProps {
  matches: Match[];
  theme: Theme;
}

export const MatchTable: React.FC<MatchTableProps> = ({ matches, theme }) => {
  const isDark = theme === 'dark';
  const [touchedId, setTouchedId] = useState<string | null>(null);

  const handleTouchStart = (id: string) => setTouchedId(id);
  const handleTouchEnd = () => setTouchedId(null);

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {matches.map((match) => {
        const isTouched = touchedId === match.id;

        return (
        <div 
          key={match.id}
          onTouchStart={() => handleTouchStart(match.id)}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className={`group relative overflow-hidden transition-all duration-300 rounded-xl sm:rounded-2xl border ${
            isDark 
              ? `bg-white/[0.03] border-white/10 hover:border-[#D4FF00]/40 ${isTouched ? 'border-[#D4FF00]/40 bg-white/[0.06]' : ''}` 
              : `bg-white border-slate-200 shadow-sm hover:shadow-md ${isTouched ? 'shadow-md border-slate-300' : ''}`
          }`}
        >
          {match.status === MatchStatus.LIVE && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4FF00]"></div>
          )}

          <div className="p-4 sm:p-6">
            <div className="flex flex-col items-center gap-4 sm:hidden">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <img src={match.homeTeam.logo} alt={match.homeTeam.name} className={`w-6 h-6 object-contain transition-all duration-300 ${isTouched ? '' : 'grayscale'}`} />
                  </div>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {match.homeTeam.name}
                  </span>
                </div>
                
                <div className="flex flex-col items-center px-3 min-w-[80px]">
                  {match.status === MatchStatus.UPCOMING ? (
                    <span className={`text-xl font-black font-brand ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {format(new Date(match.startTime), 'HH:mm')}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-black font-brand ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {match.score.home}
                      </span>
                      <span className="text-white/30">-</span>
                      <span className={`text-2xl font-black font-brand ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {match.score.away}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className={`text-sm font-bold text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {match.awayTeam.name}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <img src={match.awayTeam.logo} alt={match.awayTeam.name} className={`w-6 h-6 object-contain transition-all duration-300 ${isTouched ? '' : 'grayscale'}`} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">
                  {match.league}
                </span>
                {match.status === MatchStatus.UPCOMING && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-500/10 text-slate-500">
                    <Clock size={8} /> Upcoming
                  </span>
                )}
                {match.status === MatchStatus.LIVE && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#D4FF00]/20 text-[#D4FF00] animate-pulse">
                    <Play size={8} fill="currentColor" /> {match.liveMinute}'
                  </span>
                )}
                {match.status === MatchStatus.FINISHED && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white/10 text-white/50">
                    <CheckCircle size={8} /> FT
                  </span>
                )}
              </div>
            </div>

            <div className="hidden sm:flex items-center justify-between gap-6">
              <div className="flex-1 flex items-center justify-end gap-4">
                <span className={`text-lg md:text-xl font-bold tracking-tight text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {match.homeTeam.name}
                </span>
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                }`}>
                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-8 h-8 md:w-10 md:h-10 object-contain grayscale group-hover:grayscale-0 transition-all" />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 px-8 min-w-[180px]">
                 <div className="mb-2">
                  {match.status === MatchStatus.UPCOMING && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-500/10 text-slate-500 border border-slate-500/20">
                      <Clock size={10} /> Upcoming
                    </span>
                  )}
                  {match.status === MatchStatus.LIVE && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#D4FF00]/20 text-[#D4FF00] border border-[#D4FF00]/40 animate-pulse">
                      <Play size={10} fill="currentColor" /> Live • {match.liveMinute}'
                    </span>
                  )}
                  {match.status === MatchStatus.FINISHED && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white/50 border border-white/10">
                      <CheckCircle size={10} /> Finished
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4">
                  {match.status === MatchStatus.UPCOMING ? (
                    <div className={`text-2xl md:text-3xl font-black font-brand ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {format(new Date(match.startTime), 'HH:mm')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-6">
                      <span className={`text-4xl md:text-5xl font-black font-brand ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {match.score.home}
                      </span>
                      <span className="text-white/20 text-2xl font-light">:</span>
                      <span className={`text-4xl md:text-5xl font-black font-brand ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {match.score.away}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                  {match.league}
                </div>
              </div>

              <div className="flex-1 flex items-center justify-start gap-4">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                }`}>
                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-8 h-8 md:w-10 md:h-10 object-contain grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <span className={`text-lg md:text-xl font-bold tracking-tight text-left ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {match.awayTeam.name}
                </span>
              </div>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};
