// app/api/getGames/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Adjust the import path according to your structure

// API route to fetch available games
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        // Query the database to get all available games
        const result = await pool.query('SELECT * FROM available_games');

        const games = result.rows; // Extract the rows from the result

        return NextResponse.json(games, { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
