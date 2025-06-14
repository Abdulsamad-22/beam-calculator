import { useState } from "react";

const loadType = ["/images/Point-load.svg", "/images/udl.svg"];
export default function Loads({
  loadValue,
  setLoadValue,
  setLoadPosition,
  loadPosition,
  setLoadList,
  setPlaceLoad,
}) {
  const [loads, setLoads] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  function handleLoad(e) {
    e.preventDefault();
    console.log(loadPosition);

    if (loadValue === "" || loadPosition === "") return;

    const newLoad = {
      pointLoad: selectedLoad,
      position: parseFloat(loadPosition),
      loadValue: loadValue,
    };

    setLoadList((prev) => [...prev, newLoad]);
    setLoads(false);
    console.log(loadValue);
    setLoadValue("");
    setLoadPosition("");
    setPlaceLoad(true);
  }

  function handleLoading(src) {
    setLoads(!loads);
    setSelectedLoad(src);
  }
  return (
    <div className="relative">
      <h2 className="text-[#444242] text-[1.25rem]">Loading</h2>

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
            <span className="absolute top-8 right-2 font-bold">M</span>
          </div>

          <div className="flex flex-col items-start relative">
            <label>Load Magnitude</label>
            <input
              onChange={(e) => setLoadValue(e.target.value)}
              className="bg-[#BAB8B8] rounded-lg outline-none py-2 px-4 "
              value={loadValue}
              type="text"
            />
            <span className="absolute top-8 right-2 font-bold">kN</span>
          </div>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => setLoads(false)}
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
    </div>
  );
}
