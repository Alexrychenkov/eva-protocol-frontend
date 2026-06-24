import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import {
  mainnet,
  bsc,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
  solana,
} from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import type { AppKitNetwork } from '@reown/appkit-common'

// Get projectId from https://dashboard.reown.com (formerly WalletConnect Cloud)
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694'

// NOTE: this whole file runs at MODULE LOAD (main.tsx imports it before React
// mounts). A throw here = white screen with no recovery. So: never throw at
// import time — warn instead, and wrap the side-effectful createAppKit() in
// try/catch so a wallet-init failure degrades (no modal) instead of killing
// the entire app.
if (!import.meta.env.VITE_REOWN_PROJECT_ID) {
  console.warn('[wallet] VITE_REOWN_PROJECT_ID not set — using shared fallback projectId. Set your own in .env for production.')
}

const metadata = {
  name: 'EVA',
  description: 'AI Wallet Analyzer & Trading',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://nofx.com',
  icons: ['/logo.png'],
}

const networks = [mainnet, bsc, polygon, arbitrum, optimism, base, avalanche, solana] as [AppKitNetwork, ...AppKitNetwork[]]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
})
const solanaAdapter = new SolanaAdapter()

export const queryClient = new QueryClient()

// createAppKit registers the wallet modal as a global side effect. If it throws
// (bad projectId, network, DOM API), we must NOT let it blank the app — the
// rest of the site works fine without the wallet modal.
try {
  createAppKit({
    adapters: [wagmiAdapter, solanaAdapter],
    networks,
    projectId,
    metadata,
    themeMode: 'dark',
    allowUnsupportedChain: true,
    themeVariables: {
      '--apkt-accent': '#154a4a',
      '--apkt-color-mix': '#154a4a',
      '--apkt-color-mix-strength': 40,
      '--apkt-font-family': 'Inter, sans-serif',
      '--apkt-border-radius-master': '12px',
    },
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
      'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
    ],
    includeWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
      'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
    ],
    features: {
      analytics: false,
    },
  })
} catch (err) {
  console.error('[wallet] createAppKit failed — wallet modal disabled, app continues:', err)
}

export { wagmiAdapter }
