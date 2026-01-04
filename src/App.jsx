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
  ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter as Router, Routes, Route, useLocation, Link as RouterLink } from 'react-router-dom';
import MathGame from './MathGame';

function AppContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Strona główna', path: '/' },
    { text: 'Gra matematyczna', path: '/games/math' },
    { text: 'Kontakt', path: '/games/contact' }
  ];

  const drawer = (
    <Box sx={{ width: 220 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.action.selected,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (location.pathname) {
      case '/games/math':
        return <MathGame />;
      case '/games/contact':
        return (
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Strona kontaktowa
            </Typography>
            <Typography variant="body1">
              To jest treść strony kontaktowej.
            </Typography>
          </Container>
        );
      default:
        return (
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Witaj na stronie głównej
            </Typography>
            <Typography variant="body1" paragraph>
              To jest responsywna strona główna stworzona z wykorzystaniem Material UI. Układ dostosowuje się do różnych rozmiarów ekranów:
            </Typography>
            <Typography variant="body1" paragraph>
              • Na ekranach komputerowych (większych niż 1024px) menu pojawia się jako pasek boczny po lewej stronie.
            </Typography>
            <Typography variant="body1" paragraph>
              • Na tabletach i ekranach mobilnych (1024px i mniejszych) menu jest ukryte i można uzyskać do niego dostęp za pomocą przycisku menu w nagłówku.
            </Typography>
            <Typography variant="body1" paragraph>
              Projekt opiera się na zasadach Material Design i zapewnia czyste, nowoczesne wrażenia użytkownika.
            </Typography>
          </Container>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
            Gry dla XY
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: 220 }, flexShrink: { md: 0 } }}
        aria-label="menu"
      >
        {/* Desktop Sidebar */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 220 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 220 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 220px)` },
          minHeight: '100vh',
          backgroundColor: '#f8f9fa'
        }}
      >
        <Toolbar />
        {renderContent()}
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
