// src/games/math/LevelInfo.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Generate a level description string based on config
 * @param {Object} config - { coefficients, operations, range }
 * @param {number} levelNumber - Current level number
 * @returns {string}
 */
const generateLevelDescription = (config, levelNumber) => {
    const { operations, range } = config;

    const operationNames = {
        '+': 'Dodawanie',
        '-': 'Odejmowanie',
        '*': 'Mnożenie',
    };

    const uniqueOperations = [...new Set(operations)];
    const operationText = uniqueOperations.map(op => operationNames[op]).join(', ');

    return `Poziom ${levelNumber}: ${operationText} w zakresie ${range}`;
};

/**
 * LevelInfo component - displays a small box with level info
 * @param {Object} props
 * @param {Object} props.config - Level config (coefficients, operations, range)
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
            {generateLevelDescription(config, level)}
        </Box>
    );
}

export default LevelInfo;
