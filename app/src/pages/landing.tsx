import React from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    lighten,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
    useTheme
} from "@mui/material";
import {useAdminState} from "../states/admin-state";
import ChevronRight from "@mui/icons-material/ChevronRightRounded";
import {Trans} from "react-i18next";

export function Landing() {
    const theme = useTheme();
    const {groups} = useAdminState();

    return (
        <>
            <Container>
                <Typography
                    variant="overline"
                >
                    <Trans i18nKey="landing:hero_caption" />
                </Typography>

                <Typography
                    variant="h2"
                    component="h1"
                >
                    Meetyng
                </Typography>

                <Typography
                    variant="subtitle1"
                    component="p"
                >
                    <Trans i18nKey="landing:hero_subtitle" />
                </Typography>

                <Button
                    endIcon={<ChevronRight />}
                    variant="outlined"
                    fullWidth
                    component={Link}
                    sx={{
                        mt: 8,
                    }}
                    href="/start"
                >
                    <Trans i18nKey="landing:hero_cta" />
                </Button>
            </Container>

            <Box
                sx={{
                    my: 18,
                    py: 12,
                    backgroundColor: lighten(theme.palette.primary.main, 0.9),
                }}
                component={Paper}
                elevation={4}
                borderRadius={0}
            >
                <Container>
                    <Typography
                        variant="h4"
                        component="h2"
                    >
                        <Trans i18nKey="landing:how_it_works_title" />
                    </Typography>

                    <Typography
                        variant="body1"
                        component="p"
                        sx={{
                            mt: 4,
                        }}
                    >
                        <Trans i18nKey="landing:how_it_works_text" />
                    </Typography>
                </Container>
            </Box>

            {
                Object.keys(groups).length > 0 &&
                <>
                    <Container
                        sx={{
                            my: 18,
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h2"
                        >
                            <Trans i18nKey="landing:existing_groups_title" />
                        </Typography>

                        <Typography
                            variant="body1"
                            component="p"
                            sx={{
                                mt: 4,
                            }}
                        >
                            <Trans i18nKey="landing:existing_groups_text" />
                        </Typography>

                        <List>
                            {
                                Object.keys(groups).map(key => {
                                    const group = groups[key];
                                    return (
                                        <ListItem
                                            key={key}
                                        >
                                            <ListItemButton
                                                component={Link}
                                                href={`/${key}`}
                                            >
                                                <ListItemText
                                                    primary={group.title}
                                                    secondary={group.description}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })
                            }
                        </List>
                    </Container>

                    <Divider />
                </>
            }

            <Container
                sx={{
                    my: 18,
                }}
            >
                <Typography
                    align="center"
                    variant="h4"
                    component="h2"
                >
                    <Trans i18nKey="landing:start_now_title" />
                </Typography>

                <Button
                    endIcon={<ChevronRight />}
                    variant="outlined"
                    fullWidth
                    component={Link}
                    sx={{
                        mt: 8,
                    }}
                    href="/start"
                >
                    <Trans i18nKey="landing:start_now_cta" />
                </Button>
            </Container>
        </>
    );
}