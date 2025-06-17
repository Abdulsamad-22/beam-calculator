import { useState } from "react";
import styles from "./loads.module.css";

const loadType = ["/images/Point-load.svg", "/images/udl.svg"];
export default function Loads({
  loadValue,
  setLoadValue,
  setLoadPosition,
  loadPosition,
  setLoadList,
  setPlaceLoad,
  loadLength,
  setLoadLength,
  beam,
}) {
  const [loads, setLoads] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [udlLength, setUdlLength] = useState(false);

  const positionValue = parseFloat((Number(loadPosition) / Number(beam)) * 100);
  function handleLoad(e) {
    e.preventDefault();

    if (loadValue === "" || loadPosition === "") return;

    const newLoad = {
      src: selectedLoad,
      position: positionValue,
      length: parseFloat(loadLength * 10),
      loadValue: loadValue,
    };

    setLoadList((prev) => [...prev, newLoad]);
    setLoads(false);
    setLoadValue("");
    setLoadPosition("");
    setLoadLength("");
    setUdlLength(false);
    setPlaceLoad(true);
  }

  function handleLoading(src) {
    setLoads(!loads);
    setSelectedLoad(src);
    if (src === "/images/udl.svg") {
      setUdlLength(true);
    } else return;
  }
  return (
    <div className="relative">
      <h2 className="text-[#444242] text-[1.25rem]">Loadings</h2>

      <div className="flex items-center space-x-4">
        {loadType.map((load, index) => (
          <div
            key={index}
            onClick={() => handleLoading(load)}
            className="cursor-pointer"
          >
            <img className="h-10" src={load} alt="" />
          </div>
        ))}
      </div>

      {loads !== false && (
        <form className="absolute" onSubmit={handleLoad}>
          <div className="flex flex-col items-start relative">
            <label>Load Position</label>
            <input
              onChange={(e) => setLoadPosition(e.target.value)}
              className="bg-[#BAB8B8] rounded-lg  outline-none  py-2 px-4 "
              value={loadPosition}
              type="text"
            />
            <span className="absolute top-8 right-2 font-bold">m</span>
          </div>
          {udlLength === true && (
            <div className="flex flex-col items-start relative">
              <label>Load Length</label>
              <input
                onChange={(e) => setLoadLength(e.target.value)}
                className="bg-[#BAB8B8] rounded-lg  outline-none  py-2 px-4 "
                value={loadLength}
                type="text"
              />
              <span className="absolute top-8 right-2 font-bold">m</span>
            </div>
          )}

          <div className="flex flex-col items-start relative">
            <label>Load Magnitude</label>
            <input
              onChange={(e) => setLoadValue(e.target.value)}
              className="bg-[#BAB8B8] rounded-lg outline-none py-2 px-4 "
              value={loadValue}
              type="text"
            />
            <span className="absolute top-8 right-2 font-bold">
              {udlLength === true ? "kN/m" : "kN"}
            </span>
          </div>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => {
                setLoads(false);
                setUdlLength(false);
              }}
              className="py-2 px-4 bg-[#EB0B0B] rounded-lg text-[#fff]"
            >
              Cancel
            </button>
            <button className="py-2 px-4" type="submit">
              Ok
            </button>
          </div>
        </form>
      )}
      {/* <div className={styles.beamContainer}>
        <div className={styles.udlLoad}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.udlArrow} />
          ))}
        </div>
        <div className={styles.beam} />
        <div className={styles.loadLabel}>UDL: {loadValue} kN/m</div>
      </div> */}
    </div>
  );
}
