import { useState } from "react";

export default function Members({ beamLength, setBeamLength, setDrawBeam }) {
  const [beamForm, setBeamForm] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    setBeamLength(beamLength);
    setBeamForm(false);
    setDrawBeam(true);
    console.log(beamLength);
  }
  return (
    <div className="relative">
      <div>
        <h2 className="text-[#444242] text-[1.25rem]">Members</h2>
        <img
          onClick={() => setBeamForm(!beamForm)}
          className="h-8 cursor-pointer"
          src="/images/beam-icon.svg"
          alt=""
        />
      </div>
      {beamForm === true && (
        <form className="absolute" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              onChange={(e) => setBeamLength(e.target.value)}
              className="py-2 px-4 border-2 border-[#444242] outline-none rounded-lg"
              type="text"
              value={beamLength}
              name="beam length"
            />
            <span className="absolute top-2 right-2 font-bold">M</span>
          </div>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => setBeamForm(false)}
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
