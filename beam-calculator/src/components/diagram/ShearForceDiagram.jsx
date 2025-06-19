import { Chart } from "chart.js";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useEffect, useRef } from "react";

defaults.maintainAspectRatio = false;
defaults.responsive = true;
function ShearForceDiagram() {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Data matching your image (values in kN)
    const data = {
      positions: [0, 1, 2, 3, 5, 6, 9], // x-axis (meters)
      shearValues: [0.8, 1.29, 0.6, 0.4, -5, -6, 0], // y-axis (kN)
    };

    new Chart(ctx, {
      type: "line",
      data: {
        labels: data.positions.map((pos) => `${pos}m`),
        datasets: [
          {
            label: "Shear Force (kN)",
            data: data.shearValues,
            borderColor: "#3b82f6",
            borderWidth: 3,
            stepped: "before", // Critical for correct steps
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: "Position (m)" },
            grid: { color: "rgba(0,0,0,0.1)" },
          },
          y: {
            title: { display: true, text: "Shear Force (kN)" },
            min: -7,
            max: 2,
            grid: { color: "rgba(0,0,0,0.1)" },
            ticks: {
              callback: (val) => `${val} kN`,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} kN at ${ctx.label}`,
            },
          },
        },
      },
    });
  }, []);

  return <canvas ref={chartRef} className="w-full h-64" />;
}
// export default function ShearForceDiagram({
//   supportsList,
//   loadList,
//   beamLength,
// }) {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     // 1. Calculate shear points
//     const points = calculateShearPoints(supportsList, loadList, beamLength);

//     // 2. Create chart
//     const ctx = chartRef.current.getContext("2d");
//     const chart = new Chart(ctx, {
//       type: "line",
//       data: {
//         labels: points.map((p) => `${p.x}m`),
//         datasets: [
//           {
//             label: "Shear Force",
//             data: points.map((p) => p.y),
//             borderColor: "#3b82f6",
//             borderWidth: 2,
//             tension: 0, // Critical for angular SFD!
//             fill: {
//               target: "origin",
//               above: "rgba(59, 130, 246, 0.1)",
//               below: "rgba(239, 68, 68, 0.1)",
//             },
//           },
//         ],
//       },
//       options: {
//         scales: {
//           x: { title: { display: true, text: "Beam Length (m)" } },
//           y: {
//             title: { display: true, text: "Shear Force (kN)" },
//             beginAtZero: false,
//           },
//         },
//         plugins: {
//           tooltip: {
//             callbacks: {
//               label: (ctx) => `${ctx.parsed.y} kN at ${ctx.label}`,
//             },
//           },
//         },
//       },
//     });

//     return () => chart.destroy();
//   }, []);

//   return <canvas ref={chartRef} />;
// }

// // Helper function
// function calculateShearPoints(supports, loads, length) {
//   const points = [{ x: 0, y: 0 }];
//   let currentShear = 0;

//   // Add reactions (jumps up)
//   supports.forEach((support, i) => {
//     const reactionForce =
//       i === 0 ? 38.33 : i === support.length - 1 ? 11.67 : 0;
//     // const reaction = i === 0 ? totalLoad / 2 : totalLoad / 2;
//     currentShear += reactionForce;
//     points.push({
//       x: (support.position / 100) * length,
//       y: currentShear,
//     });
//   });

//   // Add loads (steps down)
//   loads.forEach((load) => {
//     currentShear -= load.loadValue;
//     points.push({
//       x: (load.position / 100) * length,
//       y: currentShear,
//     });
//   });

//   // End at zero
//   points.push({ x: length, y: 0 });
//   return points.sort((a, b) => a.x - b.x); // Ensure ordered by position
// }
