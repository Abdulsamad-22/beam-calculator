export default function BeamDiagram({
  position,
  supportsList,
  loadList,
  beamLength,
  drawBeam,
}) {
  const indexToLabel = (index) => {
    let label = "";
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  const lastSupportPosition = supportsList[supportsList.length - 1]?.position;
  const supportLength = (lastSupportPosition / 100) * beamLength;

  loadList.map((load) => {
    const perpDistance = supportLength - (load.position / 100) * beamLength;
    const loads = load.loadValue;
    const inputPosition = Math.round((load.position / 100) * beamLength);
    const distanceFromLoad = supportLength - inputPosition;
    const moment = load.loadValue * distanceFromLoad;
    console.log(`
      Loads: ${loads}, perpendiculatD: ${distanceFromLoad}, position input ${inputPosition} moment ${moment}`);
  });

  supportsList.map((item, index) => {
    const label = indexToLabel(index);

    const inputPosition = Math.round((item.position / 100) * beamLength);
    const distanceFromEnd = beamLength - inputPosition;
    const distanceFromLastSupport = supportLength - inputPosition;
    const reaction = label + distanceFromLastSupport;

    console.log(
      `${label}: ${item.src}, position: ${item.position}, input position: ${inputPosition}, pDistance: ${distanceFromEnd}, Reaction ${reaction} fromLastSupport: ${distanceFromLastSupport}`
    );
  });

  return (
    <div className="relative w-[50%]">
      {drawBeam === true && (
        <hr className="border-2 border-[#c4c4c4] rounded-lg mt-4 " />
      )}

      {loadList.map((load, index) => (
        <div className="flex flex-col items-center justify-center">
          <span
            className={`text-[1.25rem] absolute -top-14 -ml-[12px] ${
              load.src === "/images/udl.svg" ? "" : ""
            }`}
            style={{
              left: `${load.position}%`,
              width: load.src === "/images/udl.svg" ? `${load.length}%` : "",
            }}
          >
            {load.loadValue}kN
          </span>
          <img
            key={index}
            style={{
              left: `${load.position}%`,
              width: load.src === "/images/udl.svg" ? `${load.length}%` : "",
            }}
            className=" absolute -top-7 -ml-[12px] "
            src={load.src}
            alt=""
          />
        </div>
      ))}

      {supportsList.map((item, index) => (
        <img
          key={index}
          src={item.src}
          alt=""
          style={{
            marginLeft:
              item.src === "/images/fixed-support.svg"
                ? "-29px"
                : item.position === 100
                ? "-24px"
                : "none",
            top: item.src === "/images/fixed-support.svg" ? "-5px" : "12px",
            left: `${item.position}%`,
            transform:
              item.src === "/images/fixed-support.svg" && item.position === 100
                ? "rotate(180deg)"
                : "none",
          }}
          className="absolute top-3 inset-0 -ml-[20px] h-[50px]"
        />
      ))}
    </div>
  );
}
