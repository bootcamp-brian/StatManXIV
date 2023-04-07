import { Box } from "@mui/system"
import { TextField, Button, Typography, Modal, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { createNewGearset } from "../APIutils";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import GearSlotSelectField from "./GearSlotSelectField";

function CreateGearsetForm({ token }) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [job, setJob] = useState('');
    const [mainhand, setMainhand] = useState('');
    const [offhand, setOffhand] = useState('');
    const [head, setHead] = useState('');
    const [body, setBody] = useState('');
    const [hands, setHands] = useState('');
    const [legs, setLegs] = useState('');
    const [feet, setFeet] = useState('');
    const [earrings, setEarrings] = useState('');
    const [necklace, setNecklace] = useState('');
    const [bracelets, setBracelets] = useState('');
    const [ring1, setRing1] = useState('');
    const [ring2, setRing2] = useState('');
    const [url, setUrl] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
        setJob(event.target.value);
    };

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '708px',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        const data = new FormData(event.currentTarget);
        const name = data.get('name');

        const gearsetInfo = {
            name,
            job,
            mainhand,
            offhand,
            head,
            body,
            hands,
            legs,
            feet,
            earrings,
            necklace,
            bracelets,
            ring1,
            ring2,
        }

        const formFields = Object.keys(gearsetInfo);

        let errorExists = false;

        for (let field of formFields) {
            if (field === 'offhand' && job !== 'pld') {
                continue;
            }
            if (!gearsetInfo[field]) {
                errorExists = true;
                setErrorMessage('Please fill in all fields.')
            } else {
                setErrorMessage('');
                handleClose();
            }
        }

        gearsetInfo.url = url;

        if (!errorExists) {
            const response = await createNewGearset(gearsetInfo, token)
            if (response.error) {
                setErrorMessage(response.message);
            }
        }
        setLoading(false);
    }

    return (
        <>
            <Button
                variant="contained"
                sx={{
                    mt: 2,
                    width : '30%'
                }}
                onClick={handleOpen}
            >
                + Create New Gearset
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-gearset-form"
            >
                <Box sx={style}>
                    <Typography id="modal-create-gearset-form" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                        Create Gearset
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {
                            errorMessage &&
                            <Typography variant="subtitle2" component="h3" sx={{ textAlign: 'center', color: 'red' }}>{errorMessage}</Typography>
                        }
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '100%',
                            justifyContent: 'space-between'
                        }}>
                        <FormControl
                            margin="normal"
                            required
                            sx={{
                                width: '20%',
                                ml: 1.2
                            }}
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
                        <TextField
                            margin="normal"
                            required
                            sx={{
                                width: '70%',
                                mr: 1.2
                            }}
                            id="name"
                            label="Gearset Name"
                            name="name"
                            autoFocus
                        />
                            <GearSlotSelectField gearSlot={'Main Hand'} setFunction={setMainhand} job={job} />
                            <GearSlotSelectField gearSlot={'Off Hand'} setFunction={setOffhand} job={job} />
                            <GearSlotSelectField gearSlot={'Head'} setFunction={setHead} job={job} />
                            <GearSlotSelectField gearSlot={'Ears'} setFunction={setEarrings} job={job} />
                            <GearSlotSelectField gearSlot={'Body'} setFunction={setBody} job={job} />
                            <GearSlotSelectField gearSlot={'Neck'} setFunction={setNecklace} job={job} />
                            <GearSlotSelectField gearSlot={'Gloves'} setFunction={setHands} job={job} />
                            <GearSlotSelectField gearSlot={'Wrists'} setFunction={setBracelets} job={job} />
                            <GearSlotSelectField gearSlot={'Legs'} setFunction={setLegs} job={job} />
                            <GearSlotSelectField gearSlot={'FingerL'} setFunction={setRing1} job={job} />
                            <GearSlotSelectField gearSlot={'Feet'} setFunction={setFeet} job={job} />
                            <GearSlotSelectField gearSlot={'FingerR'} setFunction={setRing2} job={job} />
                        </Box>
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

export default CreateGearsetForm;