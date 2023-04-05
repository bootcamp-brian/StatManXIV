import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Modal, ThemeProvider, createTheme } from '@mui/material';
import ButtonAppBar from '../components/AppBar';
import Spreadsheet from "../components/Spreadsheet";
import { useState, useEffect } from "react";
import { getStatics } from "../proxy";
import CreateStaticForm from "../components/CreateStaticForm";

export default function Root() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const theme = createTheme();
    const [statics, setStatics] = useState([]);

    const renderStatics = async () => {
        if (token) {
            const fetchedStatics = await getStatics(token);
            setStatics(fetchedStatics.statics);
        }
    }
  
    useEffect(() => {
      renderStatics();
    }, [])
        
    return <>
        <ButtonAppBar token={token} setToken={setToken} setStatics={setStatics} />
        <ThemeProvider theme={theme}>
            {
                token &&
                <Container sx={{ marginY: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CreateStaticForm token={token} renderStatics={renderStatics} />
                    {
                        statics && statics.length > 0 &&
                        statics.map(staticInfo => {
                        return <Spreadsheet key={staticInfo.id} staticInfo={staticInfo} renderStatics={renderStatics} token={token}/>
                        })
                    }
                </Container>
            }
        </ThemeProvider>
    </>
}