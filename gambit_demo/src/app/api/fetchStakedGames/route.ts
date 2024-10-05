import pool from "@/lib/db"; // Import your database pool
import { NextRequest, NextResponse } from "next/server";

// Define the GET method to handle incoming requests
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        // Query the database to get all stakes from the stakedGames table
        const result = await pool.query('SELECT * FROM stakedGames'); // Adjust table name if necessary

        const games = result.rows; // Extract the rows from the result

        return NextResponse.json(games, { status: 200 }); // Return the game stakes data
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
