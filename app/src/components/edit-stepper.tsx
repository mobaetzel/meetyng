import React, {ChangeEventHandler, FocusEventHandler, useState} from "react";
import {Group, NewGroup} from "../models/group";
import {Box, Button, Step, StepContent, StepLabel, Stepper, TextField} from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRightRounded";
import ChevronLeft from "@mui/icons-material/ChevronLeftRounded";
import {DateCalendar, PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import Done from "@mui/icons-material/DoneRounded";
import {Trans, useTranslation} from "react-i18next";

interface Props {
    value: NewGroup;
    onChange: (group: NewGroup) => void;
    onFinish: () => void;
}

export function EditStepper(props: Props) {
    const {t} = useTranslation();
    const [activeStep, setActiveStep] = useState(0);

    const handlePatch: ChangeEventHandler<HTMLInputElement> = (event) => {
        const name = event.currentTarget.name;
        props.onChange({
            ...props.value,
            [name]: event.currentTarget.value,
        });
    };

    const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
        const name = event.currentTarget.name;
        props.onChange({
            ...props.value,
            [name]: event.currentTarget.value.trim(),
        });
    };

    return (
        <Stepper
            orientation="vertical"
            activeStep={activeStep}
        >
            <Step>
                <StepLabel>
                    <Trans i18nKey="editStepper:step1" />
                </StepLabel>
                <StepContent>
                    <form
                        onSubmit={event => {
                            event.preventDefault();
                            setActiveStep(1);
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            name="title"
                            label={t('editStepper:step1_title_label')}
                            placeholder={t('editStepper:step1_title_placeholder')}
                            helperText={t('editStepper:step1_title_hint')}
                            required
                            inputProps={{maxLength: 64}}
                            value={props.value.title}
                            onChange={handlePatch}
                            onBlur={handleBlur}
                            autoFocus
                        />

                        <TextField
                            fullWidth
                            name="location"
                            variant="outlined"
                            margin="normal"
                            label={t('editStepper:step1_location_label')}
                            placeholder={t('editStepper:step1_location_placeholder')}
                            helperText={t('editStepper:step1_location_hint')}
                            inputProps={{maxLength: 64}}
                            value={props.value.location}
                            onChange={handlePatch}
                            onBlur={handleBlur}
                        />

                        <TextField
                            fullWidth
                            name="description"
                            variant="outlined"
                            margin="normal"
                            rows={5}
                            multiline={true}
                            label={t('editStepper:step1_description_label')}
                            placeholder={t('editStepper:step1_description_placeholder')}
                            helperText={t('editStepper:step1_description_hint')}
                            inputProps={{maxLength: 500}}
                            value={props.value.description}
                            onChange={handlePatch}
                            onBlur={handleBlur}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                mt: 2,
                            }}
                        >
                            <Button
                                type="submit"
                                variant="text"
                                endIcon={<ChevronRight />}
                                sx={{
                                    ml: 'auto',
                                }}
                            >
                                <Trans i18nKey="editStepper:next" />
                            </Button>
                        </Box>
                    </form>
                </StepContent>
            </Step>
            <Step>
                <StepLabel>
                    <Trans i18nKey="editStepper:step2" />
                </StepLabel>
                <StepContent>
                    <form
                        onSubmit={event => {
                            event.preventDefault();
                            setActiveStep(2);
                        }}
                    >
                        <TextField
                            fullWidth
                            name="adminName"
                            variant="outlined"
                            margin="normal"
                            label={t('editStepper:step2_name_label')}
                            placeholder={t('editStepper:step2_name_placeholder')}
                            helperText={t('editStepper:step2_name_hint')}
                            required
                            inputProps={{maxLength: 64}}
                            value={props.value.adminName}
                            onChange={handlePatch}
                            onBlur={handleBlur}
                            autoFocus
                            disabled={(props.value as Group).key != null}
                        />

                        <TextField
                            fullWidth
                            name="adminMail"
                            variant="outlined"
                            margin="normal"
                            label={t('editStepper:step2_email_label')}
                            placeholder={t('editStepper:step2_email_placeholder')}
                            helperText={t('editStepper:step2_email_hint')}
                            type="email"
                            required
                            inputProps={{maxLength: 64}}
                            value={props.value.adminMail}
                            onChange={handlePatch}
                            onBlur={handleBlur}
                            disabled={(props.value as Group).key != null}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                mt: 2,
                            }}
                        >
                            <Button
                                type="button"
                                onClick={() => setActiveStep(0)}
                                startIcon={<ChevronLeft />}
                                variant="text"
                                sx={{
                                    mr: 'auto',
                                }}
                            >
                                <Trans i18nKey="editStepper:back" />
                            </Button>

                            <Button
                                type="submit"
                                variant="text"
                                endIcon={<ChevronRight />}
                                sx={{
                                    ml: 'auto',
                                }}
                            >
                                <Trans i18nKey="editStepper:next" />
                            </Button>
                        </Box>
                    </form>
                </StepContent>
            </Step>
            <Step>
                <StepLabel>
                    <Trans i18nKey="editStepper:step3" />
                </StepLabel>
                <StepContent>
                    <DateCalendar
                        disablePast
                        displayWeekNumber
                        slots={{
                            day: CustomDay,
                        }}
                        slotProps={{
                            day: {
                                selectedDays: props.value.options.map(option => dayjs(option.date)),
                            } as any,
                        }}
                        onChange={val => {
                            if (val != null) {
                                const alreadyAdded = props.value.options.findIndex(option => val.isSame(dayjs(option.date)));
                                if (alreadyAdded >= 0) {
                                    props.onChange({
                                        ...props.value,
                                        options: props.value.options.filter((_, index) => index !== alreadyAdded),
                                    });
                                } else {
                                    props.onChange({
                                        ...props.value,
                                        options: [
                                            ...props.value.options,
                                            {
                                                key: "",
                                                date: val.format('YYYY-MM-DD'),
                                                groupKey: "",
                                            },
                                        ]
                                    });
                                }
                            }
                        }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            mt: 2,
                        }}
                    >
                        <Button
                            type="button"
                            onClick={() => setActiveStep(1)}
                            variant="text"
                            startIcon={<ChevronLeft />}
                            sx={{
                                mr: 'auto',
                            }}
                        >
                            <Trans i18nKey="editStepper:back" />
                        </Button>

                        <Button
                            type="button"
                            onClick={props.onFinish}
                            variant="text"
                            endIcon={<Done />}
                            sx={{
                                ml: 'auto',
                            }}
                        >
                            <Trans i18nKey="editStepper:finish" />
                        </Button>
                    </Box>
                </StepContent>
            </Step>
        </Stepper>
    );
}


function CustomDay(props: PickersDayProps<Dayjs> & { selectedDays?: Array<Dayjs> }) {
    const {
        selectedDays,
        ...passTroughProps
    } = props;
    const day = dayjs(props.day);
    const isSelected = (selectedDays ?? []).some(d => day.isSame(d, 'day'));
    return (
        <PickersDay
            {...passTroughProps}
            selected={isSelected}
        />
    );
}