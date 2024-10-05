// // Define types for the function parameters
// async function trackLichessGame(gameId: string, userIdWhite: string, userIdBlack: string): Promise<void> {
//     try {
//         // Fetch the game data from the Lichess API
//         const response = await fetch(`https://lichess.org/game/export/${gameId}`);
        
//         // Check if the response is OK
//         if (!response.ok) {
//             throw new Error(`Error: ${response.status} - ${await response.text()}`);
//         }
  
//         // Get response as text (PGN format)
//         const gameData: string = await response.text();
//         console.log(gameData); // Log the PGN data
  
//         // Extract player names and IDs from the PGN data
//         const whitePlayerMatch: RegExpMatchArray | null = gameData.match(/\[White "([^"]+)"\]/);
//         const blackPlayerMatch: RegExpMatchArray | null = gameData.match(/\[Black "([^"]+)"\]/);
        
//         const whitePlayer: string | null = whitePlayerMatch ? whitePlayerMatch[1] : null;
//         const blackPlayer: string | null = blackPlayerMatch ? blackPlayerMatch[1] : null;
  
//         // Check if the game is finished
//         let result: string;
//         if (gameData.includes('1-0')) {
//             result = 'White wins';
//         } else if (gameData.includes('0-1')) {
//             result = 'Black wins';
//         } else if (gameData.includes('1/2-1/2')) {
//             result = 'Draw';
//         } else {
//             console.log('Game is still ongoing.');
//             return;
//         }
  
//         // Determine the winner
//         if (result === 'White wins') {
//             console.log(`Game finished. Result: ${result}. Winner: ${whitePlayer}`);
//         } else if (result === 'Black wins') {
//             console.log(`Game finished. Result: ${result}. Winner: ${blackPlayer}`);
//         } else {
//             console.log(`Game finished. Result: ${result}. It's a draw.`);
//         }
  
//     } catch (error) {
//         console.error('Error fetching game data:', error);
//     }
// }
  
// // Example usage
// trackLichessGame('galaIH2f', 'yourWhiteUserId', 'yourBlackUserId');


import fs from 'fs';

// Define types for the function parameters
interface GameResult {
    whitePlayer: string | null;
    blackPlayer: string | null;
    result: string;
}

async function trackLichessGame(gameId: string, userIdWhite: string, userIdBlack: string): Promise<GameResult | null> {
    try {
        // Fetch the game data from the Lichess API
        const response = await fetch(`https://lichess.org/game/export/${gameId}`);
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }
  
        // Get response as text (PGN format)
        const gameData: string = await response.text();
        console.log(gameData); // Log the PGN data
  
        // Extract player names and IDs from the PGN data
        const whitePlayerMatch: RegExpMatchArray | null = gameData.match(/\[White "([^"]+)"\]/);
        const blackPlayerMatch: RegExpMatchArray | null = gameData.match(/\[Black "([^"]+)"\]/);
        
        const whitePlayer: string | null = whitePlayerMatch ? whitePlayerMatch[1] : null;
        const blackPlayer: string | null = blackPlayerMatch ? blackPlayerMatch[1] : null;
  
        // Check if the game is finished
        let result: string;
        if (gameData.includes('1-0')) {
            result = 'White wins';
        } else if (gameData.includes('0-1')) {
            result = 'Black wins';
        } else if (gameData.includes('1/2-1/2')) {
            result = 'Draw';
        } else {
            console.log('Game is still ongoing.');
            return null;
        }

        // Structure the result as a JSON object
        const gameResult: GameResult = {
            whitePlayer,
            blackPlayer,
            result,
        };
  
        // Save the result as a JSON file
        const jsonString = JSON.stringify(gameResult, null, 2);
        fs.writeFileSync('gameResult.json', jsonString);
        console.log('Game result saved as JSON.');
  
        return gameResult;
  
    } catch (error) {
        console.error('Error fetching game data:', error);
        return null;
    }
}
  
// Example usage
trackLichessGame('galaIH2f', 'yourWhiteUserId', 'yourBlackUserId');
