"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { formatBalance, truncateAddress, copyToClipboard } from "./utils/utils";


import {
  ConnectButton,
  useAccount,
  useDisconnect,
  usePublicClient,
  useParticleAuth,
  useWallets,
  useModal,
} from "@particle-network/connectkit";

export default function Home() {

  const {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    chainId,
    connector,
    status,
    chain,
  } = useAccount();
  const { disconnect, disconnectAsync } = useDisconnect();
  const { getUserInfo } = useParticleAuth();

  const [primaryWallet] = useWallets();


  const [account, setAccount] = useState(null);
  const [userAddress, setUserAddress] = useState<string>("")
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(false);
  const [userInfoError, setUserInfoError] = useState<string | null>(null);


  // Connection status message based on the account's connection state
  const connectionStatus = isConnecting
    ? "Connecting..."
    : isConnected
    ? "Connected"
    : isDisconnected
    ? "Disconnected"
    : "Unknown";

  useEffect(() => {
    async function loadAccount() {
      if (address) {
        setAccount(account);
        setUserAddress(address)
      }
    }
    loadAccount();
  }, [chainId, address]);

  // Fetch and set user information when connected
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoadingUserInfo(true);
      setUserInfoError(null);

      if (primaryWallet?.connector?.walletConnectorType === "particleAuth") {
        try {
          const userInfo = getUserInfo();
          setUserInfo(userInfo);
          console.log("userInfo ", userInfo);
        } catch (error) {
          console.log("getUserInfo error: ", error);
        } finally {
          setIsLoadingUserInfo(false);
        }
      } else {
        setIsLoadingUserInfo(false); // Ensure to stop loading if connector type doesn't match
      }
    };

    if (status === "connected") {
      fetchUserInfo();
    }
  }, [status, primaryWallet, getUserInfo]); // Added connector and getUserInfo to the dependency array



  // Handle user disconnect action
  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

 

  



  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-black text-white">
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm mx-auto mb-4">
          <h2 className="text-md font-semibold text-white">
            Status: {connectionStatus}
          </h2>
        </div>

        {isConnected ? (
          <>
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="border border-purple-500 p-6 rounded-lg">
                  <ConnectButton />
                  {isLoadingUserInfo ? (
                    <div>Loading user info...</div>
                  ) : userInfoError ? (
                    <div className="text-red-500">{userInfoError}</div>
                  ) : (
                    userInfo && ( // Conditionally render user info
                      <div className="flex items-center">
                        <h2 className="text-lg font-semibold text-white mr-2">
                          Name: {userInfo.name || "N/A"}
                        </h2>
                        {userInfo.avatar && (
                          <img
                            src={userInfo.avatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                      </div>
                    )
                  )}
                  <h2 className="text-lg font-semibold mb-2 text-white flex items-center">
                    Address: <code>{truncateAddress(userAddress)}</code>
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 ml-2 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center"
                      onClick={() => copyToClipboard(userAddress)}
                    >
                      📋
                    </button>
                  </h2>
                  {userInfo && userInfo.email && isConnected && (
                    <h2 className="text-lg font-semibold text-white mr-2">
                      Email: {userInfo.email || "N/A"}
                    </h2>
                  )}

              
        
                  <div>
                    <button
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          <ConnectButton label="Login" />
        )}
 
      </main>
      <ToastContainer /> {/* This is the copy notification */}
    </div>
  );
}
