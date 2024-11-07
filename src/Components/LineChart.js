import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';
import { useTheme } from '@mui/material/styles';

const CustomLineChart = ({ data, targetWeight }) => {
    const theme = useTheme();

    const [containerDimensions, setContainerDimensions] = useState({
        height: window.innerHeight * 0.7,
    });

    useEffect(() => {
        const handleResize = () => {
            setContainerDimensions({
                height: window.innerHeight * 0.7,
            });
        };

        // Füge Event-Listener für resize-Ereignis hinzu
        window.addEventListener('resize', handleResize);

        // Entferne den Event-Listener, wenn die Komponente unmontiert wird
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ borderWidth: 2, borderStyle: "dashed", borderColor: "black", background: "grey" }}>
                    <p>{`Date: ${new Date(label).toLocaleDateString()}`}</p>
                    <p>{`Price: ${payload[0].value} €`}</p>
                </div >
            );
        }

        return null;
    };

    const lowestValue = Math.min(...data.map(item => item.weight));

    let yAxisLow;

    if (targetWeight < lowestValue) {
        yAxisLow = targetWeight - 3;
    } else {
        yAxisLow = lowestValue - 3;
    }

    console.log(yAxisLow)

    return (
        <ResponsiveContainer width="100%" height={containerDimensions.height} >
            <LineChart data={data} margin={{ top: 20, right: 30, left: 25, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke='grey' />
                <XAxis type="number" dataKey="unixTimeStamp" domain={['auto', 'auto']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} stroke='white' dy={5}>
                    <Label value="Date" position="insideBottom" offset={-15} fill={'white'} />
                </XAxis>
                <YAxis type='number' domain={[yAxisLow, 'auto']} stroke='white' dx={-5}>
                    <Label value="Price" position="insideLeft" angle={-90} offset={0} fill={'white'} />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="price" dot={false} stroke={theme.palette.text.secondary}/>
            </LineChart>
        </ResponsiveContainer >
    );
};

export default CustomLineChart;