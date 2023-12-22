import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useUserState} from "../states/user-state";
import {Trans, useTranslation} from "react-i18next";

export function UsernameDialog() {
    const {t} = useTranslation();
    const {name, setName} = useUserState();
    const [username, setUsername] = useState('');

    return (
        <Dialog open={name == null}>
            <form
                onSubmit={event => {
                    event.preventDefault();

                    if (username.trim() === '') {
                        return;
                    }

                    setName(username);
                    setUsername('');
                }}
            >
                <DialogTitle>
                    <Trans i18nKey="username-dialog:title"/>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        label={t('username-dialog:name_label')}
                        placeholder={t('username-dialog:name_placeholder')}
                        helperText={t('username-dialog:name_hint')}
                        value={username}
                        onChange={event => {
                            setUsername(event.target.value);
                        }}
                        onBlur={_ => {
                            if (username != null) {
                                setUsername(username.trim());
                            }
                        }}
                        inputProps={{
                            maxLength: 64,
                        }}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">
                        <Trans i18nKey="username-dialog:ok"/>
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}