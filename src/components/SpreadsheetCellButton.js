import { Button, Tooltip } from "@mui/material";
import { manualToggleGearValue } from "../APIutils";

export default function SpreadsheetCellButton({ player, bisGear, gearSlot, renderStatics }) {
    const handleToggle = async (playerId, gearSlot, currentValue) => {
        const updateGearPieceObj = {};
        updateGearPieceObj[gearSlot] = !currentValue;
        
        await manualToggleGearValue(playerId, updateGearPieceObj);
        renderStatics();
    }

    return (
        <Tooltip title={bisGear[gearSlot]} placement="top">
          <Button onClick={() => {
            handleToggle(player.id, `${gearSlot}`, player[gearSlot]);
            }}
            sx={{ color: 'white' }}
          >
            { bisGear[gearSlot].slice(0, 3) + '...' }
          </Button>
        </Tooltip>
    )
}