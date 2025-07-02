import { useState } from "react";
import ShearForceDiagram from "../diagram/ShearForceDiagram";
import BendingMomentDiagram from "../diagram/BendingMomentDiagram";

export default function CalculationResult({
  beamLength,
  loadList,
  supportsList,
}) {
  const totalLoad = loadList.reduce((acc, load) => {
    const isUDL = load.src === "/images/udl.svg";
    const loadValue = isUDL
      ? (Number(load.loadValue) * Number(load.length)) / 10 // convert UDL to point load
      : Number(load.loadValue); // point load stays same

    return acc + loadValue;
  }, 0);

  console.log(totalLoad);
  const v = totalLoad / 2;
  const M = (totalLoad * beamLength) / 8;
  const lastSupportPosition = supportsList[supportsList.length - 1]?.position;
  const supportLength = (lastSupportPosition / 100) * beamLength;

  const firstSupportPosition = supportsList[0]?.position;
  const firstSupportDistance = (firstSupportPosition / 100) * beamLength;
  const lastSupportDistance = supportLength - firstSupportDistance;

  const indexToLabel = (index) => {
    let label = "";
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  let totalDownWardForces = 0;

  const downWardForce = loadList.map((load, index) => {
    const inputPosition = Number((load.position / 100) * beamLength);
    const distanceFromLoad = supportLength - inputPosition;
    const isUDL = load.src === "/images/udl.svg";
    const UDLPosition = (load.position + load.length) / 10;
    const UDLRxN =
      Number(load.loadValue) * Number(load.length / 10 / 2) * distanceFromLoad;
    const forces = isUDL ? UDLRxN : Number(load.loadValue) * distanceFromLoad;
    totalDownWardForces += forces; // Accumulate the total

    return {
      id: index,
      load: load.loadValue,
      position: isUDL ? UDLPosition : inputPosition,
      distance: distanceFromLoad,
      value: forces.toFixed(2),
    };
  });

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
        const inputPosition = Number((item.position / 100) * beamLength);
        const distanceFromLastSupport = supportLength - inputPosition;
        const reaction = label + distanceFromLastSupport;
        const reactionMoment = totalDownWardForces / lastSupportDistance;
        const endMoment = totalLoad - reactionMoment;

        const reactionForce =
          supportsList.length === 1
            ? totalLoad
            : index === 0
            ? reactionMoment
            : index === supportsList.length - 1
            ? endMoment
            : 0;
        return (
          <div
            key={index}
            className="support-data p-4 mb-2 bg-gray-100 rounded"
          >
            <h3 className="font-bold">Support {label}</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>Position: {inputPosition}m</li>

              <li>
                Perpendicular distance to support B:
                {distanceFromLastSupport < 0 ? 0 : distanceFromLastSupport}m
              </li>
              <li>Reaction force: {reaction} kN</li>
              <li>
                Reaction {reactionForce.toFixed(2)}
                kN
              </li>
              <li>
                Support type:
                <img src={item.src} alt="support" className="inline h-4" />
              </li>
            </ul>
          </div>
        );
      })}

      <div>
        <h3 className="font-bold mb-2">Reaction Calculations</h3>

        {/* Individual Moments */}
        <div className="mb-4">
          {downWardForce.map((m) => (
            <div key={m.id} className="grid grid-cols-3 gap-4 mb-1 text-sm">
              <div>Load at {m.position.toFixed(2)}m:</div>
              <div>Arm: {m.distance.toFixed(2)}m</div>
              <div>Moment: {m.value} kN·m</div>
              <div>Load at {m.load}kN:</div>
            </div>
          ))}
        </div>

        {/* Total Moment */}
        <div className="font-bold border-t pt-2">
          Total Moment: {totalDownWardForces.toFixed(2)} kN·m
        </div>
      </div>
      <ShearForceDiagram
        loadList={loadList}
        supportsList={supportsList}
        beamLength={beamLength}
      />
      <BendingMomentDiagram
        loadList={loadList}
        supportsList={supportsList}
        beamLength={beamLength}
      />
    </div>
  );
}
