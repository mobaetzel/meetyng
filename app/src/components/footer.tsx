import React from "react";
import {Box, Typography, useTheme} from "@mui/material";

export function Footer() {
    const theme = useTheme();
    return (
        <Box
            component="footer"
            sx={{
                py: 4,
                px: 3,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                zIndex: 1,
            }}
        >
            <Typography align="center">
                Made with Love, React and Fiber
            </Typography>
        </Box>
    );
}