import React, {useEffect, useState} from "react";
import {Backdrop, CircularProgress, Container} from "@mui/material";
import {Group, NewGroup} from "../models/group";
import ky from "ky";
import {useNavigate, useParams} from "react-router-dom";
import {useUserState} from "../states/user-state";
import {useAdminState} from "../states/admin-state";
import {EditStepper} from "../components/edit-stepper";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {api} from "../api";

export function Edit() {
    const {t} = useTranslation();
    const {key} = useParams<{ key: string }>();
    const navigate = useNavigate();
    const {groups} = useAdminState();

    const [group, setGroup] = useState<NewGroup>({
        adminMail: "",
        adminName: "",
        description: "",
        location: "",
        options: [],
        title: "",
    });

    useEffect(() => {
        if (key != null && key.trim().length > 0) {
            if (groups[key] == null || groups[key].adminKey == null || groups[key].adminKey === "") {
                navigate('/not-found');
                return;
            }

            ky
                .get(`${api}/api/groups/${key}`)
                .json<Group>()
                .then(group => {
                    setGroup({
                        ...group,
                        adminMail: groups[key].adminMail,
                        adminKey: groups[key].adminKey,
                    } as NewGroup);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [key]);

    const [isBusy, setIsBusy] = useState(false);
    const {setName} = useUserState();
    const {addGroup} = useAdminState();
    const isNew = key == null || key.trim().length === 0;

    const handleSubmit = () => {
        setIsBusy(true);
        const start = Date.now();

        if (!isNew) {
            ky
                .put(`${api}/api/groups/${(group as Group).key}`, {
                    json: group,
                    headers: {
                        Authorization: groups[(group as Group).key].adminKey,
                    }
                })
                .json<Group>()
                .then(response => {
                    const diff = Date.now() - start;

                    setName(group.adminName);
                    addGroup(response);

                    setTimeout(() => {
                        setIsBusy(false);
                        navigate(`/${response.key}`);
                    }, Math.max(1000 - diff, 100));
                })
                .catch(error => {
                    setIsBusy(false);
                    console.error(error);
                });
        } else {
            ky
                .post(`${api}/api/groups`, {
                    json: group,
                })
                .json<Group>()
                .then(response => {
                    const diff = Date.now() - start;

                    setName(group.adminName);
                    addGroup(response);

                    setTimeout(() => {
                        setIsBusy(false);
                        navigate(`/${response.key}`);
                    }, Math.max(1000 - diff, 100));
                })
                .catch(error => {
                    setIsBusy(false);
                    console.error(error);
                });
        }
    }

    return (
        <>
            <Helmet>
                <title>
                    Meetyng - {
                    isNew ?
                        t('edit:tab_title_new') :
                        t('edit:tab_title_existing')
                }
                </title>
            </Helmet>
            <Container>
                <EditStepper
                    value={group}
                    onChange={setGroup}
                    onFinish={handleSubmit}
                />

                <Backdrop
                    open={isBusy}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        </>
    );
}
