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
  const totalLoad = loadList.reduce(
    (acc, load) => acc + Number(load.loadValue),
    0
  );

  const loadPositions = loadList.map((load) =>
    Math.round((load.position / 100) * beamLength)
  );
  const chartRef = useRef(null);

  const supportPositions = supportsList.map((support) =>
    Math.round((support.position / 100) * beamLength)
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
    const inputPosition = Math.round((load.position / 100) * beamLength);
    const distanceFromLoad = supportLength - inputPosition;
    const forces = Number(load.loadValue) * distanceFromLoad;
    totalDownwardForces += forces; // Accumulate the total
  });

  const forces = [];

  // Downward loads (negative)
  loadList.forEach((load) => {
    const inputPosition = Math.round((load.position / 100) * beamLength);
    forces.push({
      position: inputPosition,
      value: -Number(load.loadValue), // negative forces
      type: "load",
    });
  });

  // Support reactions (positive)
  supportsList.forEach((support, index) => {
    const inputPosition = Math.round((support.position / 100) * beamLength);
    const reactionMoment = totalDownwardForces / lastSupportDistance;
    const endMoment = totalLoad - reactionMoment;

    const reactionForce =
      index === 0
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

  forces.sort((a, b) => a.position - b.position);

  let currentShear = 0;
  const shearValues = [];

  forces.forEach((force) => {
    currentShear += force.value;
    shearValues.push({
      position: force.position,
      shear: currentShear,
    });
  });
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
            fill: false,
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
        datalabels: {
          display: true,
          color: "#000",
          font: {
            weight: "bold",
          },
          formatter: (value, context) => {
            return value.y.toFixed(2);
          },
          align: "top",
        },
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
