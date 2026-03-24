"use client";

import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from './Providers';
import { useContext } from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NextLink from 'next/link';

export default function Header() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: 1,
        borderBottom: 1,
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}
    >
      <Box sx={{ maxWidth: 896, mx: 'auto', px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          component={NextLink}
          href="/"
          variant="h5"
          fontWeight="bold"
          color="text.primary"
          sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
        >
          AI Digest
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
    </Box>
  );
}
