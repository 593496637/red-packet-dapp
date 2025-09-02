import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- Wagmi 配置 ---
import { WagmiProvider } from "wagmi";
import { config as wagmiConfig } from "./wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// --- Apollo Client 配置 ---
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const queryClient = new QueryClient();

// 使用你自己的 Subgraph Query URL  
const subgraphUri =
  "https://api.studio.thegraph.com/query/119458/red-packet-dapp/version/latest";

const apolloClient = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache({
    // 简化缓存配置，避免keyFields冲突
    typePolicies: {
      RedPacket: {
        fields: {
          claims: {
            // claims字段合并策略
            merge(existing = [], incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first', // 优先使用缓存，减少请求
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: false, // 减少不必要的网络状态通知
    },
    watchQuery: {
      fetchPolicy: 'cache-first', // watchQuery也使用cache-first，进一步减少请求
      errorPolicy: 'all',
      pollInterval: 0, // 禁用自动轮询 - 关键！
      notifyOnNetworkStatusChange: false, // 减少不必要的网络状态通知
    },
  },
});

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
