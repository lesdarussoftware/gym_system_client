import { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Tab, Tabs } from '@mui/material';

import { AuthContext } from '../providers/AuthProvider';

import { Header } from "../components/common/Header";
import { ClassesABM } from "../components/ABM/ClassesABM";
import { TeachersABM } from '../components/ABM/TeachersABM';
import { UsersABM } from '../components/ABM/UsersABM';
import { LoginForm } from '../components/common/LoginForm';
import { PacksABM } from '../components/ABM/PacksABM';

function CustomTabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
    const { children, value, index, ...other } = props;

    return (
        <div
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
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function ABMPage() {

    const { auth } = useContext(AuthContext);
    const [value, setValue] = useState(0);

    const handleChange = (_event: any, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ padding: 2 }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Clases" {...a11yProps(0)} />
                            <Tab label="Packs" {...a11yProps(1)} />
                            <Tab label="Profesores" {...a11yProps(2)} />
                            <Tab label="Usuarios" {...a11yProps(3)} />
                        </Tabs>
                        <CustomTabPanel value={value} index={0}>
                            <ClassesABM />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <PacksABM />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <TeachersABM />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
                            <UsersABM />
                        </CustomTabPanel>
                    </Box>
                </> :
                <Box sx={{ padding: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '90vh',
                        flexDirection: 'column',
                        gap: 3
                    }}>
                        <Typography variant="h2" sx={{ color: '#000' }}>
                            Iniciar sesión
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    );
}