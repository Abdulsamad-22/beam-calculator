import { useState } from "react";

export default function Supports() {
  const [supports, setSupports] = useState(false);
  return (
    <div>
      <h2 className="text-[#444242] text-[1.25rem]">Supports</h2>
      <div className="flex items-center space-x-4">
        <div>
          <img
            onClick={() => setSupports(!supports)}
            className="h-[40px] cursor-pointer"
            src="/images/fixed-support.svg "
            alt=""
          />
        </div>
        <div onClick={() => setSupports(!supports)}>
          <img
            className="cursor-pointer"
            src="/images/pimmed-support.svg"
            alt=""
          />
        </div>

        <div onClick={() => setSupports(!supports)}>
          <img
            className="cursor-pointer"
            src="/images/roller-support.svg"
            alt=""
          />
        </div>
      </div>
      {!supports && (
        <form className="absolute">
          <div className="relative">
            <input
              className="py-2 px-4 border-2 border-[#444242] outline-none rounded-lg"
              type="text"
              name="beam length"
            />
            <span className="absolute top-2 right-2 font-bold">M</span>
          </div>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => setSupports(!supports)}
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
