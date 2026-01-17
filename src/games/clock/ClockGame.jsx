import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import LevelInfo from './LevelInfo';
import LevelProgressTracker from '../../LevelProgressTracker';
import ClockQuestion from './ClockQuestion';

function ClockGame({ config, nextPath }) {
    const progressRef = useRef(null);
    const navigate = useNavigate();

    const handleNextLevel = () => {
        navigate(nextPath, { replace: true });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4} px={1}>
            <LevelInfo config={config} level={1} />

            <Box sx={{ minWidth: 250, maxWidth: '90%' }}>
                <LevelProgressTracker
                    ref={progressRef}
                    tasksToComplete={10}
                    maxMistakes={3}
                    onNextLevel={handleNextLevel}
                />
            </Box>

            <ClockQuestion progressRef={progressRef} />
        </Box>
    );
}

export default ClockGame;
