import { FC } from "react";
import MyLocationIcon from '@mui/icons-material/MyLocation';

import { BaseButton, BaseButtonProps } from "./base";
import { useGeolocation } from "../components";


type Props = Omit<BaseButtonProps, "children">


/**
 * Navigates to the location of the user.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
 */
export const MyLocationButton: FC<Props> = (props) => {
    console.log("[MyLocationButton] render");
    const {
        error,
        tooltip,
        handleClick,
        tracking,
        olMap,
    } = useGeolocation();

    return (
        <BaseButton
            {...props}
            color={error ? "error" : (tracking ? "success" : "primary")}
            disabled={!olMap}
            onClick={handleClick}
            tooltip={tooltip}
            leaveDelay={typeof tooltip === "string" ? 200 : 2000}
            enterDelay={typeof tooltip === "string" ? 1000 : 500}
        >
            <MyLocationIcon />
        </BaseButton>
    )
}
