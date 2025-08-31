import { useENS } from "../hooks/useENS";

interface UserProfileProps {
  address: string;
  showFullAddress?: boolean;
  showAvatar?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserProfile({ 
  address, 
  showFullAddress = false, 
  showAvatar = true, 
  avatarSize = 'md',
  className = ""
}: UserProfileProps) {
  // 使用自定义Hook获取ENS信息
  const { ensName, displayName, avatarUrl, isLoading } = useENS({ address });

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    if (showFullAddress) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // 头像尺寸样式
  const avatarSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  // 文字尺寸样式
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 用户头像 */}
      {showAvatar && (
        <div className="flex-shrink-0">
          {isLoading ? (
            // 加载状态显示骨架屏
            <div className={`${avatarSizeClasses[avatarSize]} rounded-full bg-gray-200 animate-pulse border border-gray-200`} />
          ) : (
            <img 
              src={avatarUrl} 
              alt={ensName || displayName || "Avatar"}
              className={`${avatarSizeClasses[avatarSize]} rounded-full border border-gray-200`}
              onError={(e) => {
                // 如果头像加载失败，使用默认头像
                e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
              }}
            />
          )}
        </div>
      )}
      
      {/* 用户名称/地址 */}
      <div className="flex flex-col min-w-0">
        <div className={`font-medium text-gray-900 truncate ${textSizeClasses[avatarSize]}`}>
          {isLoading ? (
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          ) : (
            showFullAddress ? address : displayName
          )}
        </div>
        
        {/* 如果有ENS名称且不是显示全地址模式，显示地址作为副标题 */}
        {ensName && !showFullAddress && (
          <div className="text-xs text-gray-500 truncate">
            {formatAddress(address)}
          </div>
        )}
      </div>
    </div>
  );
}

// 简化版本，只显示名称或地址
export function UserName({ address, className = "" }: { address: string; className?: string }) {
  const { displayName, isLoading } = useENS({ address });

  if (isLoading) {
    return <div className={`h-4 bg-gray-200 rounded animate-pulse w-16 ${className}`}></div>;
  }

  return (
    <span className={`font-medium ${className}`}>
      {displayName}
    </span>
  );
}

// 只显示头像的组件
export function UserAvatar({ 
  address, 
  size = 'md', 
  className = "" 
}: { 
  address: string; 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
}) {
  const { ensName, avatarUrl, isLoading } = useENS({ address });

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={className}>
      {isLoading ? (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse border border-gray-200`} />
      ) : (
        <img 
          src={avatarUrl} 
          alt={ensName || "Avatar"}
          className={`${sizeClasses[size]} rounded-full border border-gray-200`}
          onError={(e) => {
            e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
          }}
        />
      )}
    </div>
  );
}