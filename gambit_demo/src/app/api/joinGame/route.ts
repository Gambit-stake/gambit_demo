import pool from "@/lib/db"; // Import your database pool

import { NextRequest, NextResponse } from "next/server";

// Define the POST method to handle incoming requests
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { player1, player2, pricepool ,} = await req.json(); // Parse the incoming JSON data

        // Insert data into the stakedGames table
        const result = await pool.query(
            'INSERT INTO stakedgames (player1, player2, pricepool) VALUES ($1, $2, $3) RETURNING *',
            [player1, player2, pricepool] // Use parameterized queries to prevent SQL injection
        );

        const newGame = result.rows[0]; // Get the inserted row

        return NextResponse.json(newGame, { status: 201 }); // Return the created game data
    } catch (error) {
        console.error('Error inserting data:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
