import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip, Typography, Modal, Box } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { deleteStaticMember, syncAllPlayers, syncPlayer } from '../proxy';
import { LoadingButton } from '@mui/lab';
import AddMemberForm from './AddMemberForm';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const Spreadsheet = ({ staticInfo, renderStatics, token }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const players = staticInfo.players;

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
  const cellTypeStyle = { color: 'white', 
    ":hover": {
      cursor: 'default'
    }
  }
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
  
  const handleClick = async (playerId) => {
    setLoading(true);
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

  const handleRemoveButtonClick = async (playerId) => {
    setLoading(true);
    await deleteStaticMember(playerId, staticInfo.id, token);
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
                  <TableCell component="th" scope="row" sx={{ border: '1px solid black', paddingRight: 0 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Typography variant="subtitle2" component="p">{player.character}</Typography>
                      <Tooltip title="Remove">
                        <LoadingButton
                          loading={loading}
                          type="button"
                          size="small"
                          onClick={() => {
                            handleRemoveButtonClick(player.playerId);
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
                  <TableCell sx={cellStyle(player.mainhand)}>
                      { 
                        <Tooltip title={bisGear.mainhand} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.mainhand.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={player.job === 'pld' ? cellStyle(player.offhand) : { padding: '0px 0px', textAlign: 'center', border: '1px solid black' }}>
                    { player.job !== 'pld' ? 'N/A' : 
                      (
                        
                        <Tooltip title={bisGear.offhand} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.offhand.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      )
                    }
                  </TableCell>
                  <TableCell sx={cellStyle(player.head)}>
                      { 
                        <Tooltip title={bisGear.head} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.head.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={cellStyle(player.body)}>
                      { 
                        <Tooltip title={bisGear.body} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.body.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={cellStyle(player.hands)}>
                      { 
                        <Tooltip title={bisGear.hands} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.hands.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={cellStyle(player.legs)}>
                      { 
                        <Tooltip title={bisGear.legs} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.legs.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={cellStyle(player.feet)}>
                      { 
                        <Tooltip title={bisGear.feet} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.feet.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={cellStyle(player.earrings)}>
                      { 
                        <Tooltip title={bisGear.earrings} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.earrings.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={cellStyle(player.necklace)}>
                      { 
                        <Tooltip title={bisGear.necklace} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.necklace.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={cellStyle(player.bracelets)}>
                      { 
                        <Tooltip title={bisGear.bracelets} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.bracelets.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={cellStyle(player.ring1)}>
                      { 
                        <Tooltip title={bisGear.ring1} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.ring1.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={cellStyle(player.ring2)}>
                      { 
                        <Tooltip title={bisGear.ring2} placement="top">
                          <Typography sx={cellTypeStyle}>{ bisGear.ring2.slice(0, 3) + '...' }</Typography>
                        </Tooltip>
                      }
                  </TableCell>
                  <TableCell sx={{ padding: '0px 0px', border: '1px solid black' }}>
                    <Tooltip title="Sync">
                      <LoadingButton
                        variant="contained"
                        size="small"
                        sx={{
                            ml: 1,
                            mr: 1
                        }}
                        onClick={() => {
                          handleClick(player.playerId);
                        }}
                        loading={loading}
                        >
                          <SyncIcon />
                        </LoadingButton>
                      </Tooltip>
                    </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
          :
          <Typography variant="h4" component="span" sx={{ justifySelf: 'center' }}>{staticInfo.name} doesn't have any memebers yet.</Typography>
        }
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <LoadingButton 
            variant="contained"
            loading={loading}
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
            + Add Member
          </LoadingButton>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-add-member-form"
          >
            <Box sx={style}>
              {
                players.length >= 8 ?
                    <Typography id="modal-add-member-form" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                      The static is full. Cannot add new members.
                    </Typography>
                :
                <>
                  <Typography id="modal-add-member-form" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                    Add New Member
                  </Typography>
                  <AddMemberForm staticInfo={staticInfo} renderStatics={renderStatics} handleClose={handleClose} token={token}/>
                </>
              }
            </Box>
          </Modal>
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
        </Box>
      </TableContainer>
    );
  }
};

export default Spreadsheet;
