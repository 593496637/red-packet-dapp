# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack decentralized red packet (hongbao) system built on Ethereum. It allows users to create and distribute ETH red packets with random or even distribution modes. The system includes:

- **Smart Contract**: `RedPacketSystem.sol` deployed on Sepolia testnet at `0x4e659F1DB6E5475800A6E8d12F0f6dd25c65960f`
- **Frontend**: React + TypeScript + Vite application with Web3 integration
- **Subgraph**: The Graph protocol indexer for efficient blockchain data querying

## Architecture

### Smart Contract (`/contracts`)
- **RedPacketSystem.sol**: Main contract handling red packet creation, claiming, and withdrawal
- Uses Hardhat 3 with native Node.js test runner and `viem` library
- Deployed on Sepolia testnet with verification on Etherscan
- Supports both random and even distribution modes
- Includes 24-hour expiration mechanism for unclaimed funds

### Frontend (`/frontend`)
- React 19 with TypeScript and Vite
- Web3 integration via `wagmi` v2 and `viem` v2
- Apollo Client for GraphQL queries to The Graph
- React Query for state management
- **Multi-network support**: 8 networks including mainnet, testnets, and Layer 2s
- **Primary network**: Sepolia testnet for red packet functionality
- **UI Design**: Compact red packet-themed interface with modern card layouts
- **Components**: Optimized CreateRedPacket and Modal components with tight spacing
- **Network Switcher**: Intuitive network selection with visual indicators and recommendations
- **Styling**: Tailwind CSS with custom red packet color scheme and compact form controls

### Subgraph (`/subgraph`)
- Indexes smart contract events on Sepolia network
- Tracks `PacketCreated` and `PacketClaimed` events
- Provides GraphQL API for efficient data querying

## Development Commands

### Frontend
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Contracts
```bash
cd contracts
npx hardhat test                    # Run all tests
npx hardhat test solidity          # Run Solidity tests only  
npx hardhat test nodejs            # Run Node.js tests only
npx hardhat ignition deploy ignition/modules/Counter.ts  # Deploy to local chain
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts  # Deploy to Sepolia
```

### Subgraph
```bash
cd subgraph
npm run codegen    # Generate types from schema
npm run build      # Build subgraph
npm run deploy     # Deploy to The Graph Studio
npm run test       # Run subgraph tests
```

## Network Configuration

The project supports **multiple networks** but contracts are deployed on **Sepolia testnet**:
- **Primary Network**: Sepolia Testnet (推荐)
- Contract address: `0x4e659F1DB6E5475800A6E8d12F0f6dd25c65960f`
- Subgraph deployed on The Graph network for Sepolia

### Supported Networks
- **Ethereum Mainnet** 🌐 - Main Ethereum network (ENS support)
- **Sepolia Testnet** 🔧 - **Recommended** for red packet testing
- **Goerli Testnet** 🧪 - Ethereum test network  
- **Holesky Testnet** 🎯 - New Ethereum test network
- **Polygon** 💜 - MATIC network
- **BSC** 🟡 - Binance Smart Chain (BNB)
- **Arbitrum One** 🔵 - Ethereum Layer 2
- **Optimism** 🔴 - Ethereum Layer 2

**Note**: Red packet contracts are only deployed on Sepolia. Other networks are available for wallet connectivity and future expansion.

## Key Contract Features

- **createRedPacket(message, count, isEven)**: Creates red packets with ETH
- **claimRedPacket(packetId)**: Claims individual red packets
- **withdraw(packetId)**: Allows creator to withdraw unclaimed funds after 24 hours
- Events: `PacketCreated`, `PacketClaimed`, `PacketEmpty`, `AlreadyClaimed`, `FundsWithdrawn`

## Testing Strategy

- Contracts: Foundry-compatible Solidity tests + TypeScript integration tests with `node:test`
- Frontend: Standard React testing patterns (no specific test framework configured)
- Subgraph: Matchstick testing framework

## Package Management

- Frontend: Uses npm
- Contracts: Uses npm with Hardhat 3 beta
- Subgraph: Uses npm with The Graph CLI

## UI/UX Design Principles

### Component Design
- **CreateRedPacket.tsx**: Compact single-screen red packet creation form
  - Red gradient header with festive emoji and messaging
  - Tight 12px spacing between form sections
  - Input heights reduced to 36px (h-9) for compactness  
  - Form validation with inline error states
  - Real-time preview calculations with validity checks
  - Auto-refresh list after successful claim transactions

- **Modal.tsx**: Minimalist overlay component
  - Backdrop blur with 50% opacity
  - Centered layout with responsive max-widths
  - Close button support (in header or floating)
  - Smooth transitions and proper focus management

- **NetworkSwitcher.tsx**: Multi-network selection component
  - Hierarchical display: Recommended (Sepolia) vs Other networks
  - Visual network indicators with unique colors and emoji icons
  - Smart status: Green for recommended network, neutral for others
  - Comprehensive network support: Mainnet, testnets, and Layer 2s
  - Clear messaging about contract deployment location

- **RedPacketCard.tsx**: Interactive red packet display
  - Glassmorphism design with backdrop blur effects
  - Automatic list refresh after claim success
  - Dynamic progress indicators and claim status
  - ENS name and avatar integration

### Design System
- **Color Scheme**: Red gradients for red packet theme (red-500 to red-600)
- **Network Colors**: Unique color coding for different networks
  - Sepolia: Purple (bg-purple-500) 🔧
  - Mainnet: Blue (bg-blue-500) 🌐  
  - Polygon: Purple-600 (bg-purple-600) 💜
  - BSC: Yellow (bg-yellow-400) 🟡
  - Arbitrum: Blue-600 (bg-blue-600) 🔵
  - Optimism: Red (bg-red-500) 🔴
- **Typography**: Compact text sizes (text-sm, text-xs) with proper hierarchy
- **Spacing**: Reduced margins/padding for single-screen layouts
- **Forms**: Gray backgrounds (bg-gray-50) with white focus states
- **Animations**: Subtle hover/click effects without excessive motion
- **Network UI**: Hierarchical grouping with visual status indicators

## Important Notes

- All monetary values are in Wei (ETH base unit)
- Red packets must have at least 1 wei per packet (0.0001 ETH minimum per share)
- Random distribution uses pseudo-random generation (not cryptographically secure)
- System supports Chinese characters for blessing messages
- Contract includes comprehensive event logging for frontend integration
- **UI is optimized for single-screen display without scrolling**
- Form components use compact layouts with reduced spacing and control heights

### Network & Performance
- **Multi-network UI** with 8 supported networks but contracts only on Sepolia
- **ENS resolution** via Ethereum Mainnet (5-minute cache, reduced polling)
- **Automatic refresh** of red packet list after claim transactions  
- **Optimized RPC usage** with 30-second polling intervals
- **Smart caching** for ENS names and avatars to reduce network requests
- Users can switch networks but red packet functionality requires Sepolia connection