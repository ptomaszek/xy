import React from 'react';
import { Box } from '@mui/material';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

/**
 * Shared StyledClock component that encapsulates the common clock styling
 * used in both ClockGame and ClockGame2
 * 
 * @param {Object} props
 * @param {Date} props.currentTime - The current time to display on the clock
 * @param {boolean} props.fade - Whether the fade animation is active
 * @param {React.ReactNode} props.children - The input component to display next to the clock
 */
function StyledClock({ currentTime, fade, children }) {
    return (
        <Box
            sx={{
                opacity: fade ? 1 : 0,
                transform: fade ? 'scale(1)' : 'scale(0.98)',
                transition: 'opacity 250ms ease, transform 250ms ease',
                mt: 3,
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="center" gap={3} mb={2}>
                <Clock
                    value={currentTime}
                    size={150}
                    renderNumbers
                    renderHourMarks
                    renderMinuteMarks={false}
                    hourHandWidth={6}
                    minuteHandWidth={4}
                    secondHandWidth={0}
                />
                {children}
            </Box>
        </Box>
    );
}

export default StyledClock;
