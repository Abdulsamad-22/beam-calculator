import { useState } from "react";

export default function CalculationResult({ beam, loadList, supportsList }) {
  const [momentValue, setMomentValue] = useState("");
  const totalLoad = loadList.reduce(
    (acc, load) => acc + Number(load.loadValue),
    0
  );
  const v = totalLoad / 2;
  const M = (totalLoad * beam) / 8;
  const lastSupportPosition = supportsList[supportsList.length - 1]?.position;
  const supportLength = (lastSupportPosition / 100) * beam;

  const indexToLabel = (index) => {
    let label = "";
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  return (
    <div>
      <div className="flex items-center justify-center space-x-4 mt-12">
        <p>
          Total Shear Force: {v}
          <span className="text-[#4e66ff]">kN</span>
        </p>
        <p>
          Bending Moment: {M}
          <span className="text-[#4e66ff]">kN/m</span>
        </p>
      </div>
      {supportsList.map((item, index) => {
        const label = indexToLabel(index);
        const inputPosition = Math.round((item.position / 100) * beam);
        const distanceFromEnd = beam - inputPosition;
        const distanceFromLastSupport = supportLength - inputPosition;
        const reaction = label + distanceFromLastSupport;
        const ReactionMoment =
          distanceFromLastSupport === 0
            ? totalLoad
            : (totalLoad / distanceFromLastSupport).toFixed(2);
        console.log(ReactionMoment);
        return (
          <div
            key={index}
            className="support-data p-4 mb-2 bg-gray-100 rounded"
          >
            <h3 className="font-bold">Support {label}</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>Position: {inputPosition}m</li>

              <li>
                Perpendicular distance to support B: {distanceFromLastSupport}m
              </li>
              <li>Reaction force: {reaction} kN</li>
              <li>
                Total reaction
                {distanceFromLastSupport === 0
                  ? totalLoad - ReactionMoment
                  : ReactionMoment}
                kN
              </li>
              <li>
                Support type:{" "}
                <img src={item.src} alt="support" className="inline h-4" />
              </li>
            </ul>
          </div>
        );
      })}

      {loadList.map((load, index) => {
        const inputPosition = Math.round((load.position / 100) * beam);
        const distanceFromLoad = supportLength - inputPosition;
        const moment = load.loadValue * distanceFromLoad;

        return (
          <div
            className="bg-gray-100 rounded p-4"
            key={index}
            style={{ marginBottom: "1rem" }}
          >
            <p>
              <strong>Load {index + 1}</strong>
            </p>
            <p className="text-sm">Value: {load.loadValue}</p>
            <p className="text-sm">Distance from Support: {distanceFromLoad}</p>
            <p className="text-sm">Moment: {moment}kNm</p>
          </div>
        );
      })}
    </div>
  );
}
