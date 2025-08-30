import { ConnectWallet } from "./components/ConnectWallet";
import { CreateRedPacket } from "./components/CreateRedPacket";
import { RedPacketList } from "./components/RedPacketList";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Toaster />

      <header
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>链上红包 DApp</h1>
        <ConnectWallet />
      </header>

      <main style={{ padding: "20px", display: "flex", gap: "40px" }}>
        <div style={{ flex: 1 }}>
          <CreateRedPacket />
        </div>
        <div style={{ flex: 2 }}>
          <RedPacketList />
        </div>
      </main>
    </div>
  );
}

export default App;
