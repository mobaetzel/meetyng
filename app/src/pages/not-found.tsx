import React from "react";
import {Button, Container, Link, Typography} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeftRounded";
import {Trans} from "react-i18next";

export function NotFound() {
    return (
        <>
            <Container>
                <Typography
                    variant="h2"
                    component="h1"
                >
                    <Trans i18nKey="not-found:title"/>
                </Typography>

                <Typography
                    variant="subtitle1"
                    component="p"
                >
                    <Trans i18nKey="not-found:subtitle"/>
                </Typography>

                <Button
                    startIcon={<ChevronLeft />}
                    variant="outlined"
                    fullWidth
                    component={Link}
                    sx={{
                        mt: 8,
                    }}
                    href="/"
                >
                    <Trans i18nKey="not-found:back"/>
                </Button>
            </Container>
        </>
    );
}