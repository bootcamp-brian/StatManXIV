import { AppBar, Box, Toolbar, Button } from "@mui/material";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";


export default function ButtonAppBar({ token, setToken, setStatics }) {

  function logout() {
    localStorage.removeItem('token');
    // localStorage.removeItem('adminToken');
    setToken('');
    setStatics([]);
    // setAdminToken('');
  }

  return (
    <Box sx={{ flexGrow: 1, minWidth: '980px' }}>
      <AppBar position="static" color="secondary">
        <Toolbar sx={{ paddingTop: 1, paddingBottom: 1, display: 'flex', justifyContent: 'right' }}>
            {
                !token ?
                <>
                  <LoginForm setToken={setToken} />
                  <RegisterForm setToken={setToken} />
                </>
                :
                <Button
                    type="button"
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