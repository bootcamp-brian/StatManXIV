import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Container, Modal, ThemeProvider, createTheme } from '@mui/material';
import ButtonAppBar from '../components/AppBar';
import Spreadsheet from "../components/Spreadsheet";
import { useState, useEffect } from "react";
import { getGearSlotList, getStatics } from "../proxy";
import CreateStaticForm from "../components/CreateStaticForm";
import CreateGearsetForm from "../components/CreateGearsetForm";

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
  
    const testFunction = async () => {
        const response = await getGearSlotList('MainHand')
        console.log(response)
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
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                        <CreateStaticForm token={token} renderStatics={renderStatics} />
                        <CreateGearsetForm token={token} renderStatics={renderStatics} />
                    </Box>
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