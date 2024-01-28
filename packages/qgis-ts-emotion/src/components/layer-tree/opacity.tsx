import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { FC, useId } from 'react';
import { FormattedMessage } from 'react-intl';

const Input = styled(MuiInput)`
  width: 42px;
`;


export interface OpacitySliderProps {
    /**
     * The opacity of the layer.
     */
    opacity?: number;

    /**
     * The callback for changing the opacity.
     */
    onChange: (opacity: number) => void;
}


/**
 * A slider for changing the opacity of a layer.
 */
export const OpacitySlider: FC<OpacitySliderProps> = ({
    opacity,
    onChange
}) => {
    // The unique ID for the label.
    const labelId = useId();

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        onChange(newValue as number / 100.0);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(
            event.target.value === ''
                ? 1.0
                : (Number(event.target.value) / 100.0)
        );
    };

    const handleBlur = () => {
        if (opacity === undefined || opacity > 1.0) {
            onChange(1.0);
        } else if (opacity < 0) {
            onChange(0.0);
        }
    };

    const percentOpacity = typeof opacity === 'number' ? opacity * 100 : 100;

    return (
        <Box sx={{ width: 250 }}>
            <Typography id={labelId} gutterBottom>
                <FormattedMessage
                    id="map.layerTree.opacity"
                    defaultMessage="Opacity"
                />
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <VolumeUp />
                </Grid>
                <Grid item xs>
                    <Slider
                        value={percentOpacity}
                        onChange={handleSliderChange}
                        aria-labelledby={labelId}
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={percentOpacity}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 0,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': labelId,
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
