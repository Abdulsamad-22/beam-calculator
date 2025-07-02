import { useState } from "react";

const support = [
  "/images/fixed-support.svg",
  "/images/pimmed-support.svg",
  "/images/roller-support.svg",
];

export default function Supports({
  setPlaceSupport,
  setPosition,
  position,
  supportsList,
  setSupportsList,
  beamLength,
}) {
  const [supports, setSupports] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState("");
  const [error, setError] = useState(null);

  function handlePosition(e) {
    e.preventDefault();
    const positionValue = parseFloat(
      (Number(position) / Number(beamLength)) * 100
    );
    if (supportsList.some((item) => item.position === positionValue)) {
      setError(`A support already exists at position ${positionValue}%`);

      if (
        (selectedSupport === "/images/fixed-support.svg" && position !== 0) ||
        position !== beamLength
      ) {
        setError("Fixed support only exist at the end of the beam");
      }
      return;
    }

    if (!selectedSupport || positionValue === "") return;

    const newSupport = {
      src: selectedSupport,
      position: positionValue,
    };

    setSupportsList((prev) => [...prev, newSupport]);

    setSelectedSupport(null);
    setError(null);
    setPosition("");
    setSupports(false);
    setPlaceSupport(true);
  }

  function handleSupport(src) {
    setSupports(true);

    setPosition("");
    setSelectedSupport(src);
  }
  return (
    <div>
      <h2 className="text-[#444242] text-[1.25rem]">Supports</h2>
      <div className="flex items-center space-x-4">
        {support.map((supportSrc) => (
          <div key={supportSrc} onClick={() => handleSupport(supportSrc)}>
            <img className="h-[24px] cursor-pointer" src={supportSrc} alt="" />
          </div>
        ))}
      </div>
      {supports !== false && (
        <form className="absolute" onSubmit={handlePosition}>
          <div className="relative">
            <input
              onChange={(e) => setPosition(e.target.value)}
              className="py-2 px-4 border-2 border-[#444242] outline-none rounded-lg"
              type="text"
              name="beam length"
              value={position}
            />
            <span className="absolute top-2 right-2 font-bold">M</span>
          </div>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => {
                setSupports(!supports);
                setSelectedSupport("");
              }}
              className="py-2 px-4 bg-[#EB0B0B] rounded-lg text-[#fff]"
            >
              Cancel
            </button>
            <button className="py-2 px-4" type="submit">
              Ok
            </button>
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </form>
      )}
    </div>
  );
}
