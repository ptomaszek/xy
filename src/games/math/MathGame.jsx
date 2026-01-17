// src/games/math/MathGame.js
import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LevelInfo from './LevelInfo';
import LevelProgressTracker from '../../LevelProgressTracker';
import MathQuestion from './MathQuestion';

function MathGame({ config, nextPath }) {
    const { level } = config;
    const progressRef = useRef(null);
    const navigate = useNavigate();

    // Signal to tell MathQuestion to generate a new question
    const [restartSignal, setRestartSignal] = useState(0);

    /* ===================== Handle next level ===================== */
    const handleNextLevel = () => {
        navigate(nextPath, { replace: true });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4} px={1}>
            {/* Level description */}
            <LevelInfo config={config} level={level} />

            {/* Progress Tracker */}
            <Box sx={{ minWidth: 250, maxWidth: '90%' }}>
                <LevelProgressTracker
                    key={`level-${level}`} // force remount on level change
                    ref={progressRef}
                    tasksToComplete={10}
                    maxMistakes={3}
                    onLevelRestart={() => {
                        // Just signal MathQuestion to generate a new question
                        setRestartSignal(prev => prev + 1);
                    }}
                    onNextLevel={handleNextLevel}
                />
            </Box>

            {/* Math Question */}
            <MathQuestion
                key={restartSignal} // ensures a fresh question on restart
                config={config}
                progressRef={progressRef}
            />
        </Box>
    );
}

export default MathGame;
