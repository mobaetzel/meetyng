import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Group} from "../models/group";
import ky from "ky";
import {UsernameDialog} from "../components/username-dialog";
import {Box, Container, Divider, IconButton, InputAdornment, Link, TextField, Tooltip, Typography} from "@mui/material";
import LocationOn from '@mui/icons-material/LocationOnRounded';
import Person from '@mui/icons-material/PersonRounded';
import ContentCopy from '@mui/icons-material/ContentCopyRounded';
import Edit from '@mui/icons-material/EditRounded';
import {CommentArea} from "../components/comment-area";
import {OptionArea} from "../components/option-area";
import {enqueueSnackbar} from "notistack";
import {useAdminState} from "../states/admin-state";
import {Trans, useTranslation} from "react-i18next";
import {api} from "../api";

export function Vote() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {groups, addGroup} = useAdminState();
    const {key} = useParams<{ key: string }>();
    const [group, setGroup] = useState<Group>();

    useEffect(() => {
        ky
            .get(`${api}/api/groups/${key}`)
            .json<Group>()
            .then(group => {
                setGroup(group);
                if (groups[group.key] == null) {
                    addGroup(group);
                }
            })
            .catch(err => {
                if (err.response.status === 404) {
                    navigate('/not-found');
                } else {
                    console.error(err);
                }
            });
    }, [key]);

    if (key == null) {
        return null;
    }

    return (
        <Container>
            {
                (group?.location ?? '') !== '' &&
                <Box
                    display="flex"
                    alignItems="center"
                >
                    <LocationOn
                        fontSize="small"
                        opacity={0.5}
                    />

                    <Typography
                        variant="caption"
                        sx={{
                            mt: '4px',
                            ml: 0.5,
                            mr: 1,
                        }}
                    >
                        {group?.location}
                    </Typography>

                    <Person
                        fontSize="small"
                        opacity={0.5}
                    />

                    <Typography
                        variant="caption"
                        sx={{
                            mt: '4px',
                            ml: 0.5,
                            mr: 1,
                        }}
                    >
                        {group?.adminName}
                    </Typography>
                </Box>
            }

            <Box
                display="flex"
                justifyContent="space-between"
            >
                <Typography
                    variant="h6"
                    component="h1"
                >
                    {group?.title}
                </Typography>

                {
                    groups[group?.key ?? '']?.adminKey != null &&
                    groups[group?.key ?? '']?.adminKey !== "" &&
                    <Tooltip title={t('vote:edit_tooltip')}>
                        <IconButton
                            size="small"
                            component={Link}
                            href={`/edit/${key}`}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                }
            </Box>

            {
                (group?.location ?? '') !== '' &&
                <Typography
                    variant="body1"
                >
                    {group?.description}
                </Typography>
            }

            <TextField
                value={window.location}
                fullWidth
                size="small"
                variant="standard"
                label={t('vote:link_label')}
                helperText={t('vote:link_hint')}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="copy"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.toString());
                                    enqueueSnackbar(t('vote:link_copied_toast'));
                                }}
                            >
                                <ContentCopy />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    mt: 4,
                }}
                onFocus={e => e.target.select()}
            />

            <Divider
                sx={{
                    my: 4,
                }}
            />

            <Typography
                variant="subtitle1"
                component="h2"
            >
                <Trans i18nKey="vote:options_title" />
            </Typography>


            <OptionArea
                group={group}
                groupKey={key}
            />

            <Divider
                sx={{
                    my: 4,
                }}
            />

            <Typography
                variant="subtitle1"
                component="h2"
            >
                <Trans i18nKey="vote:comments_title" />
            </Typography>

            <CommentArea groupKey={key} />

            <UsernameDialog />
        </Container>
    );
}