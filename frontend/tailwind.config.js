/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 微信红包主题色系
        'wechat': {
          // 微信红包经典红色
          red: {
            50: '#fef7f7',
            100: '#feeaea',
            200: '#fccaca',
            300: '#f99999',
            400: '#f56565',
            500: '#FA5151', // 微信红包主色
            600: '#E93F3F', // 微信红包深色
            700: '#c53030',
            800: '#9b2c2c',
            900: '#742a2a',
          },
          // 微信金色系列
          gold: {
            50: '#fffef7',
            100: '#fffbeb',
            200: '#fef3c7',
            300: '#fde68a',
            400: '#fcd34d',
            500: '#FFD700', // 微信金色
            600: '#f59e0b',
            700: '#d97706',
            800: '#b45309',
            900: '#92400e',
          },
          // 微信背景色系
          bg: {
            primary: '#F7F7F7', // 微信主背景
            secondary: '#FFFFFF', // 卡片背景
            light: '#FAFAFA', // 浅色背景
          },
          // 微信文字色系
          text: {
            primary: '#333333', // 主要文字
            secondary: '#666666', // 次要文字
            light: '#999999', // 浅色文字
            white: '#FFFFFF', // 白色文字
          },
          // 微信边框色系
          border: {
            light: '#EEEEEE',
            normal: '#DDDDDD',
            dark: '#CCCCCC',
          }
        },
        // 保留基础颜色系统
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Arial', 'sans-serif'],
        'wechat': ['-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', '18px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '26px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
      },
      spacing: {
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },
      animation: {
        // 微信风格动画
        'wechat-bounce': 'wechat-bounce 0.6s ease-out',
        'wechat-fade': 'wechat-fade 0.3s ease-out',
        'wechat-scale': 'wechat-scale 0.2s ease-out',
        'wechat-slide': 'wechat-slide 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        'wechat-bounce': {
          '0%': { opacity: '0', transform: 'scale(0.3) translateY(50px)' },
          '50%': { opacity: '1', transform: 'scale(1.05) translateY(-5px)' },
          '70%': { transform: 'scale(0.95) translateY(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'wechat-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'wechat-scale': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'wechat-slide': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
      },
      boxShadow: {
        // 微信风格阴影
        'wechat': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'wechat-card': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'wechat-button': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'wechat-red': '0 4px 12px rgba(250, 81, 81, 0.3)',
      },
      borderRadius: {
        'wechat': '8px',
        'wechat-card': '12px',
        'wechat-button': '6px',
      },
    },
  },
  plugins: [],
}