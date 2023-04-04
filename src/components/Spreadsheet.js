import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip, Typography } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { syncAllPlayers, syncPlayer } from '../proxy';
import { LoadingButton } from '@mui/lab';



const Spreadsheet = ({ staticInfo, renderStatics }) => {
  const [loading, setLoading] = useState(false);
  const players = staticInfo.players;
  const headerStyle = { width: 75, padding: "0px 0px", border: '1px solid black', textAlign: 'center', backgroundColor: '#a7acac' };
  const cellStyle = (cellValue) => {
    return { textAlign: 'center', padding: '0px 0px', border: '1px solid black', backgroundColor: cellValue ? '#0d561a' : '#760006' };
  }
  
  const handleClick = async (event) => {
    setLoading(true);
    const playerId = Number(event.target.getAttribute('data-player'));
    console.log(playerId, typeof(playerId))
    await syncPlayer(playerId);
    renderStatics();
    setLoading(false);
  }

  const handleClickAll = async () => {
    setLoading(true);
    await syncAllPlayers(players);
    renderStatics();
    setLoading(false);
  }

  if (players) {
    return (
      <TableContainer component={Paper} sx={{ padding: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} elevation={12}>
        <Typography variant='h2' mb={2}>{staticInfo.name}</Typography>
        <Table aria-label="spreadsheet">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 120, border: '1px solid black', backgroundColor: '#a7acac' }}>Character Name</TableCell>
              <TableCell sx={headerStyle}>Main Hand</TableCell>
              <TableCell sx={headerStyle}>Off Hand</TableCell>
              <TableCell sx={headerStyle}>Head</TableCell>
              <TableCell sx={headerStyle}>Body</TableCell>
              <TableCell sx={headerStyle}>Hands</TableCell>
              <TableCell sx={headerStyle}>Legs</TableCell>
              <TableCell sx={headerStyle}>Feet</TableCell>
              <TableCell sx={headerStyle}>Earring</TableCell>
              <TableCell sx={headerStyle}>Necklace</TableCell>
              <TableCell sx={headerStyle}>Bracelet</TableCell>
              <TableCell sx={headerStyle}>Ring1</TableCell>
              <TableCell sx={headerStyle}>Ring2</TableCell>
              <TableCell sx={headerStyle}>Sync</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => {
              const { bisGear } = player;
              return (
              <TableRow key={player.playerId}>
                <TableCell component="th" scope="row" sx={{ border: '1px solid black'}}>
                  {player.character}
                </TableCell>
                <TableCell sx={cellStyle(player.mainhand)}>
                    { 
                      <Tooltip title={bisGear.mainhand} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.mainhand.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={player.job === 'pld' ? cellStyle(player.offhand) : { padding: '0px 0px', textAlign: 'center', border: '1px solid black' }}>
                  { player.job !== 'pld' ? 'N/A' : 
                    (
                      
                      <Tooltip title={bisGear.offhand} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.offhand.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    )
                  }
                </TableCell>
                <TableCell sx={cellStyle(player.head)}>
                    { 
                      <Tooltip title={bisGear.head} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.head.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={cellStyle(player.body)}>
                    { 
                      <Tooltip title={bisGear.body} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.body.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={cellStyle(player.hands)}>
                    { 
                      <Tooltip title={bisGear.hands} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.hands.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={cellStyle(player.legs)}>
                    { 
                      <Tooltip title={bisGear.legs} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.legs.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={cellStyle(player.feet)}>
                    { 
                      <Tooltip title={bisGear.feet} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.feet.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={cellStyle(player.earrings)}>
                    { 
                      <Tooltip title={bisGear.earrings} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.earrings.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={cellStyle(player.necklace)}>
                    { 
                      <Tooltip title={bisGear.necklace} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.necklace.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={cellStyle(player.bracelets)}>
                    { 
                      <Tooltip title={bisGear.bracelets} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.bracelets.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={cellStyle(player.ring1)}>
                    { 
                      <Tooltip title={bisGear.ring1} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.ring1.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={cellStyle(player.ring2)}>
                    { 
                      <Tooltip title={bisGear.ring2} placement="top">
                        <Button sx={{ color: 'white' }}>{ bisGear.ring2.slice(0, 3) + '...' }</Button>
                      </Tooltip>
                    }
                </TableCell>
                <TableCell sx={{ padding: '0px 0px', border: '1px solid black' }}>
                  <LoadingButton
                    data-player={player.playerId}
                    variant="contained"
                    size="small"
                    sx={{
                        ml: 1,
                        mr: 1
                    }}
                    onClick={handleClick}
                    loading={loading}
                    >
                      <SyncIcon data-player={player.playerId} />
                    </LoadingButton>
                  </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
        <LoadingButton
          variant="contained"
          sx={{
              mt: 2,
              width : '30%'
          }}
          onClick={handleClickAll}
          loading={loading}
        >
          Sync All
        </LoadingButton>
      </TableContainer>
    );
  }
};

export default Spreadsheet;
