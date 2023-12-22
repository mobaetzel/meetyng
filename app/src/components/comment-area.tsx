import React, {useEffect, useState} from "react";
import ky from "ky";
import {Box, Button, TextField, Typography} from "@mui/material";
import {Comment, NewComment} from "../models/comment";
import Send from "@mui/icons-material/SendRounded";
import {useUserState} from "../states/user-state";
import dayjs from "dayjs";
import {Trans, useTranslation} from "react-i18next";
import {api} from "../api";

interface Props {
    groupKey: string;
}

export function CommentArea(props: Props) {
    const {t} = useTranslation();
    const {name} = useUserState();

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>();

    useEffect(() => {
        ky
            .get(`${api}/api/groups/${props.groupKey}/comments`)
            .json<Comment[]>()
            .then(setComments)
            .catch(err => {
                console.error(err);
            });
    }, [props.groupKey]);

    return (
        <Box>
            <Box
                sx={{
                    px: 2,
                }}
            >
                {
                    comments?.map(comment => (
                        <Box
                            key={comment.key}
                            sx={{
                                py: 2,
                                borderBottom: '1px solid #ccc',
                                '&:last-child': {
                                    borderBottom: 'none',
                                },
                            }}
                        >
                            <Typography
                                variant="overline"
                            >
                                <strong>{comment.authorName}</strong> &#x2022; {dayjs(comment.created).format('DD.MM.YYYY HH:mm')}
                            </Typography>

                            <Typography
                                variant="body2"
                            >
                                {comment.comment}
                            </Typography>
                        </Box>
                    ))
                }
            </Box>
            <form
                onSubmit={e => {
                    e.preventDefault();

                    if (name == null) {
                        return;
                    }

                    const newComment: NewComment = {
                        comment: comment,
                        authorName: name,
                    };
                    setComment('');
                    ky
                        .post(`${api}/api/groups/${props.groupKey}/comments`, {
                            json: newComment
                        })
                        .json<Comment>()
                        .then(comment => {
                            setComments(comments => {
                                if (comments == null) {
                                    return [comment];
                                }
                                return [...comments, comment];
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    margin="normal"
                    variant="outlined"
                    label={t('comment-area:comment_label')}
                    placeholder={t('comment-area:comment_placeholder')}
                    required
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />

                <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    endIcon={<Send />}
                >
                    <Trans i18nKey="comment-area:send" />
                </Button>
            </form>
        </Box>
    );
}