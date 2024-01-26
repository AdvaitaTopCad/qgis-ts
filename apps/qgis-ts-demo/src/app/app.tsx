import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QgisStandardApp } from '@qgis-ts/ui-emotion';
import { IntlProvider } from 'react-intl';

const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    height: "100vh",
                    width: "100vw",
                    padding: "0px !important",
                    margin: "0px !important",
                    overflow: "hidden",
                },
                html: {
                    boxSizing: "border-box",
                }
            }
        }
    }
});

export function App() {
    return (
        <IntlProvider locale="en">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <QgisStandardApp
                    initialView={{
                        center: [0, 0],
                        zoom: 2,
                    }}
                />
            </ThemeProvider>
        </IntlProvider>
    );
}

export default App;
