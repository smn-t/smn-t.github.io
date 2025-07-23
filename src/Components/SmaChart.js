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
} from "recharts";
import { useTheme } from "@mui/material/styles";

const SmaChart = ({ data }) => {
  const theme = useTheme();

  const [containerHeight, setContainerHeight] = useState(window.innerHeight * 0.75);

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

  console.log("SMA Chart Data:", data);

  return (
    <ResponsiveContainer width="100%" height={containerHeight}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 25, bottom: 30 }}>
        <CartesianGrid strokeDasharray="5 5" stroke={theme.palette.text.disabled} />
        <XAxis
          type="number"
          dataKey="sma"
          domain={["dataMin", "dataMax"]}
          stroke={theme.palette.text.primary}
          dy={5}
        >
          <Label value="SMA Window Size" position="insideBottom" offset={-15} fill={theme.palette.text.primary} />
        </XAxis>
        <YAxis type="number" stroke={theme.palette.text.primary} dx={-5}>
          <Label value="Value" position="insideLeft" angle={-90} offset={0} fill={theme.palette.text.primary} />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Line dataKey="value" dot={false} stroke={theme.palette.warning.main} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SmaChart;