'use client'
import Image from "next/image";
import { FaWallet } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function Signin() {
    // State to store the TipLink input value
    const [tipLink, setTipLink] = useState('');

    // Function to handle TipLink submission
    const handleTipLinkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Add your logic for handling the TipLink submission here
      console.log("TipLink submitted:", tipLink);
  };


    return (
        <>
            <section className="bg-gray-50 dark:bg-[#1a1818]">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-green-500">
                        <img className="w-52 h-52 mr-2" src="/images/logo.png" alt="logo" />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#1a1818] dark:border-gray-700 relative lg:top-[-60px]">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <form className="space-y-4 md:space-y-6" onSubmit={handleTipLinkSubmit}>
                                <div className="flex flex-col space-y-2">
                                    <Link
                                        href={'/dashboard'}
                                        className="w-full flex items-center justify-center bg-[#1a1818] text-white hover:text-green-700 rounded-lg px-5 py-2.5 hover:bg-white dark:border-gray-600 border"
                                    >
                                        <FaWallet className="mr-2" />
                                        Connect wallet
                                    </Link>
                                </div>
                                <p className="text-center"> - or -</p>
                                <div className="flex flex-col space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Enter your TipLink"
                                        value={tipLink}
                                        onChange={(e) => setTipLink(e.target.value)}
                                        className="mt-1 p-2 w-full rounded-md bg-[#2a2a2a] border border-[#00BF63] text-white"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center bg-[#1a1818] text-white hover:text-green-700 rounded-lg px-5 py-2.5 hover:bg-white dark:border-gray-600 border"
                                    >
                                        Submit TipLink
                                    </button>
                                </div>

                                <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                    Sign in to your account to begin the Gambit Journey
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
