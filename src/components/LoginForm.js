import { LoadingButton } from "@mui/lab";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { loginUser } from "../APIutils";

export default function LoginForm({ setToken }) {
    const [open, setOpen] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
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
        const data = new FormData(event.currentTarget);
        const password = data.get('password');
        const username = data.get('username');

        if (!username) {
            setUsernameError(true);
        }
        if (!password) {
            setPasswordError(true);
        }

        if (username && password) {
            const response = await loginUser(username, password)
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
                handleClose();
            }
        } else {
            setErrorMessage('Please fill in all required fields')
        }
        // if (user.adminToken) {
        //     localStorage.setItem('adminToken', user.adminToken);
        //     setAdminToken(user.adminToken);
        // }
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
                Login
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-static-form"
            >
                <Box sx={style}>
                    <Typography id="modal-create-static-form" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                        Login
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
                            autoComplete="password"
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