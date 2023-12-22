import React, {useEffect} from 'react';
import {Box, Paper} from '@mui/material';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {Edit} from './pages/edit';
import {Vote} from "./pages/vote";
import {Bar} from "./components/bar";
import {Footer} from "./components/footer";
import {Landing} from "./pages/landing";
import {SnackbarProvider} from "notistack";
import {NotFound} from "./pages/not-found";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: '/start',
        element: <Edit />,
    },
    {
        path: '/edit/:key',
        element: <Edit />,
    },
    {
        path: '/not-found',
        element: <NotFound />,
    },
    {
        path: '/:key',
        element: <Vote />,
    },
]);

export function App() {
    const {i18n} = useTranslation();
    useEffect(() => {
        i18n.on('languageChanged', (lng) => {
            document.documentElement.lang = lng;
            dayjs.locale(lng);
        });
    }, [i18n]);

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={i18n.language}
        >
            <Box>
                <Bar />

                <Paper
                    sx={{
                        pt: 12,
                        pb: 14,
                        minHeight: '100vh',
                        position: 'relative',
                        zIndex: 99,
                        borderRadius: 0,
                    }}
                    elevation={4}
                >
                    <RouterProvider router={router} />
                </Paper>

                <Footer />

                <SnackbarProvider />
            </Box>
        </LocalizationProvider>
    );
}
