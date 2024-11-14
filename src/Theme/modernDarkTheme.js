import { createTheme } from '@mui/material/styles';


// Theme
const modernDarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#0D6EFD', // Ein klares Blau für Buttons oder interaktive Elemente
            light: '#1D9BFF', // Helles Blau für Hover-Effekte
            dark: '#0A53BF', // Dunkles Blau für aktive Zustände
        },
        secondary: {
            main: '#FF6500', // Auffälliges Orange für Highlights
            light: '#FF8533', // Helleres Orange
            dark: '#CC5200', // Dunkleres Orange
        },
        background: {
            default: '#121212', // Sehr dunkles Grau für den Hintergrund
            paper: '#242424', // Etwas helleres Grau für Karten oder Panels
        },
        text: {
            primary: '#E0E0E0', // Hellgrau für Standardtext
            secondary: '#FF6500', // Auffälliges Orange für sekundären Text
            disabled: '#757575', // Gedämpftes Grau für deaktivierten Text
        },
        error: {
            main: '#CF6679', // Rot für Fehlerhinweise
        },
        warning: {
            main: '#FFA726', // Orange für Warnungen
        },
        info: {
            main: '#29B6F6', // Helles Blau für Informationshinweise
        },
        success: {
            main: '#66BB6A', // Grün für erfolgreiche Aktionen
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif', // Moderne Schriftart
        fontSize: 14,
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
            color: '#FFFFFF',
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 500,
            color: '#FFFFFF',
        },
        body1: {
            fontSize: '1rem',
            color: '#E0E0E0',
        },
        body2: {
            fontSize: '0.875rem',
            color: '#FF6500',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Keine Großbuchstaben
                    borderRadius: 8, // Abgerundete Buttons
                    fontWeight: 500,
                },
                contained: {
                    backgroundColor: '#0D6EFD',
                    '&:hover': {
                        backgroundColor: '#1D9BFF',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#242424', // Etwas hellerer Hintergrund
                    borderRadius: 10,
                    color: '#E0E0E0',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#121212',
                    color: '#E0E0E0',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#E0E0E0',
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                track: {
                    backgroundColor: '#0D6EFD',
                },
                thumb: {
                    backgroundColor: '#FFC107',
                },
                mark: {
                    color: '#E0E0E0',
                },
                markLabel: {
                    color: '#E0E0E0',
                },
            },
        },
    },
});

export default modernDarkTheme;