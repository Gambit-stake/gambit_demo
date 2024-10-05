// app/api/createGame/route.ts
import { NextRequest, NextResponse } from 'next/server'; // Types for Next.js API routes
import pool from '@/lib/db'; // Adjust the import path according to your structure

interface Game {
    id?: number;
    game_link: string;
    description?: string;
    stakeAmount: number;
    lichessid:string;
    createdAt?: string; // Assuming you have a createdAt timestamp
}

// API route to create a game
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { game_link, description, stakeAmount, lichessid}: Game = await req.json();

        // Validate request body
        if (!game_link || !stakeAmount || !lichessid || !description) {
            return NextResponse.json(
                { message: 'Details not complete' },
                { status: 400 }
            );
        }

        // Insert the new game into the available_games table
        const result = await pool.query(
            'INSERT INTO available_games (game_link, description, stakeAmount, lichessID) VALUES ($1, $2, $3, $4) RETURNING *',
            [game_link, description || null, stakeAmount,lichessid]
        );

        console.log(result);
        const newGame: Game = result.rows[0];
        return NextResponse.json(newGame, { status: 201 });

    } catch (error) {
        console.error('Error inserting data:', error);
        return NextResponse.json(
            { message: 'Internal server error', error },
            { status: 500 }
        );
    }
}
