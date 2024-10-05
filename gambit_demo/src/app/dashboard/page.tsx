'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";

interface Stake {
    wallet_address: string;
    game_link: string;
    stakeamount: number;
    lichessid: string;
}

interface FinishedGame {
    user: string;
    game: string;
    amount: number;
}

export default function Dashboard() {
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [stakeSubmitted, setStakeSubmitted] = useState(false);
    const [matchLink, setMatchLink] = useState('');
    const [lichessID, setLichessID] = useState('');
    const [successStake, setSuccessStake] = useState(false);
    const [currentGame, setCurrentGame] = useState({
        user: '',
        game: '',
        amount: 0,
    });
    const [newStake, setNewStake] = useState({
        gameName: '',
        stakeAmount: 0,
        lichessid: '',
        description: '',
    });
    const [ongoingStakes, setOngoingStakes] = useState([
        { user: 'Alice', game: 'Game A', amount: 50 },
        { user: 'Bob', game: 'Game B', amount: 75 },
    ]);
    const [finishedGames, setFinishedGames] = useState<FinishedGame[]>([]);
    const [joinableStakes, setJoinableStakes] = useState<Stake[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [creatingStake, setCreatingStake] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // State for ongoing matches
    const [ongoingMatches, setOngoingMatches] = useState([
        { player1: 'chessbelle', player2: 'ruyatech', gameLink: 'https://liches.org/yTKAGHIO', status: 'Game finished' ,winner:'chessbelle'},
    ]);

    useEffect(() => {
        const fetchStakes = async () => {
            try {
                setLoading(true);
                const joinableResponse = await fetch('/api/fetchGames');
                if (!joinableResponse.ok) {
                    throw new Error('Failed to fetch joinable stakes');
                }
                const joinableData = await joinableResponse.json();
                setJoinableStakes(joinableData);

                const finishedResponse = await fetch('/api/fetchFinishedGames');
                if (!finishedResponse.ok) {
                    throw new Error('Failed to fetch finished games');
                }
                const finishedData = await finishedResponse.json();
                setFinishedGames(finishedData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStakes();
    }, []);

    const openJoinStakeModal = (user: string, game: string, amount: number) => {
        setCurrentGame({ user, game, amount });
        setIsJoinModalOpen(true);
        setStakeSubmitted(false);
        setMatchLink('');
    };

    const openCreateStakeModal = () => {
        setIsCreateModalOpen(true);
        setSuccessMessage('');
    };

    const closeModals = () => {
        setIsJoinModalOpen(false);
        setIsCreateModalOpen(false);
        setSuccessMessage('Staking was successful');
    };

    const submitStake = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStakeSubmitted(true);
        setMatchLink('https://lichess.org/galaIH2f');
    };

    const createStake = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreatingStake(true);

        try {
            const response = await fetch('/api/createGames', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStake),
            });
            if (!response.ok) {
                throw new Error('Failed to create stake');
            }

            setNewStake({ gameName: '', stakeAmount: 0, lichessid: '', description: '' });
            closeModals();
            setSuccessMessage('Stake has been created!');

            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCreatingStake(false);
        }
    };

    return (
        <>
            <section className="min-h-screen w-full bg-[#1a1818] p-4 rounded-md">
                <div className="max-w-6xl mx-auto bg-[#0f0f0f61] rounded-lg h-full">
                    <header className="bg-[#1e1e1e]">
                        <nav>
                            <ul className="flex justify-between items-center pr-10">
                                <div className="flex items-center gap-4">
                                    <Image src={'/images/logo.png'} alt="Logo" height={100} width={100} unoptimized className="w-48 h-48"/>
                                    <Link href="your-oauth-url" className="underline text-[#00BF63] text-sm transition duration-300 ease-in-out hover:text-white">
                                        Link Lichess
                                    </Link>
                                </div>
                                <li>
                                    <a href="" className="flex justify-between items-center gap-2">
                                        <Link href="#" className="underline text-[#00BF63] text-sm transition duration-300 ease-in-out hover:text-white">
                                            Disconnect
                                        </Link>
                                        <Link href="/" className="flex gap-2 items-center bg-[#131313] py-3 px-5 rounded-md transition-all duration-300 ease-in-out hover:bg-white hover:text-[#00BF63] transform hover:scale-105">
                                            <FaUserCircle className="text-[#00BF63]"/> UserName
                                        </Link>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </header>

                    {/* Main Content */}
                    <div className="w-full p-5">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Create a Stake Section */}
                            <div className="flex-1 flex flex-col justify-center items-center gap-6 p-5 bg-[#1e1e1e] rounded-md transition duration-300 ease-in-out transform hover:scale-105">
                                <p className="text-2xl md:text-3xl font-bold text-white text-center">Create a Stake and Play with Interested Parties</p>
                                <button
                                    className="py-3 px-6 bg-white text-[#00BF63] rounded-md text-sm flex items-center gap-3 transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={openCreateStakeModal}
                                >
                                    <IoGameController /> Stake a Game
                                </button>
                                {successMessage && (
                                    <p className="text-green-500">{successMessage}</p>
                                )}
                            </div>

                            {/* Join a Stake Section */}
                            <div className="flex-1 bg-[#2a2a2a] p-6 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105">
                                <h3 className="text-xl md:text-2xl text-white font-semibold mb-4 text-center">Join a Stake</h3>
                                {/* Staking Information */}
                                {joinableStakes.length > 0 ? (
                                    joinableStakes.map((stake, index) => (
                                        <div key={index} className="p-4 bg-[#1e1e1e] rounded-md mb-4">
                                            <p className="text-white"><strong className='text-gray-500'>User: </strong>{stake.lichessid}</p>
                                            <p className="text-white"><strong className='text-gray-500'>Amount: </strong>{stake.stakeamount}</p>
                                            <p className="text-white"><strong className='text-gray-500'>Game: </strong>Lichess</p>
                                            <button
                                                className="mt-4 py-2 px-4 bg-[#00BF63] text-white rounded transition-all duration-300 ease-in-out transform hover:scale-105"
                                                onClick={() => openJoinStakeModal(stake.lichessid, stake.game_link, stake.stakeamount)}
                                            >
                                                Join Stake
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white text-center">No matches available for staking.</p>
                                )}
                            </div>
                        </div>

                        {/* Match Tracking Section */}
                        <div className="mt-6 bg-[#2a2a2a] p-6 rounded-md">
                            <h3 className="text-xl md:text-2xl text-white font-semibold mb-4 text-center">Match Tracking</h3>
                            {ongoingMatches.length > 0 ? (
                                ongoingMatches.map((match, index) => (
                                    <div key={index} className="p-4 bg-[#1e1e1e] rounded-md mb-4">
                                        <p className="text-white"><strong className='text-gray-500'>Player 1: </strong>{match.player1}</p>
                                        <p className="text-white"><strong className='text-gray-500'>Player 2: </strong>{match.player2}</p>
                                        <p className="text-white"><strong className='text-gray-500'>Status: </strong>{match.status}</p>
                                        <p className="text-white"><strong className='text-gray-500'>Winner: </strong>{match.winner}</p>

                                        {/* <a href={match.gameLink} target="_blank" rel="noopener noreferrer" className="mt-2 text-[#00BF63] underline">Watch Match</a> */}
                                    </div>
                                ))
                            ) : (
                                <p className="text-white text-center">No ongoing matches at the moment.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Modals for Creating and Joining Stakes */}
            {/* Your modal code goes here */}
         {isJoinModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-[#1e1e1e] rounded-md p-5">
             <h3 className="text-lg font-bold mb-4">Join Stake for {currentGame.user}</h3>
             <form onSubmit={submitStake}>
                 {/* <p className="mb-2">Game: {currentGame.game}</p> */}
                 <p className="mb-2">Stake Amount: {currentGame.amount}</p>
                
                 <button
                     type="submit"
                     className="py-2 px-4 bg-[#00BF63] text-white rounded transition-all duration-300 ease-in-out transform hover:scale-105"
                 >
                     Confirm Join
                 </button>
                
                 <button
                     type="button"
                     className="ml-2 py-2 px-4 bg-gray-300 rounded transition-all duration-300 ease-in-out transform hover:scale-105"
                     onClick={closeModals}
                 >
                     Close
                 </button>
             </form>
            
             {/* Conditionally render the game link after stake is submitted */}
             {stakeSubmitted && (
                 <p className="mt-4 text-white">
                     You have successfully joined the stake! View your game <a href={matchLink} className="text-blue-500 underline">here</a>.
                 </p>
             )}
         </div>
     </div>
 )}



             {/* Create Stake Modal */}
 {isCreateModalOpen && (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-[#1e1e1e] rounded-md p-5">
            
             {successStake && (<div className='text-center bg-black text-green-500 h-full w-full z-30 relative top-0'>
                 <h3>stake Created Successfully!!!</h3>
                 <button>
                     Close
                 </button>
             </div>)}
             <h3 className="text-lg font-bold mb-4">Create a Stake</h3>
             {successMessage && (
                 <div className="mb-4 p-2 bg-green-500 text-white rounded-md">
                     {successMessage}
                 </div>
             )}
             <form onSubmit={createStake}>
                 <div className="mb-2">
                     <label className="block text-sm">Game Link</label>
                     <input
                         type="text"
                         value={newStake.gameName}
                         onChange={(e) => setNewStake({ ...newStake, gameName: e.target.value })}                       
                         className="border border-gray-300 rounded p-2 w-full bg-transparent"
                         required
                     />
                 </div>
                 <div className="mb-2">
                     <label className="block text-sm">Stake Amount</label>
                     <input
                         type="text"
                         onChange={(e) => setNewStake({ ...newStake, stakeAmount: Number(e.target.value) })}
                         className="border border-gray-300 rounded p-2 w-full bg-transparent"
                         required
                     />
                 </div>
                 <div className="mb-2">
                     <label className="block text-sm">Lichess ID</label>
                     <input
                         type="text"
                         value={newStake.lichessid}
                        onChange={(e) => setNewStake({ ...newStake, lichessid: e.target.value })}
                         className="border border-gray-300 rounded p-2 w-full bg-transparent"
                         required
                     />
                 </div>
                 <div className="mb-2">
                     <label className="block text-sm">Description</label>
                     <textarea
                         value={newStake.description}
                         onChange={(e) => setNewStake({ ...newStake, description: e.target.value })}
                         className="border border-gray-300 rounded p-2 w-full bg-transparent"
                     />
                 </div>
                 <button type="submit" className="py-2 px-4 bg-[#00BF63] text-white rounded transition-all duration-300 ease-in-out transform hover:scale-105" onClick={() => {setSuccessStake(true)}}>
                     {creatingStake ? 'Creating...' : 'Create Stake'}
                 </button>
                 <button type="button" className="ml-2 py-2 px-4 bg-gray-300 rounded transition-all duration-300 ease-in-out transform hover:scale-105" onClick={closeModals}>
                     Close
                 </button>
             </form>
         </div>
     </div>
)}

        </>
    );
}
