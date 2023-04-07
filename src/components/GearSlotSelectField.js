import { Autocomplete, FormControl, TextField} from "@mui/material"
import { useEffect, useState } from "react";
import { getGearSlotList } from "../proxy";

export default function GearSlotSelectField({ gearSlot, setFunction, job }) {
    const [currentGearSlotOptions, setCurrentGearSlotOptions] = useState([]);
    const lowerJoinedGearSlot = gearSlot.replace(' ', '').toLowerCase();
        
    const handleGearSlotSelect = async (event, newValue) => {
        setFunction(newValue);
    };

    useEffect(() => {
        const getOptions = async () => {
            if (job) {
                const options = await getGearSlotList(gearSlot.replace(' ', ''), job);
                const optionNames = options.gearSlotList.map(option => option.Name);
                setCurrentGearSlotOptions(optionNames);
            }
        }
        getOptions();
    }, [job]);

    return (
        <FormControl
            margin="normal"
            required
            error={true}
            sx={{
                width: '50%',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Autocomplete
                disabled={job !== 'pld' && gearSlot === 'Off Hand' ? true : false}
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