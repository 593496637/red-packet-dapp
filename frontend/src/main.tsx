import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- Wagmi 配置 ---
import { WagmiProvider } from "wagmi";
import { config as wagmiConfig } from "./wagmi"; // 我们将 wagmi 配置移到了一个单独的文件
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// --- Apollo Client 配置 ---
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// 使用你自己的 Subgraph Query URL
const subgraphUri =
  "https://api.studio.thegraph.com/query/119458/red-packet-dapp/version/latest";

const apolloClient = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});
// --- Apollo Client 配置结束 ---

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
