import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Container, ThemeProvider, createTheme } from '@mui/material';
import ButtonAppBar from '../components/AppBar';
import Spreadsheet from "../components/Spreadsheet";
import { useState, useEffect } from "react";
import { getStatics } from "../proxy";

export default function Root() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const theme = createTheme();
    const [statics, setStatics] = useState([]);

    const renderStatics = async () => {
      const fetchedStatics = await getStatics(token);
      setStatics(fetchedStatics.statics);
    }
  
    useEffect(() => {
      console.log(statics.length)
      renderStatics();
    }, [])
        
    return <>
        <ButtonAppBar token={token} setToken={setToken} setStatics={setStatics} />
        <ThemeProvider theme={theme}>
            <Container sx={{ marginY: 5, }}>
                {
                    statics && statics.length > 0 &&
                    statics.map(staticInfo => {
                    return <Spreadsheet key={staticInfo.id} staticInfo={staticInfo} renderStatics={renderStatics} />
                    })
                }
            </Container>
        </ThemeProvider>
    </>
}