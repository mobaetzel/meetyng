import React, {useEffect, useMemo, useState} from "react";
import ky from "ky";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography
} from "@mui/material";
import {useUserState} from "../states/user-state";
import {Vote, VoteValue} from "../models/vote";
import {Group} from "../models/group";
import dayjs from "dayjs";
import PeopleAlt from '@mui/icons-material/PeopleAltRounded';
import Star from '@mui/icons-material/StarRounded';
import {Option} from "../models/option";
import {Trans, useTranslation} from "react-i18next";
import {api} from "../api";

interface Props {
    group?: Group;
    groupKey: string;
}

export function OptionArea(props: Props) {
    const {t} = useTranslation();
    const {name} = useUserState();

    const [allVotes, setAllVotes] = useState<Vote[]>();
    const [optionToShow, setOptionToShow] = useState<Option>();
    const votesToShow = useMemo(() => {
        if (optionToShow == null || allVotes == null) {
            return undefined;
        }
        return allVotes
            .filter(vote => vote.optionKey === optionToShow.key);
    }, [allVotes, optionToShow]);

    useEffect(() => {
        ky
            .get(`${api}/api/groups/${props.groupKey}/votes`)
            .json<Vote[]>()
            .then(setAllVotes)
            .catch(err => {
                console.error(err);
            });
    }, [props.groupKey]);

    const handleVote = (userVote: Vote) => {
        if (allVotes == null || name == null) {
            return;
        }

        let value: VoteValue;
        if (userVote.value === VoteValue.VoteValueNo) {
            value = VoteValue.VoteValueYes;
        } else if (userVote.value === VoteValue.VoteValueYes) {
            value = VoteValue.VoteValueMaybe;
        } else {
            value = VoteValue.VoteValueNo;
        }
        const updatedVote: Vote = {
            ...userVote,
            value: value,
        };
        ky
            .put(`${api}/api/groups/${props.groupKey}/votes`, {
                json: updatedVote,
            })
            .json<Vote>()
            .then(vote => {
                const updatedVotes = allVotes
                    .filter(v => v !== userVote)
                    .concat(vote);
                setAllVotes(updatedVotes);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {

            });
    };

    if (props.group == null || allVotes == null || name == null) {
        return null;
    }

    const allOptionVotes: Record<string, Vote[]> = props.group.options
        .reduce((acc, option) => {
            const optionVotes = allVotes
                .filter(vote => vote.optionKey === option.key);
            return {
                ...acc,
                [option.key]: optionVotes,
            };
        }, {});
    const maxVotes: number = props.group.options
        .reduce((acc, option) => {
            const optionVotes = allOptionVotes[option.key]
                .filter(vote => vote.value !== VoteValue.VoteValueNo);
            return Math.max(acc, optionVotes.length);
        }, 0);

    return (
        <>
            <List>
                {
                    props.group.options.map((option, index) => {
                        const labelId = `checkbox-list-label-${index}`;
                        const date = dayjs(option.date);
                        const optionVotes = allOptionVotes[option.key];
                        const userVote: Vote = optionVotes.find(vote => vote.voterName === name) ?? {
                            optionKey: option.key,
                            voterName: name,
                            value: VoteValue.VoteValueNo,
                            created: new Date().toISOString(),
                        };
                        const positiveVotes = optionVotes
                            .filter(vote => vote.value === VoteValue.VoteValueYes);
                        const maybeVotes = optionVotes
                            .filter(vote => vote.value === VoteValue.VoteValueMaybe);
                        const totalPositiveVotes = positiveVotes.length + maybeVotes.length;

                        return (
                            <ListItem
                                key={option.key}
                                dense
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        onChange={_ => {
                                            handleVote(userVote);
                                        }}
                                        indeterminate={userVote != null && userVote.value === VoteValue.VoteValueMaybe}
                                        checked={userVote != null && userVote.value === VoteValue.VoteValueYes}
                                        inputProps={{'aria-labelledby': labelId}}
                                    />
                                }
                            >
                                <ListItemButton
                                    onClick={() => {
                                        setOptionToShow(option);
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '4em',
                                            height: '4em',
                                            position: 'relative',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                        >
                                            {date.format('ddd')}
                                        </Typography>
                                        <Typography
                                            fontWeight="500"
                                            fontFamily="Montserrat"
                                            id={labelId}
                                        >
                                            {date.format('DD.MM.')}
                                        </Typography>

                                        {
                                            totalPositiveVotes >= maxVotes &&
                                            <Star
                                                fontSize="small"
                                                color="secondary"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '-0.5em',
                                                    right: '-0.5em',
                                                }}
                                            />
                                        }
                                    </Paper>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="end"
                                        flex={1}
                                    >
                                        <Typography>
                                            {positiveVotes.length + maybeVotes.length}
                                        </Typography>

                                        <PeopleAlt
                                            opacity={0.5}
                                            sx={{
                                                ml: 2,
                                            }}
                                        />
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        );
                    })
                }
            </List>

            <Dialog
                open={optionToShow != null && votesToShow != null}
                onClose={() => setOptionToShow(undefined)}
                maxWidth="lg"
            >
                {
                    optionToShow != null &&
                    <DialogTitle
                        variant="h6"
                    >
                        {dayjs(optionToShow.date).format('dddd DD.MM.YYYY')}
                    </DialogTitle>
                }
                {
                    votesToShow != null &&
                    <DialogContent
                        sx={{
                            p: 0,
                        }}
                    >
                        <List
                            dense
                        >
                            {
                                votesToShow.map((vote, index) => {
                                    const labelId = `checkbox-list-label-${index}`;
                                    return (
                                        <ListItem
                                            key={vote.voterName}
                                            dense
                                            secondaryAction={
                                                <Checkbox
                                                    edge="end"
                                                    indeterminate={vote.value === VoteValue.VoteValueMaybe}
                                                    checked={vote.value === VoteValue.VoteValueYes}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                    disabled
                                                />
                                            }
                                        >
                                            <ListItemText
                                                primary={vote.voterName}
                                                secondary={vote.value === VoteValue.VoteValueYes ? t('option-area:dialog_yes') : (vote.value === VoteValue.VoteValueMaybe ? t('option-area:dialog_maybe') : t('option-area:dialog_no'))}
                                            />
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </DialogContent>
                }
                {
                    optionToShow != null &&
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOptionToShow(undefined);
                            }}
                        >
                            <Trans i18nKey="option-area:dialog_close" />
                        </Button>
                    </DialogActions>
                }
            </Dialog>
        </>
    );
}