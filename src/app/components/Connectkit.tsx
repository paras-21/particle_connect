"use client";

import { ConnectKitProvider, createConfig } from "@particle-network/connectkit";
import { authWalletConnectors } from "@particle-network/connectkit/auth";
import {
  avalancheFuji,
  baseSepolia,
  mainnet,
  sepolia,
  solana,
} from "@particle-network/connectkit/chains";
import { evmWalletConnectors } from "@particle-network/connectkit/evm";
import {
  injected as solaInjected,
  solanaWalletConnectors,
} from "@particle-network/connectkit/solana";
import { wallet, EntryPosition } from "@particle-network/connectkit/wallet";

import React from "react";

const config = createConfig({
  projectId: "277b3a4d-88be-40b1-a173-0e0a74cf0450",
  clientKey: "chbbTTPujluxLQmPtNIdakKZYVxggnSnKESQeMqy",
  appId: "85f3f8e2-119d-4a2e-afc6-ba3b37ed936b",
  appearance: {
    // optional, define wallet label and sort wallets.
    recommendedWallets: [
      { walletId: "walletConnect", label: "Recommended" },
      { walletId: "coinbaseWallet", label: "popular" },
    ],
    splitEmailAndPhone: false,
    collapseWalletList: false,
    hideContinueButton: true,
    //  optional, sort wallet connectors
    connectorsOrder: ["email", "phone", "social", "wallet"],
    language: "en-US",
    mode: "auto", // dark or auto.
    logo: "/logo.png",
    filterCountryCallingCode: (countries) => {
      // set only support USA, default support all country code.
      return countries.filter((item) => item === "IT");
    },
  },
  walletConnectors: [
    evmWalletConnectors({
      metadata: { name: "Connect 2.0", icon: "", description: "", url: "" }, 
      walletConnectProjectId:"440180bdf9d0170c17d6fda0c8ec9ffe", 
    }),
    authWalletConnectors({
  
      authTypes: ["email", "google", "apple", "twitter", "github"],
      fiatCoin: "USD",
      promptSettingConfig: {
        promptMasterPasswordSettingWhenLogin: 1, // optional
        promptPaymentPasswordSettingWhenSign: 1, // optional
      },
    }),
  ],
  plugins: [
    wallet({
      entryPosition: EntryPosition.TR,
      visible: true,
    }), // optional, embedded wallet, support solana and evm chains.
  ],
  chains: [sepolia, baseSepolia, avalancheFuji],
});

// Wrap your application with this component.
export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
