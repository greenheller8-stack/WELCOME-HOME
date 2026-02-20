import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/matches', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/date/${today}?api_token=${API_TOKEN}&include=participants;scores;league.country;state`,
      { method: 'GET' }
    );

    const data = await response.json();

    if (!data.data) {
      console.error('API Error:', data.message || data);
      return res.status(400).json({ error: data.message || 'API error' });
    }

    const liveStates = ['INPLAY_1ST_HALF', 'INPLAY_2ND_HALF', 'HT', 'INPLAY_ET', 'INPLAY_ET_2ND_HALF', 'PEN_BREAK', 'INPLAY_PENALTIES'];
    const finishedStates = ['FT', 'AET', 'FT_PEN', 'CANCELLED', 'AWARDED', 'WALKOVER', 'ABANDONED'];

    const matches = data.data.map(fixture => {
      const homeTeam = fixture.participants?.find(p => p.meta?.location === 'home');
      const awayTeam = fixture.participants?.find(p => p.meta?.location === 'away');
      const homeScore = fixture.scores?.find(s => s.description === 'CURRENT' && s.score?.participant === 'home');
      const awayScore = fixture.scores?.find(s => s.description === 'CURRENT' && s.score?.participant === 'away');
      const stateName = fixture.state?.developer_name || '';

      return {
        id: fixture.id.toString(),
        league: (fixture.league?.name || 'UNKNOWN').toUpperCase(),
        leagueId: fixture.league_id,
        country: (fixture.league?.country?.name || '').toUpperCase(),
        homeTeam: {
          name: (homeTeam?.name || 'TBD').toUpperCase(),
          logo: homeTeam?.image_path || ''
        },
        awayTeam: {
          name: (awayTeam?.name || 'TBD').toUpperCase(),
          logo: awayTeam?.image_path || ''
        },
        startTime: fixture.starting_at,
        status: liveStates.includes(stateName) ? 'LIVE' :
                finishedStates.includes(stateName) ? 'FINISHED' : 'UPCOMING',
        score: {
          home: homeScore?.score?.goals ?? 0,
          away: awayScore?.score?.goals ?? 0
        },
        minute: null
      };
    });

    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`eFootball server running on port ${PORT}`);
});
