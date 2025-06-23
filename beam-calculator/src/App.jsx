import { useState } from "react";
import "./App.css";
import Loads from "./components/loads/Loads";
import Members from "./components/members/Members";
import Supports from "./components/supports/Supports";
import BeamDiagram from "./components/diagram/BeamDiagram";
import CalculationResult from "./components/calculations/CalculationResult";

function App() {
  const [beamLength, setBeamLength] = useState("");
  const [loadValue, setLoadValue] = useState("");
  const [placeSupport, setPlaceSupport] = useState(false);
  const [position, setPosition] = useState("");
  const [supportsList, setSupportsList] = useState([]);
  const [loadList, setLoadList] = useState([]);
  const [loadPosition, setLoadPosition] = useState("");
  const [placeLoad, setPlaceLoad] = useState(false);
  const [loadLength, setLoadLength] = useState("");
  const [drawBeam, setDrawBeam] = useState(false);
  const [shearForce, setShearForce] = useState(false);

  const totalLoad = loadList.reduce(
    (acc, load) => acc + Number(load.loadValue),
    0
  );

  function momentCalculation() {
    const v = totalLoad / 2;
    const M = (totalLoad * beamLength) / 8;
    console.log("Shear force", v);
    console.log("moment", M);
    setShearForce(true);
    return { v, M };
    setBeamLength("");
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
          beamLength={beamLength}
          setBeamLength={setBeamLength}
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
          beamLength={beamLength}
        />
        <Members
          beamLength={beamLength}
          setBeamLength={setBeamLength}
          setDrawBeam={setDrawBeam}
        />
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
          beamLength={beamLength}
          drawBeam={drawBeam}
        />
      </div>
      {shearForce === true && (
        <CalculationResult
          loadList={loadList}
          supportsList={supportsList}
          beamLength={beamLength}
        />
      )}
    </div>
  );
}

export default App;
