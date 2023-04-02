import { Box } from "@mui/system"
import { TextField, Button } from "@mui/material"
import { getCharacterProxy } from "./proxy";

function Form() {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name').toLowerCase();
        const nameParam = name.replaceAll(' ', '+');

        const id = await getCharacterProxy(nameParam, 'malboro')
        console.log(nameParam)
        console.log(id)
    }
    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Character Name"
                name="name"
                autoFocus
            />
            <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            >
            Submit
            </Button>
        </Box>
    )
}

export default Form;