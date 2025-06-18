import { useState } from "react";
import "./App.css";
import Loads from "./components/loads/Loads";
import Members from "./components/members/Members";
import Supports from "./components/supports/Supports";
import BeamDiagram from "./components/diagram/BeamDiagram";
import CalculationResult from "./components/calculations/CalculationResult";

function App() {
  const [beam, setBeam] = useState("");
  const [loadValue, setLoadValue] = useState("");
  const [placeSupport, setPlaceSupport] = useState(false);
  const [position, setPosition] = useState("");
  const [supportsList, setSupportsList] = useState([]);
  const [loadList, setLoadList] = useState([]);
  const [loadPosition, setLoadPosition] = useState("");
  const [placeLoad, setPlaceLoad] = useState(false);
  const [loadLength, setLoadLength] = useState("");
  const [drawBeam, setDrawBeam] = useState(false);

  const totalLoad = loadList.reduce(
    (acc, load) => acc + Number(load.loadValue),
    0
  );

  function momentCalculation() {
    const v = totalLoad / 2;
    const M = (totalLoad * beam) / 8;
    console.log("Shear force", v);
    console.log("moment", M);
    return { v, M };
    setBeam("");
    setLoadValue("");
  }
  return (
    <div className="App">
      <h1 className="text-4xl font-bold">Beam Calculator</h1>
      <div className="flex items-center justify-center mt-10 space-x-10 bg-[#707083] p-4">
        <Supports
          supportsList={supportsList}
          setSupportsList={setSupportsList}
          setPlaceSupport={setPlaceSupport}
          position={position}
          setPosition={setPosition}
          beam={beam}
          setBeam={setBeam}
        />
        <Loads
          loadValue={loadValue}
          setLoadValue={setLoadValue}
          setLoadPosition={setLoadPosition}
          loadPosition={loadPosition}
          setLoadList={setLoadList}
          setPlaceLoad={setPlaceLoad}
          loadLength={loadLength}
          setLoadLength={setLoadLength}
          beam={beam}
        />
        <Members beam={beam} setBeam={setBeam} setDrawBeam={setDrawBeam} />
      </div>
      <button
        className="p-4 bg-[#4E66FF] text-[#fff] mt-4 rounded-lg"
        onClick={momentCalculation}
      >
        Calculate
      </button>
      <div className="flex flex-col items-center justify-center mt-10">
        <BeamDiagram
          loadList={loadList}
          supportsList={supportsList}
          position={position}
          beam={beam}
          drawBeam={drawBeam}
        />
      </div>
      <CalculationResult
        loadList={loadList}
        supportsList={supportsList}
        beam={beam}
      />
    </div>
  );
}

export default App;
