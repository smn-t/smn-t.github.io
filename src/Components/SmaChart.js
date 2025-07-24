import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ReferenceLine
} from "recharts";
import { useTheme } from "@mui/material/styles";

const SmaChart = ({ data }) => {
  const theme = useTheme();

  const [containerHeight, setContainerHeight] = useState(window.innerHeight * 0.75);

  const maxAbsY = Math.round(Math.max(...data.map(d => Math.abs(d.value)))) + 2; // Ensure maxAbsY is at least 1 to avoid division by zero
  const step = 2;
  const ticks = [];
  for (let i = -maxAbsY; i <= maxAbsY; i += step) {
    ticks.push(parseFloat(i.toFixed(2)));
  }

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(window.innerHeight * 0.75);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#242424",
            color: "#E0E0E0",
            padding: "10px 15px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            fontFamily: "Roboto, Arial, sans-serif",
            lineHeight: "1.5",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 500 }}>
            <span style={{ color: "#0D6EFD" }}>SMA:</span>{" "}
            {label}
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 500 }}>
            <span style={{ color: "#FFA726" }}>Value:</span>{" "}
            {payload[0].value.toFixed(2)} €
          </p>
        </div>
      );
    }
    return null;
  };


  return (
    <ResponsiveContainer width="100%" height={containerHeight}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 25, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.text.disabled}/>

        <XAxis
          type="number"
          dataKey="sma"
          domain={["dataMin", "dataMax"]}
          stroke={theme.palette.text.primary}
          dy={5}
        >
          <Label value="SMA Window Size" position="insideBottom" offset={-15} fill={theme.palette.text.primary} />
        </XAxis>
        <YAxis type="number" stroke={theme.palette.text.primary} dx={-5} domain={[-maxAbsY, maxAbsY]} ticks={ticks}>
          <Label value="SMA Value Deviation from Current Price [€]" position="insideLeft" angle={-90} offset={0} fill={theme.palette.text.primary}/>
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Line dataKey="value" dot={false} stroke={theme.palette.warning.main} />
        <ReferenceLine y={0} stroke="white" strokeDasharray="3 3" />

      </LineChart>
    </ResponsiveContainer>
  );
};

export default SmaChart;