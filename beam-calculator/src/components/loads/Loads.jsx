import { useState } from "react";

export default function Loads() {
  const [loads, setLoads] = useState(false);
  return (
    <div className="relative">
      <h2 className="text-[#444242] text-[1.25rem]">Loading</h2>
      <span
        onClick={() => setLoads(!loads)}
        className="text-2xl cursor-pointer"
      >
        &#x25BC;
      </span>
      {loads !== false && (
        <form className="absolute">
          <div className="flex flex-col items-start relative">
            <label>Load Position</label>
            <input
              className="bg-[#BAB8B8] rounded-lg  outline-none  py-2 px-4 "
              type="text"
            />
            <span className="absolute top-8 right-2 font-bold">M</span>
          </div>

          <div className="flex flex-col items-start relative">
            <label>Load Magnitude</label>
            <input
              className="bg-[#BAB8B8] rounded-lg outline-none py-2 px-4 "
              type="text"
            />
            <span className="absolute top-8 right-2 font-bold">KN</span>
          </div>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => setLoads(false)}
              className="py-2 px-4 bg-[#EB0B0B] rounded-lg text-[#fff]"
            >
              Cancel
            </button>
            <button className="py-2 px-4">Ok</button>
          </div>
        </form>
      )}
    </div>
  );
}
