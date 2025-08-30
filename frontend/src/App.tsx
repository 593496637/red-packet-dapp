import { ConnectWallet } from './components/ConnectWallet';
import { CreateRedPacket } from './components/CreateRedPacket';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
      {/* 通知组件，放在顶层 */}
      <Toaster />

      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>链上红包 DApp</h1>
        <ConnectWallet />
      </header>
      
      <main style={{ padding: '20px' }}>
        <CreateRedPacket />
        {/* 红包列表将显示在这里 */}
        <hr style={{ margin: '20px 0' }} />
      </main>
    </div>
  )
}

export default App