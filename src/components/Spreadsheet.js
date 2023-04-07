import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Typography, Box, Button } from '@mui/material';
import { deleteStaticMember, manualToggleGearValue } from '../proxy';
import { LoadingButton } from '@mui/lab';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SpreadsheetFooter from './SpreadsheetFooter';
import PlayerInfoEditForm from './PlayerInfoEditForm';
import SpreadsheetCellButton from './SpreadsheetCellButton';

const Spreadsheet = ({ staticInfo, renderStatics, token }) => {
  const [loading, setLoading] = useState(false);
  const players = staticInfo.players.sort((a, b) => {
    const nameA = a.character.toUpperCase();
    const nameB = b.character.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const headerStyle = {
    width: 75,
    padding: "0px 0px",
    border: '1px solid black',
    textAlign: 'center',
    backgroundColor: '#a7acac' };
    
  const cellStyle = (cellValue) => {
    return {
      textAlign: 'center',
      padding: '0px 0px',
      border: '1px solid black',
      backgroundColor: cellValue ? '#0d561a' : '#760006'
    };
  }
  const cellTypeStyle = { color: 'white' }
  
  // const handleClick = async (playerId) => {
  //   setLoading(true);
  //   await syncPlayer(playerId);
  //   renderStatics();
  //   setLoading(false);
  // }

  const handleRemoveButtonClick = async (playerId) => {
    setLoading(true);
    await deleteStaticMember(playerId, token);
    renderStatics();
    setLoading(false);
  }

  if (players) {
    return (
      <TableContainer
        component={Paper}
        sx={{
          mt: 7,
          padding: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        elevation={12}
      >
        <Typography variant='h2' component="h2" mb={2}>{staticInfo.name}</Typography>
        {
          players.length > 0 ?
          <Table aria-label="spreadsheet">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 120, border: '1px solid black', backgroundColor: '#a7acac' }}>Character Name</TableCell>
                <TableCell sx={headerStyle}>Job</TableCell>
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
                <TableCell sx={headerStyle}>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => {
                const { bisGear } = player;
                return (
                <TableRow key={player.id}>
                  <TableCell component="th" scope="row" sx={{ border: '1px solid black', paddingRight: 0 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Typography variant="subtitle2" component="p">{ player.character.toUpperCase() }</Typography>
                      <Tooltip title="Remove">
                        <LoadingButton
                          loading={loading}
                          type="button"
                          size="small"
                          onClick={() => {
                            handleRemoveButtonClick(player.id);
                          }}
                          sx={{
                            color: '#E71837',
                            ":hover": {
                                color: "#b9132c"
                              }
                          }}>
                            <RemoveCircleIcon />
                          </LoadingButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ padding: '0px 0px', textAlign: 'center', border: '1px solid black' }}>
                    <Typography>{ player.job.toUpperCase() }</Typography>
                  </TableCell>
                  <TableCell sx={cellStyle(player.mainhand)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='mainhand' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={player.job === 'pld' ? cellStyle(player.offhand) : { padding: '0px 0px', textAlign: 'center', border: '1px solid black' }}>
                    { player.job !== 'pld' ? 'N/A' : 
                      (
                        <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='offhand' renderStatics={renderStatics} />
                      )
                    }
                  </TableCell>
                  <TableCell sx={cellStyle(player.head)}> 
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='head' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={cellStyle(player.body)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='body' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={cellStyle(player.hands)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='hands' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={cellStyle(player.legs)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='legs' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={cellStyle(player.feet)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='feet' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={cellStyle(player.earrings)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='earrings' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={cellStyle(player.necklace)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='necklace' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={cellStyle(player.bracelets)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='bracelets' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={cellStyle(player.ring1)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='ring1' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={cellStyle(player.ring2)}>
                    <SpreadsheetCellButton player={player} bisGear={bisGear} gearSlot='ring2' renderStatics={renderStatics} />
                  </TableCell>
                  <TableCell sx={{ padding: '0px 0px', border: '1px solid black' }}>
                    <PlayerInfoEditForm token={token} playerId={player.id} renderStatics={renderStatics} loading={loading} setLoading={setLoading} />
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
          :
          <Typography variant="h4" component="span" sx={{ justifySelf: 'center' }}>{staticInfo.name} doesn't have any memebers yet.</Typography>
        }
        <SpreadsheetFooter staticInfo={staticInfo} renderStatics={renderStatics} token={token} loading={loading} setLoading={setLoading} />
      </TableContainer>
    );
  }
};

export default Spreadsheet;
