import React, {useEffect, useState} from "react";
import {AppBar, Button, Link, Toolbar, Typography, useTheme} from "@mui/material";
import {useUserState} from "../states/user-state";

export function Bar() {
    const theme = useTheme();
    const {name, clearName} = useUserState();
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener("scroll", updatePosition);
        updatePosition();
        return () => window.removeEventListener("scroll", updatePosition);
    }, []);

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: scrollPosition > 32 ? 'transparent' : theme.palette.primary.main,
                backdropFilter: scrollPosition > 32 ? 'blur(12px)' : undefined,
                transition: 'all 250ms ease-in-out',
                color: scrollPosition > 32 ? theme.palette.text.primary : theme.palette.primary.contrastText,
            }}
            elevation={2}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                    }}
                    color="inherit"
                    href="/"
                >
                    Meetyng
                </Typography>

                {
                    name != null &&
                    <Button
                        color="inherit"
                        onClick={() => {
                            const res = window.confirm('Are you sure you want to clear your name?');
                            if (!res) {
                                return;
                            }
                            clearName();
                        }}
                        size="small"
                        sx={{
                            textTransform: 'none',
                        }}
                    >
                        {name}
                    </Button>
                }
            </Toolbar>
        </AppBar>
    );
}