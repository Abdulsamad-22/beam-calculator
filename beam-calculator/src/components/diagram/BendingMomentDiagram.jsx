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

  const loadPositions = loadList.map((load) =>
    Math.round((load.position / 100) * beamLength)
  );

  const supportPositions = supportsList.map((support) =>
    Math.round((support.position / 100) * beamLength)
  );

  const allPositions = Array.from(
    new Set([...loadPositions, ...supportPositions])
  );

  const sortedPositions = allPositions.sort((a, b) => a - b);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const shearData = {
      positions: sortedPositions, // meters
      values: [0, -90, -40, 0], // kN-m
    };

    const momentData = {
      positions: shearData.positions,
      values: [0],
    };

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: shearData.positions,
        datasets: [
          {
            label: "Bending Moment (kN·m)",
            data: shearData.values,
            borderColor: "#10b981",
            borderWidth: 3,
            tension: 0.1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: "Position (m)" },
          },
          y: {
            title: { display: true, text: "Moment (kN·m)" },
            grid: {
              color: (ctx) => (ctx.tick.value === 0 ? "#000000" : "#fff"),
              lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
            },
            beginAtZero: false,
          },
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
// export default function BendingMomentDiagram({
//   beamLength,
//   supportsList,
//   loadList,
// }) {
//   const totalLoad = loadList.reduce(
//     (acc, load) => acc + Number(load.loadValue),
//     0
//   );

//   const lastSupportPosition = supportsList[supportsList.length - 1]?.position;
//   const supportLength = (lastSupportPosition / 100) * beamLength;

//   const firstSupportPosition = supportsList[0]?.position;
//   const firstSupportDistance = (firstSupportPosition / 100) * beamLength;
//   const lastSupportDistance = supportLength - firstSupportDistance;
//   let totalDownwardForces = 0;

//   const downWardForce = loadList.map((load, index) => {
//     const inputPosition = Math.round((load.position / 100) * beamLength);
//     const distanceFromLoad = supportLength - inputPosition;
//     const forces = Number(load.loadValue) * distanceFromLoad;
//     totalDownwardForces += forces; // Accumulate the total
//   });

//   //   supportsList.forEach((support, index) => {
//   //     const inputPosition = Math.round((support.position / 100) * beamLength);
//   //

//   //     const reactionForce =
//   //       index === 0
//   //         ? reactionMoment
//   //         : index === supportsList.length - 1
//   //         ? endMoment
//   //         : 0;

//   //     forces.push({
//   //       position: inputPosition,
//   //       value: reactionForce, // positive forces
//   //       type: "support",
//   //     });
//   //   });
//   const momentPoints = [];
//   let currentMoment = 0;
//   let lastPosition = 0;
//   const forces = [];
//   // Downward loads (negative)
//   loadList.forEach((load) => {
//     const inputPosition = Math.round((load.position / 100) * beamLength);
//     forces.push({
//       position: inputPosition,
//       value: -Number(load.loadValue), // negative forces
//       type: "load",
//     });
//   });

//   // Support reactions (positive)
//   supportsList.forEach((support, index) => {
//     const inputPosition = Math.round((support.position / 100) * beamLength);
//     const reactionMoment = totalDownwardForces / lastSupportDistance;
//     const endMoment = totalLoad - reactionMoment;

//     const reactionForce =
//       index === 0
//         ? reactionMoment
//         : index === supportsList.length - 1
//         ? endMoment
//         : 0;

//     forces.push({
//       position: inputPosition,
//       value: reactionForce, // positive forces
//       type: "support",
//     });
//   });

//   // Sort the events from left to right
//   const sortedEvents = forces.sort((a, b) => a.position - b.position);

//   // Calculate moment at each event position
//   sortedEvents.forEach((event) => {
//     const dx = forces.position - lastPosition;
//     currentMoment += momentPoints.find((p) => p.x === lastPosition)?.y * dx;
//     momentPoints.push({ x: event.position, y: currentMoment });
//     lastPosition = forces.position;
//   });
//   const data = {
//   positions: [0, 0, 3, 9, 11], // Add duplicate 0 position
//   shearValues: [0, -30, 8.33, 20, 0] // Start at 0, then immediate drop
// }

//   const momentChartData = {
//     datasets: [
//       {
//         label: "Bending Moment (kNm)",
//         data:data.positions,
//         borderColor: "#f59e0b",
//         backgroundColor: "rgba(245, 158, 11, 0.2)",
//         tension: 0.1,
//         fill: false,
//       },
//     ],
//   };

//   const momentChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: true },
//       tooltip: {
//         callbacks: {
//           label: (ctx) =>
//             `Moment: ${ctx.parsed.y.toFixed(2)} kNm at ${ctx.parsed.x} m`,
//         },
//       },
//     },
//     scales: {
//       x: {
//         type: "linear",
//         title: {
//           display: true,
//           text: "Position (m)",
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Bending Moment (kNm)",
//         },
//       },
//     },
//   };
//   return (
//     <div className="w-[800px]">
//       <Line
//         width="700px"
//         height="300px"
//         data={momentChartData}
//         options={momentChartOptions}
//       />
//     </div>
//   );
// }
