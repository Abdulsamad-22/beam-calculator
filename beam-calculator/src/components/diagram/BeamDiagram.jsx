export default function BeamDiagram({
  selectedSupport,
  setSelectedSupport,
  position,
  sePlaceSupport,
  placeSupport,
  supportsList,
}) {
  console.log(position);
  return (
    <div className="relative w-[50%]">
      <hr className="border-2 border-[#c4c4c4] rounded-lg mt-4 " />
      {supportsList.map((item, index) => (
        <img
          key={index}
          src={item.src}
          alt=""
          style={{ left: `${item.position}%` }}
          className="absolute top-3 inset-0 -ml-[20px] h-[50px]"
        />
      ))}
      {placeSupport !== false && (
        <img
          style={{ left: `${position}%` }}
          className="absolute -top-1 inset-0 -ml-[20px] h-[50px]"
          src={selectedSupport}
          alt=""
        />
      )}
    </div>
  );
}
