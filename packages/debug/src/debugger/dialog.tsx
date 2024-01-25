import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AdbIcon from '@mui/icons-material/Adb';

import { MapDebugger } from './view';


/**
 * Properties expected by the debugger dialog.
 */
export interface DebugDialogProps {
    open: boolean;
    onClose: () => void;
}


/**
 * A dialog that displays the debugger.
 */
export function DebugDialog({ onClose, open }: DebugDialogProps) {
    return (
        <Dialog
            onClose={onClose}
            open={open}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Map Controller Context Data</DialogTitle>
            <MapDebugger />
        </Dialog>
    );
}


/**
 * An icon button that opens the debugger dialog.
 */
export function MapDebuggerDialogBtn() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={handleClickOpen} color="error">
                <AdbIcon />
            </IconButton>
            <DebugDialog
                open={open}
                onClose={handleClose}
            />
        </>
    );
}
