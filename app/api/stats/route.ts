import {
  getCompanyStats,
  getGameCompletionStats,
  getPlayerStats,
  getSeriesStats
} from '@/lib/queries/stats';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';

    let stats: any = {};

    if (type === 'all' || type === 'players') {
      stats.players = await getPlayerStats();
    }

    if (type === 'all' || type === 'games') {
      stats.games = await getGameCompletionStats();
    }

    if (type === 'all' || type === 'companies') {
      stats.companies = await getCompanyStats();
    }

    if (type === 'all' || type === 'series') {
      stats.series = await getSeriesStats();
    }

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
