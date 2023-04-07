import { LoadingButton } from "@mui/lab";
import { Box, Button, Modal, Typography } from "@mui/material";
import AddMemberForm from "./AddMemberForm";
import { useState } from "react";
import { deleteStatic, syncAllPlayers } from "../APIutils";

export default function SpreadsheetFooter({ staticInfo, renderStatics, token, loading, setLoading }) {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const players = staticInfo.players;
    
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const handleConfirmDelete = async () => {
        await deleteStatic(staticInfo.id, token);
        renderStatics();
    }

    const handleClickAll = async () => {
        setLoading(true);
        await syncAllPlayers(players);
        renderStatics();
        setLoading(false);
    }

    return (
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
                loading={loading}
                sx={{
                    mt: 2,
                    width : '30%',
                    background: '#E71837',
                    ":hover": {
                    bgcolor: "#b9132c",
                    color: "white" 
                    }
                }}
                onClick={handleOpenDelete}
            >
                Delete Static
            </LoadingButton>
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="modal-delete-static-confirm"
            >
                <Box sx={style}>
                    <Typography id="modal-delete-static-confirm" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                        Are you sure you want to delete this static?
                    </Typography>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}>
                        <LoadingButton
                            variant="contained"
                            sx={{
                                mt: 2,
                                width : '30%'
                            }}
                            onClick={handleConfirmDelete}
                            loading={loading}
                        >
                            Yes
                        </LoadingButton>
                        <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                width : '30%'
                            }}
                            onClick={handleCloseDelete}
                        >
                            No
                        </Button>
                    </Box>
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
                Sync with Lodestone
            </LoadingButton>
        </Box>
    )
}