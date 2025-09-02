import { useQuery, gql } from "@apollo/client";
import { RedPacketCard } from "./RedPacketCard";

// TypeScript interfaces
interface Claim {
  claimer: string;
  amount: string;
}

interface RedPacket {
  id: string;
  packetId: string;
  owner: string;
  message: string;
  totalAmount: string;
  totalCount: string;
  creationTime: string;
  claims: Claim[];
}

interface RedPacketData {
  redPackets: RedPacket[];
}

// 1. 定义新的、更高效的 GraphQL 查询
const GET_RED_PACKETS = gql`
  query GetRedPackets {
    redPackets(orderBy: creationTime, orderDirection: desc, first: 100) {
      id
      packetId
      owner
      message
      totalAmount
      totalCount
      creationTime
      # 直接在查询中获取关联的 claims 列表
      claims {
        claimer
        amount
      }
    }
  }
`;

export function RedPacketList() {
  // 禁用持续轮询，但允许必要的刷新
  const { loading, error, data, refetch } = useQuery<RedPacketData>(
    GET_RED_PACKETS,
    {
      fetchPolicy: 'cache-first', // 优先使用缓存
      errorPolicy: 'all',
      pollInterval: 0, // 关键：禁用自动轮询
      notifyOnNetworkStatusChange: false, // 禁用网络状态更新减少请求
      // 增加缓存时间，减少重复请求
      nextFetchPolicy: 'cache-first',
    }
  );

  // 手动刷新函数
  const handleRefresh = () => {
    refetch();
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载红包列表中...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          ❌ 加载数据出错
        </div>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          重试
        </button>
      </div>
    );
  }

  const packets = data?.redPackets || [];

  return (
    <div>
      {/* 微信风格头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="wechat-text-primary text-base font-medium mb-1">
            红包列表
          </div>
          <div className="wechat-text-secondary text-sm">
            {packets.length} 个红包
          </div>
        </div>
        
        {/* 手动刷新按钮 */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            loading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          <svg 
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          {loading ? '刷新中' : '刷新'}
        </button>
      </div>

      {/* 红包列表 - 固定高度网格 */}
      {packets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🧧</div>
          <div className="wechat-text-primary text-lg font-medium mb-2">
            还没有红包
          </div>
          <div className="wechat-text-secondary text-sm">
            快来发第一个红包吧！
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {packets.map((packet: RedPacket) => (
            <RedPacketCard 
              key={packet.id} 
              packet={packet} 
              onClaimSuccess={() => refetch()} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
