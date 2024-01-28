import { Button, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { useLayerTreeContext } from "./context";
import { OpacitySlider } from "./opacity";
import Stack from '@mui/material/Stack';
import { FormattedMessage } from "react-intl";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

/**
 * Properties for the layer settings component.
 */
export interface LayerSettingsProps {

}


/**
 * Settings for a layer.
 */
export const LayerSettings: FC = () => {
    const {
        currentLayer,
        overlays,
        editOverlayLayer,
        setCurrentLayer
    } = useLayerTreeContext();

    if (currentLayer === null) {
        return null;
    }

    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
                <Button
                    startIcon={<ChevronLeftIcon />}
                    size="small"
                    onClick={() => {
                        setCurrentLayer(null);
                    }}
                >
                    <FormattedMessage
                        id="map.layerTree.back"
                        defaultMessage="Back"
                    />
                </Button>
                <Typography variant="h6">
                    <FormattedMessage
                        id="map.layerTree.settings"
                        defaultMessage="Layer Settings"
                    />
                </Typography>
            </Stack>
            <TextField
                label="Name"
                size="small"
                value={overlays[currentLayer as string].title ?? ''}
                onChange={(e) => {
                    editOverlayLayer({
                        ...overlays[currentLayer as string],
                        title: e.target.value
                    })
                }}
            />
            <OpacitySlider
                opacity={overlays[currentLayer as string].opacity}
                onChange={(opacity) => {
                    editOverlayLayer({
                        ...overlays[currentLayer as string],
                        opacity
                    })
                }}
            />
            <TextField
                label="Minimum Zoom"
                size="small"
                value={overlays[currentLayer as string].minZoom ?? ''}
                onChange={(event) => {
                    editOverlayLayer({
                        ...overlays[currentLayer as string],
                        minZoom: event.target.value === ''
                            ? 0
                            : Number(event.target.value)
                    })
                }}
                inputProps={{
                    step: 1,
                    min: 0,
                    max: 100,
                    type: 'number',
                }}
            />
            <TextField
                label="Maximum Zoom"
                size="small"
                value={overlays[currentLayer as string].maxZoom ?? ''}
                onChange={(event) => {
                    editOverlayLayer({
                        ...overlays[currentLayer as string],
                        maxZoom: event.target.value === ''
                            ? 0
                            : Number(event.target.value)
                    })
                }}
                inputProps={{
                    step: 1,
                    min: 0,
                    max: 100,
                    type: 'number',
                }}
            />
        </Stack>
    )
}
