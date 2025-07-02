import { Chart } from "chart.js";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ChartDataLabels);
import { useEffect, useRef } from "react";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

export default function ShearForceDiagram({
  beamLength,
  supportsList,
  loadList,
}) {
  const totalLoad = loadList.reduce((acc, load) => {
    const isUDL = load.src === "/images/udl.svg";
    const loadValue = isUDL
      ? (Number(load.loadValue) * Number(load.length)) / 10 // convert UDL to point load
      : Number(load.loadValue); // point load stays same

    return acc + loadValue;
  }, 0);

  const loadPositions = loadList.map((load) =>
    Number((load.position / 100) * beamLength)
  );
  const chartRef = useRef(null);

  const supportPositions = supportsList.map((support) =>
    Number((support.position / 100) * beamLength)
  );

  const allPositions = Array.from(
    new Set([...loadPositions, ...supportPositions])
  );

  const sortedPositions = allPositions.sort((a, b) => a - b);
  console.log(sortedPositions);

  const lastSupportPosition = supportsList[supportsList.length - 1]?.position;
  const supportLength = (lastSupportPosition / 100) * beamLength;

  const firstSupportPosition = supportsList[0]?.position;
  const firstSupportDistance = (firstSupportPosition / 100) * beamLength;
  const lastSupportDistance = supportLength - firstSupportDistance;
  let totalDownwardForces = 0;

  const downWardForce = loadList.map((load, index) => {
    const inputPosition = Number((load.position / 100) * beamLength);
    const distanceFromLoad = supportLength - inputPosition;
    const isUDL = load.src === "/images/udl.svg";
    const UDLRxN =
      Number(load.loadValue) * Number(load.length / 10 / 2) * distanceFromLoad;
    const forces = isUDL ? UDLRxN : Number(load.loadValue) * distanceFromLoad;
    totalDownwardForces += forces; // Accumulate the total
    console.log(load.length);
  });

  const forces = [];

  // Downward loads (negative)
  loadList.forEach((load) => {
    const inputPosition = Math.round((load.position / 100) * beamLength);
    const isUDL = load.src === "/images/udl.svg";
    const UDLPosition = (load.length + load.position) / 10;
    forces.push({
      position: isUDL ? UDLPosition : inputPosition,
      value: isUDL
        ? (-Number(load.loadValue) * Number(load.length)) / 10 // convert UDL to point load
        : -Number(load.loadValue),
      type: "load",
    });
  });

  console.log(forces);

  // Support reactions (positive)
  supportsList.forEach((support, index) => {
    const inputPosition = Number((support.position / 100) * beamLength);
    const reactionMoment = totalDownwardForces / lastSupportDistance;
    const endMoment = totalLoad - reactionMoment;

    const reactionForce =
      supportsList.length === 1
        ? totalLoad
        : index === 0
        ? reactionMoment
        : index === supportsList.length - 1
        ? endMoment
        : 0;

    forces.push({
      position: inputPosition,
      value: reactionForce, // positive forces
      type: "support",
    });
  });

  forces.sort((a, b) => a.position - b.position); // where i need to fix for fixed supports

  let currentShear = 0;
  const shearValues = [];

  forces.forEach((force) => {
    currentShear += force.value;
    shearValues.push({
      position: force.position,
      shear: currentShear.toFixed(2),
    });
  });
  console.log(shearValues);
  const shearPoints = shearValues.map(({ position, shear }) => ({
    x: position,
    y: shear,
  }));

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Shear Force (kN)",
            data: shearPoints,
            borderColor: "#3b82f6",
            borderWidth: 3,
            stepped: "before",
            fill: {
              target: "origin",
              above: "rgba(16, 185, 129, 0.1)", // Green area for positive
              below: "rgba(239, 68, 68, 0.1)", // Red area for negative
            },
            tension: 0,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            display: false,
            title: { display: true, text: "Position along Beam (m)" },
            grid: { color: "rgba(0,0,0,0.1)" },
          },
          y: {
            title: { display: true, text: "Shear Force (kN)" },
            grid: {
              color: (ctx) => (ctx.tick.value === 0 ? "#000000" : "#fff"),
              lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
            },
            ticks: {
              callback: (val) => `${val} kN`,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            display: false,
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} kN at ${ctx.label}`,
            },
          },
        },
        // datalabels: {
        //   display: true,
        //   color: "#000",
        //   font: {
        //     weight: "bold",
        //   },
        //   formatter: (value, context) => {
        //     return value.y.toFixed(2);
        //   },
        //   align: "top",
        // },
      },
    });
    return () => chart.destroy();
  }, [loadList, supportsList]);

  return (
    <div
      className="relative"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      <canvas ref={chartRef} width="700px" height="300px" />
    </div>
  );
}
