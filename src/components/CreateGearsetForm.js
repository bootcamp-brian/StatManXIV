import { Box } from "@mui/system"
import { TextField, Button, Typography, Modal, FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material"
import { createNewStatic, getCharacterProxy } from "../proxy";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import GearSlotSelectField from "./GearSlotSelectField";

function CreateGearsetForm({ token, renderStatics }) {
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [job, setJob] = useState('');
    const [jobError, setError] = useState(false);

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
        // event.preventDefault();
        // setLoading(true);
        // const data = new FormData(event.currentTarget);
        // const name = data.get('name');

        
        // if (!name) {
        //     setNameError(true);
        // }

        // if (name) {
        //     const response = await createNewStatic(name, token)
        //     if (response.error) {
        //         setErrorMessage(response.message);
        //     } else {
        //         setErrorMessage('');
        //         setNameError(false);
        //         handleClose();
        //         renderStatics();
        //     }
        // } else {
        //     setErrorMessage('Please fill in all required fields')
        // }
        // setLoading(false);
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
                            error={nameError}
                            autoFocus
                        />
                            <GearSlotSelectField gearSlot={'Main Hand'} />
                            <GearSlotSelectField gearSlot={'Off Hand'} />
                            <GearSlotSelectField gearSlot={'Head'} />
                            <GearSlotSelectField gearSlot={'Ears'} />
                            <GearSlotSelectField gearSlot={'Body'} />
                            <GearSlotSelectField gearSlot={'Neck'} />
                            <GearSlotSelectField gearSlot={'Gloves'} />
                            <GearSlotSelectField gearSlot={'Wrists'} />
                            <GearSlotSelectField gearSlot={'Legs'} />
                            <GearSlotSelectField gearSlot={'FingerL'} />
                            <GearSlotSelectField gearSlot={'Feet'} />
                            <GearSlotSelectField gearSlot={'FingerR'} />
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