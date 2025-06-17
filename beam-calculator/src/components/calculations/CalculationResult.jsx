export default function CalculationResult({ beam, loadList }) {
  const totalLoad = loadList.reduce(
    (acc, load) => acc + Number(load.loadValue),
    0
  );
  const v = totalLoad / 2;
  const M = (totalLoad * beam) / 8;
  return (
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
  );
}
