import { createContext, useContext } from "react";

// 创建ENS刷新上下文
export const ENSRefreshContext = createContext<{
  refreshENS: () => void;
  registerRefreshFunction: (fn: () => void) => void;
}>({
  refreshENS: () => {},
  registerRefreshFunction: () => {}
});

export const useENSRefresh = () => useContext(ENSRefreshContext);
