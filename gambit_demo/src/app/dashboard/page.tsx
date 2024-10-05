'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";

interface Stake {
    wallet_address: string;
    game_link: string;
    stakeamount: number;
    lichessid:string;
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
    const [lichessID,setLichessID] = useState('');
    const [currentGame, setCurrentGame] = useState({
        user: '',
        game: '',
        amount: 0,
    });
    const [newStake, setNewStake] = useState({
        gameName: '',
        stakeAmount: 0,
        lichessid : '',
        description: '',
    });
    const [ongoingStakes, setOngoingStakes] = useState([
        { user: 'Alice', game: 'Game A', amount: 50 },
        { user: 'Bob', game: 'Game B', amount: 75 },
    ]);
    const [finishedGames, setFinishedGames] = useState<FinishedGame[]>([
        { user: 'Charlie', game: 'Game C', amount: 30 },
        { user: 'David', game: 'Game D', amount: 20 },
    ]);
    const [joinableStakes, setJoinableStakes] = useState<Stake[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStakes();
    }, []);

    const openJoinStakeModal = (user: string, game: string, amount: number,) => {
        setCurrentGame({ user, game, amount });
        setIsJoinModalOpen(true);
        setStakeSubmitted(false);
        setMatchLink('');
    };

    const openCreateStakeModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeModals = () => {
        setIsJoinModalOpen(false);
        setIsCreateModalOpen(false);
    };

    const submitStake = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStakeSubmitted(true);
        setMatchLink('https://lichess.org/galaIH2f');
    };


    const createStake = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
    
            // // Optionally, fetch updated stakes after creating a new stake
            // await fetchStakes();
    
            // Reset the form
            setNewStake({ gameName: '', stakeAmount: 0 ,lichessid: '',description: ''});
            closeModals();
        } catch (err: any) {
            setError(err.message);
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
                                    {/* Lichess OAuth Link */}
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
                            </div>

                            {/* Join a Stake Section */}
                            <div className="flex-1 bg-[#2a2a2a] p-6 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105">
                                <h3 className="text-xl md:text-2xl text-white font-semibold mb-4 text-center">Join a Stake</h3>

                                {/* Staking Information */}
                                {loading ? (
                                    <p className="text-white text-center">Loading...</p>
                                ) : error ? (
                                    <p className="text-white text-center">Error: {error}</p>
                                ) : joinableStakes.length > 0 ? (
                                    joinableStakes.map((stake, index) => (
                                        <div key={index} className="p-4 bg-[#1e1e1e] rounded-md mb-4">
                                            <p className="text-white"><strong className='text-gray-500'>User:    </strong>{stake.lichessid}</p>
                                            <p className="text-white"><strong className='text-gray-500'>Amount:  </strong>{stake.stakeamount}</p>
                                            <p className="text-white"><strong className='text-gray-500'>Game:  </strong>Lichess</p>
                                            {/* <p className="text-gray-500">gamID: <strong className='text-white'>  {stake.lichessid}</strong></p> */}
                                            <button
                                                className="mt-4 py-2 px-4 bg-[#00BF63] text-white rounded transition-all duration-300 ease-in-out transform hover:scale-105"
                                                onClick={() => openJoinStakeModal(stake.lichessid, stake.game_link, stake.stakeamount)}
                                            >
                                                Join Stake
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white text-center">No matches available to join.</p>
                                )}
                            </div>
                        </div>                        

                        {/* Finished Games Section */}
                        <div className="mt-6 p-6 bg-[#2a2a2a] rounded-md transition-all duration-300 ease-in-out">
                            <h3 className="text-xl md:text-2xl text-white font-semibold mb-4 text-center">Staked Games</h3>
                            {finishedGames.length > 0 ? (
                                <div className="space-y-4">
                                    {finishedGames.map((game, index) => (
                                        <div key={index} className="p-4 bg-[#1e1e1e] rounded-md">
                                            <p className="text-white"><strong>User:</strong> {game.user}</p>
                                            <p className="text-white"><strong>Game:</strong> {game.game}</p>
                                            <p className="text-white"><strong>Amount:</strong> {game.amount} USDC</p>
                                        </div>
                                    ))}  
                                </div>
                            ) : (
                                <p className="text-white text-center">No finished games available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
{isJoinModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#1e1e1e] rounded-lg p-6 w-96">
            <h2 className="text-xl mb-4">Join Stake</h2>
            <p><strong>User:</strong> {currentGame.user}</p>
            <p><strong>Amount:</strong> {currentGame.amount} SOL</p>
            <form onSubmit={submitStake}>
                <input
                    type="text"
                    placeholder="Enter Lichess ID"
                    onChange={(e) => setLichessID(e.target.value)} // Ensure you have a state for lichessId
                    className="border rounded w-full mb-4 p-2 bg-transparent text-white"
                />
                <button className="mt-4 py-2 px-4 bg-[#00BF63] text-white rounded transition-all duration-300 ease-in-out">
                    Submit Stake
                </button>
            </form>
            {stakeSubmitted && (
                <p className="mt-2 text-green-500">
                    Stake submitted! View the game <a href={matchLink} target="_blank" rel="noopener noreferrer" className="underline">here</a>.
                </p>
            )}
            <button onClick={closeModals} className="mt-4 text-red-500">Close</button>
        </div>
    </div>
)}


{isCreateModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#1e1e1e] rounded-lg p-6 w-96">
            <h2 className="text-xl mb-4">Create a New Stake</h2>
            <form onSubmit={createStake}>
                <input
                    type="text"
                    placeholder="Game Link"
                    value={newStake.gameName}
                    onChange={(e) => setNewStake({ ...newStake, gameName: e.target.value })}
                    className="border rounded w-full mb-4 p-2 bg-transparent"
                />
                <input
                    type="text"  // Changed from 'number' to 'text'
                    placeholder="Stake Amount"
                    value={newStake.stakeAmount}
                    onChange={(e:any) => setNewStake({ ...newStake, stakeAmount: e.target.value })}  // Change to handle text input
                    className="border rounded w-full mb-4 p-2 bg-transparent"
                />
                <input
                    type="text"  // Add input for Lichess ID
                    placeholder="Lichess ID"
                    value={newStake.lichessid}
                    onChange={(e:any) => setNewStake({ ...newStake, lichessid: e.target.value })}  // Handle Lichess ID input
                    className="border rounded w-full mb-4 p-2 bg-transparent"
                />
                <input
                    type="text"  // Add input for description
                    placeholder="Description"
                    value={newStake.description}  // Ensure this is part of your state
                    onChange={(e:any) => setNewStake({ ...newStake, description: e.target.value })}  // Handle description input
                    className="border rounded w-full mb-4 p-2 bg-transparent"
                />
                <button className="mt-4 py-2 px-4 bg-[#00BF63] text-white rounded transition-all duration-300 ease-in-out transform hover:scale-105">
                    Create Stake
                </button>
            </form>
            <button onClick={closeModals} className="mt-4 text-red-500">Close</button>
        </div>
    </div>
)}


        </>
    );
}
