import { Box } from "@mui/system"
import { Typography, Modal, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { editPlayerInfo, getGearsets } from "../APIutils";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

export default function PlayerInfoEditForm({ token, playerId, renderStatics, loading, setLoading }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [job, setJob] = useState('');
    const [gearset, setGearset] = useState('');
    const [gearsetOptions, setGearsetOptions] = useState([]);
    const [jobError, setJobError] = useState(false);
    const [gearsetError, setGearsetError] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const jobOptions = [
        'pld',
        'mnk',
        'war',
        'drg',
        'brd',
        'whm',
        'blm',
        'smn',
        'sch',
        'nin',
        'mch',
        'drk',
        'ast',
        'sam',
        'rdm',
        'gnb',
        'dnc',
        'rpr',
        'sge',
    ]

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleJobSelect = async (event) => {
        setGearset('');
        const gearsets = await getGearsets();
        const filteredGearsets = gearsets.gearsets.filter(option => {
            if (event.target.value === option.job) {
                return true;
            } else {
                return false;
            }
        })
        setJob(event.target.value);
        setGearsetOptions(filteredGearsets);
        setDisabled(false);
    };

    const handleGearsetSelect = (event) => {
        setGearset(event.target.value);
    };

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setJobError(false);
        setGearsetError(false);
        const gearsetId = gearset.id;

        if (!job) {
            setJobError(true);
        }
        if (!gearsetId) {
            setGearsetError(true);
        }

        if (job && gearsetId) {
            const response = await editPlayerInfo(playerId, job, gearsetId, token);
            console.log(response)
            if (response.error) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage('');
                setJob('');
                setGearset('');
                setGearsetOptions([]);
                setJobError(false);
                setGearsetError(false);
                setDisabled(true);
                handleClose();
                renderStatics();
            }
        } else {
            setErrorMessage('Please fill in all required fields')
        }
        setLoading(false);
    }

    return (
        <>
            <LoadingButton
                loading={loading}
                variant="contained"
                color="secondary"
                onClick={handleOpen}
                sx={{
                    ml: 1,
                    mr: 1
                }}
            >
                Edit
            </LoadingButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-edit-player-form"
            >
                <Box sx={style}>
                    <Typography id="modal-edit-player-form" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                        Edit Player Info
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {
                            errorMessage &&
                            <Typography variant="subtitle2" component="h3" sx={{ textAlign: 'center', color: 'red' }}>{errorMessage}</Typography>
                        }
                        <FormControl
                            margin="normal"
                            required
                            fullWidth
                            error={jobError}
                        >
                            <InputLabel id="job-select-label">Job</InputLabel>
                            <Select
                                labelId="job-select-label"
                                id="job-select"
                                value={job}
                                label="Job"
                                onChange={handleJobSelect}
                            >
                                {
                                    jobOptions.map(option => <MenuItem key={jobOptions.indexOf(option)} value={option}>{option}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <FormControl
                            margin="normal"
                            required
                            fullWidth
                            error={gearsetError}
                        >
                            <InputLabel id="gearset-select-label">{disabled ? 'Please select a job' : 'Gearset'}</InputLabel>
                            <Select
                                labelId="gearset-select-label"
                                id="gearset-select"
                                value={gearset}
                                label="Gearset"
                                disabled={disabled}
                                onChange={handleGearsetSelect}
                            >
                                {
                                    gearsetOptions && gearsetOptions.length > 0 &&
                                    gearsetOptions.map(option => <MenuItem data-gearset={option.id} key={option.id} value={option}>{option.name}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            loading={loading}
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                        Submit
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}