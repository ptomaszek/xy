import React, {useState, useRef} from 'react';
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
import ClockGame from './games/clock/ClockGame';
import LevelProgressTracker from './LevelProgressTracker';


const gameConfig = {
    math: {
        title: 'Matematyka',
        path: '/games/math',
        groups: [
            {
                title: 'Dodawanie i odejmowanie',
                id: 'add-sub',
                levels: [
                    {coefficients: 2, operations: ['+', '-'], range: 10},
                    {coefficients: 3, operations: ['+', '-'], range: 10},
                    {coefficients: 2, operations: ['+', '-'], range: 20},
                    {coefficients: 3, operations: ['+', '-'], range: 20},
                    {coefficients: 2, operations: ['+', '-'], range: 50},
                    {coefficients: 3, operations: ['+', '-'], range: 50},
                ]
            },
            {
                title: 'Mnożenie',
                id: 'mul',
                levels: [
                    {coefficients: 2, operations: ['*'], range: 10},
                    {coefficients: 2, operations: ['*'], range: 20},
                    {coefficients: 2, operations: ['*'], range: 50},
                    {coefficients: 3, operations: ['*'], range: 50},
                ]
            }
        ]
    },

    clock: {
        title: 'Zegar',
        path: '/games/clock',
        groups: [
            {
                title: 'Godziny',
                id: 'hours',
                levels: [
                    { type: 'full-hours' },
                    { type: 'hours-minutes-5' },
                ]
            }
        ],
    },
};

/* =========================
   MENU
   ========================= */

function GameMenuGroup({group, gamePath, activePath, onItemClick}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpen(o => !o)} sx={{pl: 4}}>
                    <ListItemText
                        primary={group.title}
                        primaryTypographyProps={{fontSize: '0.9rem'}}
                    />
                    {open ? '▲' : '▼'}
                </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding>
                    {group.levels.map((_, index) => {
                        const level = index + 1;
                        const path = `${gamePath}/${group.id}/levels/${level}`;

                        return (
                            <ListItem key={level} disablePadding>
                                <ListItemButton
                                    component={RouterLink}
                                    to={path}
                                    selected={activePath === path}
                                    onClick={onItemClick}
                                    sx={{pl: 6}}
                                >
                                    <ListItemText
                                        primary={`Poziom ${level}`}
                                        primaryTypographyProps={{fontSize: '0.85rem'}}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Collapse>
        </>
    );
}

function GameMenu({game, activePath, onItemClick}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpen(o => !o)}>
                    <ListItemText primary={game.title}/>
                    {open ? '▲' : '▼'}
                </ListItemButton>
            </ListItem>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding>
                    {game.groups.map((group) => (
                        <GameMenuGroup
                            key={group.id}
                            group={group}
                            gamePath={game.path}
                            activePath={activePath}
                            onItemClick={onItemClick}
                        />
                    ))}
                </List>
            </Collapse>
        </>
    );
}

function MenuList({onItemClick}) {
    const location = useLocation();

    return (
        <List>
            <GameMenu
                game={gameConfig.math}
                activePath={location.pathname}
                onItemClick={onItemClick}
            />
            <GameMenu
                game={gameConfig.clock}
                activePath={location.pathname}
                onItemClick={onItemClick}
            />
        </List>
    );
}

/* =========================
   APP CONTENT
   ========================= */

function AppContent() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const progressRef = useRef(null);

    const handleDrawerToggle = () => {
        setMobileOpen(o => !o);
    };

    // Calculate all levels in order to determine "next" level
    const allLevelRoutes = Object.entries(gameConfig).flatMap(([gameKey, game]) =>
        game.groups.flatMap(group =>
            group.levels.map((config, index) => ({
                path: `${game.path}/${group.id}/levels/${index + 1}`,
                gameKey,
                config,
                index
            }))
        )
    );

    const drawer = (
        <Box sx={{width: 240}}>
            <Toolbar/>
            <MenuList onItemClick={handleDrawerToggle}/>
        </Box>
    );

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>

            {/* APP BAR */}
            <AppBar position="fixed" sx={{zIndex: theme => theme.zIndex.drawer + 1}}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {md: 'none'}}}
                    >
                        ☰
                    </IconButton>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        color="inherit"
                        sx={{textDecoration: 'none'}}
                    >
                        Cześć!
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* DRAWERS */}
            <Box component="nav" sx={{width: {md: 240}, flexShrink: {md: 0}}}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{keepMounted: true}}
                    sx={{
                        display: {xs: 'block', md: 'none'},
                        '& .MuiDrawer-paper': {width: 240}
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', md: 'block'},
                        '& .MuiDrawer-paper': {width: 240}
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
                    width: {md: 'calc(100% - 240px)'},
                    backgroundColor: '#f8f9fa'
                }}
            >
                <Box sx={{height: 24}}/>

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

                    {allLevelRoutes.map((route, i) => {
                        const nextPath = allLevelRoutes[i + 1]?.path || '/';
                        const GameComponent = route.gameKey === 'math' ? MathGame : ClockGame;

                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <GameComponent
                                        config={{ ...route.config, level: route.index + 1 }}
                                        nextPath={nextPath}
                                        progressRef={progressRef}
                                    />
                                }
                            />
                        );
                    })}

                </Routes>
            </Box>
        </Box>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent/>
        </Router>
    );
}

export {AppContent};
