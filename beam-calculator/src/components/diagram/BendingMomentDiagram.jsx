import { Chart } from "chart.js";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useRef, useEffect, useState } from "react";
export default function BendingMomentDiagram({
  supportsList,
  loadList,
  beamLength,
}) {
  const chartRef = useRef(null);

  const totalLoad = loadList.reduce(
    (acc, load) => acc + Number(load.loadValue),
    0
  );

  const lastSupportPosition = supportsList[supportsList.length - 1]?.position;

  const lastLoadPosition = loadList[loadList.length - 1]?.position;
  // console.log((lastLoadPosition / 100) * beamLength);
  const firstLoadPosition = loadList[0]?.position;
  // console.log((firstLoadPosition / 100) * beamLength);
  // console.log(
  //   (lastLoadPosition / 100) * beamLength -
  //     (firstLoadPosition / 100) * beamLength
  // );
  const supportLength = (lastSupportPosition / 100) * beamLength;

  const firstSupportPosition = supportsList[0]?.position;
  const firstSupportDistance = (firstSupportPosition / 100) * beamLength;
  const lastSupportDistance = supportLength - firstSupportDistance;
  let totalDownwardForces = 0;

  const downWardForce = loadList.map((load, index) => {
    const inputPosition = Number((load.position / 100) * beamLength);
    const distanceFromLoad = supportLength - inputPosition;
    console.log(distanceFromLoad);
    const forces = Number(load.loadValue) * distanceFromLoad;
    totalDownwardForces += forces; // Accumulate the total
  });
  const reactionMoment = totalDownwardForces / lastSupportDistance;
  const endMoment = totalLoad - reactionMoment;

  const allForces = [
    ...loadList.map((load) => ({
      position: Number((load.position / 100) * beamLength),
      value: -Number(load.loadValue),
      type: "load",
    })),
    ...supportsList.map((support, index) => ({
      position: Number((support.position / 100) * beamLength),

      value:
        supportsList.length === 1
          ? totalLoad
          : index === 0
          ? reactionMoment
          : index === supportsList.length - 1
          ? endMoment
          : 0,
      type: "support",
    })),
  ];

  const positions = Array.from(
    new Set([0, ...allForces.map((f) => Number(f.position))])
  ).sort((a, b) => a - b);
  console.log(positions);

  const forceMap = {};
  allForces.forEach((f) => {
    if (!forceMap[f.position]) {
      forceMap[f.position] = [];
    }
    forceMap[f.position].push(f);
  });

  let moment = 0;
  const momentValues = [];

  for (let i = 0; i < positions.length; i++) {
    const currentPos = positions[i];
    const nextPos = positions[i + 1];
    momentValues.push({
      position: currentPos,
      moment: moment.toFixed(2),
    });
    if (!nextPos) break;

    const activeForces = positions
      .slice(0, i + 1)
      .flatMap((pos) => forceMap[pos] || []);

    const dx = nextPos - currentPos;
    const momentThisSpan = activeForces.reduce(
      (sum, f) => sum + f.value * dx,
      0
    );
    moment += momentThisSpan;
  }
  console.log(momentValues);
  const momentPoints = momentValues.map(({ position, moment }) => ({
    x: position,
    y: moment,
  }));

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Bending Moment (kN·m)",
            data: momentPoints,
            borderColor: "#10b981",
            borderWidth: 3,
            tension: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "linear",
            display: false,
            title: { display: true, text: "Position along Beam (m)" },
          },
          y: {
            title: { display: true, text: "Moment (kN·m)" },
            grid: {
              color: (ctx) => (ctx.tick.value === 0 ? "#444242" : "#fff"),
              lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
            },
            beginAtZero: false,
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div
      className="w-[700px] mb-8"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        margin: "0 auto",
      }}
    >
      <canvas width="700px" height="300px" ref={chartRef} />
    </div>
  );
}
