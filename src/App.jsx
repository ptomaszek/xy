import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Typography,
    IconButton,
    Container,
    CssBaseline,
    useTheme,
    ListItemButton,
    Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { HashRouter as Router, useLocation, useNavigate, Link as RouterLink, Routes, Route } from 'react-router-dom';
import MathGame from './games/math/MathGame';

// Centralized game configuration - focus on actual game parameters only
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

// Auto-generate menu items from game configuration
const menuItems = [
    {
        text: gameConfig.math.title,
        path: gameConfig.math.path,
        subitems: gameConfig.math.levels.map((config, index) => ({
            id: index + 1,
            text: `Poziom ${index + 1}`,
            path: `${gameConfig.math.path}/levels/${index + 1}`,
            config: { ...config, level: index + 1 }
        }))
    },
    { text: 'Dummy', path: '/games/dummy' }
];

const MenuItem = ({ item, depth = 0, onItemClick, activePath }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const hasSubitems = item.subitems && item.subitems.length > 0;
    const isActive = activePath === item.path;

    const handleClick = () => {
        if (hasSubitems) {
            setOpen(!open);
        } else {
            onItemClick();
        }
    };

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton
                    component={hasSubitems ? 'div' : RouterLink}
                    to={hasSubitems ? undefined : item.path}
                    onClick={handleClick}
                    sx={{
                        borderRadius: 1,
                        pl: 2 + depth * 2,
                        backgroundColor: isActive ? theme.palette.action.selected : 'inherit',
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover
                        }
                    }}
                >
                    <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                            fontSize: depth > 0 ? '0.875rem' : '1rem',
                            fontWeight: hasSubitems ? 'bold' : 'normal'
                        }}
                    />
                    {hasSubitems ? (open ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItemButton>
            </ListItem>
            {hasSubitems && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.subitems.map((subitem, index) => (
                            <MenuItem
                                key={index}
                                item={subitem}
                                depth={depth + 1}
                                onItemClick={onItemClick}
                                activePath={activePath}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

const MenuList = ({ onItemClick = () => { }, activePath }) => {
    return (
        <List>
            {menuItems.map((item, index) => (
                <MenuItem
                    key={index}
                    item={item}
                    onItemClick={onItemClick}
                    activePath={activePath}
                />
            ))}
        </List>
    );
};

function AppContent() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    const drawer = (
        <Box sx={{ width: 240 }} role="presentation">
            <Toolbar />
            <MenuList onItemClick={handleDrawerToggle} activePath={location.pathname} />
        </Box>
    );

    // Dynamically generate routes from menuItems config
    const generateRoutes = () => {
        const routes = [];
        menuItems.forEach(item => {
            if (item.subitems) {
                item.subitems.forEach(subitem => {
                    // Specific route for MathGame levels
                    if (subitem.path.startsWith('/games/math/levels/')) {
                        routes.push(
                            <Route
                                key={subitem.path}
                                path={subitem.path}
                                element={<MathGame config={subitem.config} />}
                            />
                        );
                    } else {
                        // Generic subitem route
                        routes.push(
                            <Route
                                key={subitem.path}
                                path={subitem.path}
                                element={subitem.element || <MathGame config={subitem.config} />} // Fallback to MathGame if no element
                            />
                        );
                    }
                });
            } else if (item.path === '/games/dummy') {
                routes.push(
                    <Route
                        key={item.path}
                        path={item.path}
                        element={
                            <Container maxWidth="lg">
                                <Typography variant="h4" gutterBottom>
                                    Strona Dummy
                                </Typography>
                                <Typography variant="body1">To jest treść strony Dummy.</Typography>
                            </Container>
                        }
                    />
                );
            }
        });
        return routes;
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ cursor: 'pointer' }}
                        component={RouterLink}
                        to="/"
                        color="inherit"
                        style={{ textDecoration: 'none' }}
                    >
                        Gry dla XY
                    </Typography>
                </Toolbar>
            </AppBar>

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
                    open
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { width: 240 }
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: 'calc(100% - 240px)' },
                    backgroundColor: '#f8f9fa'
                }}
            >
                <Box sx={{ height: 24 }} />  {/* Much smaller than Toolbar's default height */}
                <Routes>
                    {generateRoutes()}
                    <Route
                        path="/"
                        element={
                            <Container maxWidth="lg">
                                <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
                                    Dostępne gry:
                                </Typography>
                                <MenuList activePath={location.pathname} />
                            </Container>
                        }
                    />
                    <Route path="/games/math" element={
                        <Container maxWidth="lg">
                            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
                                Wybierz poziom gry matematycznej:
                            </Typography>
                            <MenuList activePath={location.pathname} />
                        </Container>
                    } />
                </Routes>
            </Box>
        </Box>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
export { AppContent };
