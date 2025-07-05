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
      ? (Number(load.loadValue) * Number(load.length)) / 10 // Convert UDL to point load
      : Number(load.loadValue); // Point load stays same

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
    totalDownwardForces += forces; // Accumulate the total forces across beam
  });

  const forces = [];
  let currentShear = 0;
  const shearValues = [];

  // Downward loads (negative)
  loadList.forEach((load) => {
    const inputPosition = Number((load.position / 100) * beamLength);
    const isUDL = load.src === "/images/udl.svg";
    const start = inputPosition;
    const end = inputPosition + Number(load.length) / 10;
    const udlMagnitude = Number(load.loadValue);
    const totalLoad = (udlMagnitude * Number(load.length)) / 10;

    if (isUDL) {
      forces.push({
        position: start,
        value: 0, // No jump at start of UDL
        type: "load",
        isPointLoad: false,
      });

      // End of UDL – apply full load here as a drop
      forces.push({
        position: end,
        value: -totalLoad,
        type: "load",
        isPointLoad: false,
      });

      forces.push({
        position: end,
        shear: currentShear.toFixed(2),
        isPointLoad: true,
      });
    } else {
      // Normal point load
      forces.push({
        position: inputPosition,
        value: -udlMagnitude,
        type: "load",
        isPointLoad: true,
      });
    }
    console.log(currentShear);
  });

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
      value: reactionForce, // Positive forces at supports
      type: "support",
      isPointLoad: true,
    });
  });

  forces.sort((a, b) => a.position - b.position); // Where i need to fix for fixed supports

  forces.forEach((force) => {
    const { position, value, isPointLoad } = force;

    if (!isPointLoad) {
      // UDL start (value is 0)
      shearValues.push({
        position: 2.5 + 0.001, // Test logic here
        shear: currentShear.toFixed(2),
        isPointLoad: false,
      });
      console.log(currentShear);
      currentShear += value;

      shearValues.push({
        position,
        shear: currentShear.toFixed(2),
        isPointLoad: false,
      });
    } else {
      const prevShear = currentShear;
      console.log(prevShear);
      // Point load
      currentShear += value;
      console.log(currentShear);
      if (force.type === "support") {
        shearValues.push({
          position,
          shear: prevShear.toFixed(2),
          isPointLoad: true,
        });
      }
      shearValues.push({
        position,
        shear: currentShear.toFixed(2),
        isPointLoad: true,
      });
    }
  });

  forces.forEach((force) => {
    currentShear += force.value;
    shearValues.push({
      position: force.position,
      shear: currentShear.toFixed(2),
      isPointLoad: force.isPointLoad,
    });
  });
  console.log(shearValues);

  const pointLoadData = shearValues
    .filter((p) => p.isPointLoad)
    .map(({ position, shear }) => ({ x: position, y: parseFloat(shear) }));

  const udlData = shearValues
    .filter((p) => !p.isPointLoad)
    .map(({ position, shear }) => ({ x: position, y: parseFloat(shear) }));

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Shear Force (kN)",
            data: pointLoadData,
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
          {
            label: "UDL",
            data: udlData,
            borderColor: "#3b82f6",
            borderWidth: 3,
            stepped: false, // Sloped lines for UDL
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
