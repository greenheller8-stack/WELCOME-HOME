
export enum MatchStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  FINISHED = 'finished'
}

export interface Team {
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: string; // ISO string
  status: MatchStatus;
  score: {
    home: number;
    away: number;
  };
  liveMinute?: number;
  league: string;
  leagueId: number;
  country: string;
}

export type Theme = 'light' | 'dark';
