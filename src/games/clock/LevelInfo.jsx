// src/games/clock/LevelInfo.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * LevelInfo component for clock game - displays a small box with level info
 * @param {Object} props
 * @param {Object} props.config - Level config (currently empty for clock game)
 * @param {number} props.level - Current level number
 */
function LevelInfo({ config, level }) {
    return (
        <Box
            sx={{
                fontSize: '0.9rem',
                fontStyle: 'italic',
                color: '#555',
                mb: 5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: '#f0f4f8',
            }}
        >
            Poziom {level}: Odczytaj godzinę z zegara analogowego. 
            Wybierz odpowiednią liczbę na klawiaturze i potwierdź.
        </Box>
    );
}

export default LevelInfo;
