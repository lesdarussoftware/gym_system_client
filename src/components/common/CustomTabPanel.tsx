/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";

export function CustomTabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {

    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ paddingY: 1 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </Box>
    );
}