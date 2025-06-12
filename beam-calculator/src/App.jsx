import "./App.css";
import Loads from "./components/loads/Loads";
import Members from "./components/members/Members";
import Supports from "./components/supports/Supports";

function App() {
  return (
    <div className="App">
      <h1 className="text-4xl font-bold">Beam Calculator</h1>
      <div className="flex items-center justify-center mt-10 space-x-10 bg-[#707083] p-4">
        <Supports />
        <Loads />
        <Members />
      </div>
    </div>
  );
}

export default App;
