import { Box } from "@mui/system"
import { TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material"
import { useState } from "react";
import { addNewMember, getGearsets } from "../proxy";
import { LoadingButton } from "@mui/lab";

function AddMemberForm({ staticInfo, renderStatics, handleClose, token }) {
    const [job, setJob] = useState('');
    const [gearset, setGearset] = useState('');
    const [gearsetOptions, setGearsetOptions] = useState([]);
    const [characterError, setCharacterError] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [jobError, setJobError] = useState(false);
    const [gearsetError, setGearsetError] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setCharacterError(false);
        setServerError(false);
        setJobError(false);
        setGearsetError(false);
        const data = new FormData(event.currentTarget);
        const character = data.get('character').toLowerCase();
        const server = data.get('server').toLowerCase();
        const gearsetId = gearset.id;
        const staticId = staticInfo.id;
        
        if (!character) {
            setCharacterError(true);
        }
        if (!server) {
            setServerError(true);
        }
        if (!job) {
            setJobError(true);
        }
        if (!gearsetId) {
            setGearsetError(true);
        }

        if (character && server && job && gearsetId) {
            const response = await addNewMember({ character, server, gearsetId, job, staticId, token });
            if (response.error) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage('');
                setJob('');
                setGearset('');
                setGearsetOptions([]);
                setCharacterError(false);
                setServerError(false);
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {
                errorMessage &&
                <Typography variant="subtitle2" component="h3" sx={{ textAlign: 'center', color: 'red' }}>{errorMessage}</Typography>
            }
            <TextField
                margin="normal"
                required
                fullWidth
                id="character"
                label="Character Name"
                name="character"
                error={characterError}
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="server"
                label="Server"
                name="server"
                error={serverError}
            />
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
    )
}

export default AddMemberForm;