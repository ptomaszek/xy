import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    IconButton,
    Container,
    CssBaseline,
    Collapse,
    useTheme
} from '@mui/material';
import {
    HashRouter as Router,
    Routes,
    Route,
    Link as RouterLink,
    useLocation
} from 'react-router-dom';
import MathGame from './games/math/MathGame';


const gameConfig = {
    math: {
        title: 'Matematyka',
        path: '/games/math',
        levels: [
            { coefficients: 2, operations: ['+', '-'], range: 10 },
            { coefficients: 2, operations: ['+', '-'], range: 20 },
            { coefficients: 3, operations: ['+', '-'], range: 10 },
            { coefficients: 3, operations: ['+', '-'], range: 20 },
            { coefficients: 2, operations: ['*'], range: 10 }
        ]
    }
};

/* =========================
   MENU
   ========================= */

function MathMenu({ activePath, onItemClick }) {
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton
                    onClick={() => setOpen(o => !o)}
                    sx={{ fontWeight: 'bold' }}
                >
                    <ListItemText primary={gameConfig.math.title} />
                    {open ? '▲' : '▼'}
                </ListItemButton>
            </ListItem>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding>
                    {/* Level description */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={gameConfig.math.path}
                            selected={activePath === gameConfig.math.path}
                            onClick={onItemClick}
                            sx={{ pl: 4 }}
                        >
                            <ListItemText
                                primary="Opis poziomów"
                                primaryTypographyProps={{ fontSize: '0.8rem' }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Levels */}
                    {gameConfig.math.levels.map((config, index) => {
                        const level = index + 1;
                        const path = `${gameConfig.math.path}/levels/${level}`;

                        return (
                            <ListItem key={level} disablePadding>
                                <ListItemButton
                                    component={RouterLink}
                                    to={path}
                                    selected={activePath === path}
                                    onClick={onItemClick}
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemText primary={`Poziom ${level}`} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Collapse>
        </>
    );
}

function MenuList({ onItemClick }) {
    const location = useLocation();

    return (
        <List>
            <MathMenu
                activePath={location.pathname}
                onItemClick={onItemClick}
            />

            <ListItem disablePadding>
                <ListItemButton
                    component={RouterLink}
                    to="/games/dummy"
                    selected={location.pathname === '/games/dummy'}
                    onClick={onItemClick}
                >
                    <ListItemText primary="Dummy" />
                </ListItemButton>
            </ListItem>
        </List>
    );
}

/* =========================
   APP CONTENT
   ========================= */

function AppContent() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(o => !o);
    };

    const drawer = (
        <Box sx={{ width: 240 }}>
            <Toolbar />
            <MenuList onItemClick={handleDrawerToggle} />
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* APP BAR */}
            <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        ☰
                    </IconButton>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        color="inherit"
                        sx={{ textDecoration: 'none' }}
                    >
                        Gry dla XY
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* DRAWERS */}
            <Box component="nav" sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { width: 240 }
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { width: 240 }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* MAIN CONTENT */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 1,
                    width: { md: 'calc(100% - 240px)' },
                    backgroundColor: '#f8f9fa'
                }}
            >
                <Box sx={{ height: 24 }} />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Container maxWidth="lg">
                                <Typography variant="h5" sx={{ mt: 4 }}>
                                    Wybierz grę z menu
                                </Typography>
                            </Container>
                        }
                    />

                    <Route
                        path={gameConfig.math.path}
                        element={
                            <Container maxWidth="lg">
                                <Typography variant="h6" sx={{ mt: 4 }}>
                                    Poziomy:
                                </Typography>
                                <Typography>TODO list with descriptions</Typography>
                            </Container>
                        }
                    />

                    {gameConfig.math.levels.map((config, index) => (
                        <Route
                            key={index}
                            path={`${gameConfig.math.path}/levels/${index + 1}`}
                            element={
                                <MathGame config={{ ...config, level: index + 1 }} />
                            }
                        />
                    ))}

                    <Route
                        path="/games/dummy"
                        element={
                            <Container maxWidth="lg">
                                <Typography variant="h4">Strona Dummy</Typography>
                                <Typography>To jest treść strony Dummy.</Typography>
                            </Container>
                        }
                    />
                </Routes>
            </Box>
        </Box>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export { AppContent };
