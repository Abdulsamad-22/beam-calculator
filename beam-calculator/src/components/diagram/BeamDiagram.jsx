export default function BeamDiagram({
  position,
  sePlaceSupport,
  placeSupport,
  supportsList,
  loadList,
  loadPosition,
  placeLoad,
}) {
  console.log(position);
  const totalLoad = loadList.reduce((acc, load) => acc + load.loadValue, 0);
  console.log(totalLoad);
  return (
    <div className="relative w-[50%]">
      <hr className="border-2 border-[#c4c4c4] rounded-lg mt-4 " />
      {loadList.map((load, index) => (
        <div className="">
          <span
            style={{ left: `${load.position}%` }}
            className="text-[1.25rem] absolute -top-14 -ml-[12px]"
          >
            {load.loadValue}kN
          </span>
          <img
            key={index}
            style={{ left: `${load.position}%` }}
            className=" absolute -top-7 -ml-[12px] "
            src={load.pointLoad}
            alt=""
          />
        </div>
      ))}

      {/* {placeLoad === true && (
        <span
          style={{ left: `${loadPosition}%` }}
          className="text-3xl cursor-pointer absolute -top-3 -ml-[8px]"
        >
          &#x25BC
        </span>

        <img
          className="h-10 w-20 absolute -top-6 -ml-[8px]"
          src="/images/Point-load.svg"
          alt=""
        />
      )} */}

      {supportsList.map((item, index) => (
        <img
          key={index}
          src={item.src}
          alt=""
          style={{ left: `${item.position}%` }}
          className="absolute top-3 inset-0 -ml-[20px] h-[50px]"
        />
      ))}
      {/* {placeSupport !== false && (
        <img
          style={{ left: `${position}%` }}
          className="absolute -top-1 inset-0 -ml-[20px] h-[50px]"
          src={selectedSupport}
          alt=""
        />
      )} */}
    </div>
  );
}
