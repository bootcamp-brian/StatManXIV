import { Box } from "@mui/system"
import { TextField, Button, Typography, Modal } from "@mui/material"
import { createNewStatic } from "../APIutils";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

function CreateStaticForm({ token, renderStatics }) {
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
        setNameError(false);
        const data = new FormData(event.currentTarget);
        const name = data.get('name');

        
        if (!name) {
            setNameError(true);
        }

        if (name) {
            const response = await createNewStatic(name, token)
            if (response.error) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage('');
                setNameError(false);
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
            <Button
                variant="contained"
                sx={{
                    mt: 2,
                    width : '30%',
                    background: 'green',
                    ":hover": {
                    bgcolor: "#106B21",
                    color: "white" 
                    }
                }}
                onClick={handleOpen}
            >
                + Create New Static
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-static-form"
            >
                <Box sx={style}>
                    <Typography id="modal-create-static-form" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                        Create Static
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {
                            errorMessage &&
                            <Typography variant="subtitle2" component="h3" sx={{ textAlign: 'center', color: 'red' }}>{errorMessage}</Typography>
                        }
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Static Name"
                            name="name"
                            error={nameError}
                            autoFocus
                        />
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

export default CreateStaticForm;