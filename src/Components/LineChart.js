import React, { useState, useEffect } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Label
} from 'recharts';
import { useTheme } from '@mui/material/styles';


const CustomLineChart = ({ data }) => {
    const theme = useTheme();

    const [containerDimensions, setContainerDimensions] = useState({
        height: window.innerHeight * 0.75,
    });

    useEffect(() => {
        const handleResize = () => {
            setContainerDimensions({
                height: window.innerHeight * 0.75,
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
                    {payload[1] && <p>{`SMA 200: ${payload[1].value.toFixed(2)} €`}</p>}
                </div >
            );
        }
        return null;
    };


    return (
        <ResponsiveContainer width="100%" height={containerDimensions.height} >
            <LineChart data={data} margin={{ top: 20, right: 30, left: 25, bottom: 30 }}>
                <CartesianGrid strokeDasharray="5 5" stroke='grey' /> */
                <XAxis type="number" dataKey="unixTimeStamp" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} stroke='white' dy={5}>
                    <Label value="Date" position="insideBottom" offset={-15} fill={'white'} />
                </XAxis>
                <YAxis type='number' stroke='white' dx={-5}>
                    <Label value="Price" position="insideLeft" angle={-90} offset={0} fill={'white'} />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="price" dot={false} stroke={theme.palette.text.secondary}/>
                <Line type="monotone" dataKey="sma" dot={false} stroke="orange" strokeDasharray="5 5" />
            </LineChart>
        </ResponsiveContainer >
    );
};

export default CustomLineChart;