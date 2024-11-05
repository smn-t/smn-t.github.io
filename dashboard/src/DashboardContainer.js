// DashboardContainer.js
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/system/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MainDashboard from "./dashboards/MainDashboard";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const DashboardContainer = () => {

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box>
                <MainDashboard/>
            </Box>
        </ThemeProvider>
    );
};

export default DashboardContainer;