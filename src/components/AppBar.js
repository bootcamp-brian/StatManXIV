import { AppBar, Box, Toolbar, Button, TextField } from "@mui/material";
import { loginUser, getStatics } from "../proxy";


export default function ButtonAppBar({ token, setToken, setStatics }) {
  const { href } = window.location;
  const BASE_URL = 'https://unique-truffle-f7b6ba.netlify.app/'

  const inputStyle = { backgroundColor: 'white', padding: '0px 0px', margin: 1, height: '50%' };

  function logout() {
    localStorage.removeItem('token');
    // localStorage.removeItem('adminToken');
    setToken('');
    setStatics([]);
    // setAdminToken('');
  }
  
  const handleLogin = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password');
    const username = data.get('username');
    console.log(username, password)
    const user = await loginUser(username, password);

    if (user.id) {
        setUserId(user.id)
    }

    if (user.token) {
        localStorage.setItem('token', user.token);
        setToken(user.token)
    }

    const fetchedStatics = await getStatics(user.token);
    setStatics(fetchedStatics.statics);
    // if (user.adminToken) {
    //     localStorage.setItem('adminToken', user.adminToken);
    //     setAdminToken(user.adminToken);
    // }
  }
//   const matches = useMediaQuery('(max-width:980px)');

  return (
    <Box sx={{ flexGrow: 1, minWidth: '980px' }}>
      <AppBar position="static">
        <Toolbar sx={{ paddingTop: 1, paddingBottom: 1, display: 'flex', justifyContent: 'right' }}>
            {
                !token ?
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ display: 'flex', alignItems: 'center', margin: 0 }}>
                    <TextField
                        sx={inputStyle}
                        size="small"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                    />
                    <TextField
                        sx={inputStyle}
                        size="small"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        color="secondary"
                        fullWidth
                        variant="contained"
                    >
                        Login
                    </Button>
                </Box>
                :
                <Button
                    type="button"
                    color="secondary"
                    variant="contained"
                    onClick={logout}
                >
                    Logout
                </Button>
            }
        </Toolbar>
      </AppBar>
    </Box>
  );
}