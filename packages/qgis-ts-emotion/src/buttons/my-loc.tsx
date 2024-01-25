import { FC } from "react"
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { BaseButton, BaseButtonProps } from "./base";


/**
 * Navigates to the location of the user.
 */
export const MyLocationButton: FC<Omit<BaseButtonProps, "children">> = (props) => {
    return (
        <BaseButton {...props}>
            <MyLocationIcon />
        </BaseButton>
    )
}
