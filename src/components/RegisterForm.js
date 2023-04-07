import { LoadingButton } from "@mui/lab";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { registerUser } from "../proxy";

export default function RegisterForm({ setToken }) {
    const [open, setOpen] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmationError, setConfirmationError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setUsernameError(false);
        setPasswordError(false);
        setConfirmationError(false);
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');
        const confirmation = data.get('confirmation');

        if (!username) {
            setUsernameError(true);
        }
        if (!password) {
            setPasswordError(true);
        }
        if (!confirmation) {
            setConfirmationError(true);
        }

        if (username && password && confirmation) {
            if (password.length < 8) {
                setPasswordError(true);
                setErrorMessage('Password too short.');
                setLoading(false);
                return;
            }
    
            if (password !== confirmation) {
                setPasswordError(true);
                setConfirmationError(true);
                setErrorMessage('Passwords must match.')
                setLoading(false);
                return;
            }

            const response = await registerUser(username, password);
            if (response.error) {
                setErrorMessage(response.message);
            } else {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    setToken(response.token)
                }
            
                setErrorMessage('');
                setUsernameError(false);
                setPasswordError(false);
                setConfirmationError(false);
                handleClose();
            }
        } else {
            setErrorMessage('Please fill in all required fields')
        }
        setLoading(false);
    }

    return (
        <>
            <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={handleOpen}
                sx= {{
                    ml: 3,
                    width: '20%'
                }}
            >
                Register
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-static-form"
            >
                <Box sx={style}>
                    <Typography id="modal-create-static-form" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                        Register
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
                            id="username"
                            label="Username"
                            name="username"
                            error={usernameError}
                            autoFocus
                            autoComplete="username"
                        />
                        <TextField
                            type="password"
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            error={passwordError}
                            autoComplete="new-password"
                        />
                        <TextField
                            type="password"
                            margin="normal"
                            required
                            fullWidth
                            id="confirmation"
                            label="Conirm Password"
                            name="confirmation"
                            error={confirmationError}
                            autoComplete="new-password"
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