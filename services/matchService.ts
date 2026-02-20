import { Match, MatchStatus } from '../types';

const API_URL = '/api/matches';

export async function fetchLiveMatches(): Promise<Match[]> {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    
    const data = await response.json();
    
    return data.map((match: any) => ({
      ...match,
      status: match.status === 'LIVE' ? MatchStatus.LIVE :
              match.status === 'FINISHED' ? MatchStatus.FINISHED :
              MatchStatus.UPCOMING
    }));
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return [];
  }
}

export const mockMatches: Match[] = [];
