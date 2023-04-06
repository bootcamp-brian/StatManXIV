import { Autocomplete, FormControl, TextField} from "@mui/material"
import { useEffect, useState } from "react";
import { getGearSlotList } from "../proxy";

export default function GearSlotSelectField({ gearSlot}) {
    const [currentGearSlot, setCurrentGearSlot] = useState('');
    const [currentGearSlotOptions, setCurrentGearSlotOptions] = useState([]);
    const lowerJoinedGearSlot = gearSlot.replace(' ', '').toLowerCase();
        
    const handleGearSlotSelect = async (event, newValue) => {
        setCurrentGearSlot(newValue);
    };

    useEffect(() => {
        const getOptions = async () => {
            const options = await getGearSlotList(gearSlot.replace(' ', ''));
            console.log(options)
            const optionNames = options.gearSlotList.map(option => option.Name);
            setCurrentGearSlotOptions(optionNames);
        }
        getOptions();
    }, []);

    return (
        <FormControl
            margin="normal"
            required
            sx={{
                width: '50%',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Autocomplete
                disablePortal
                id={`${lowerJoinedGearSlot}-autocomplete`}
                options={currentGearSlotOptions}
                sx={{ width: 300 }}
                onChange={(event, newValue) => {
                    handleGearSlotSelect(event, newValue);
                }}
                renderInput={(params) => <TextField {...params} label={gearSlot} />}
            />
        </FormControl>
    )
}