import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import TimeInput2 from './TimeInput2.jsx';
import StyledClock from './StyledClock';

function ClockGame2({ config, progressRef }) {
    const [answer, setAnswer] = useState('00:00');
    const [status, setStatus] = useState('idle'); // idle | correct | wrong
    const [currentTime, setCurrentTime] = useState(new Date());
    const [fade, setFade] = useState(true);

    const keyboardRef = useRef(null);
    const timeInputRef = useRef(null);

    const setClockTime = (hour, minutes = 0) => {
        const time = new Date();
        time.setHours(hour, minutes, 0, 0);
        setCurrentTime(time);
    };

    const randomizeClock = () => {
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 3) * 5;
        setClockTime(randomHour, randomMinutes);
    };

    const getValidAnswersForTime = (hour, minutes) => {
        const answers = [];

        // Pad hours and minutes
        const paddedHour = hour.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');

        // Accept hour without padding
        answers.push(hour.toString());
        // Accept hour with padding
        answers.push(paddedHour);

        // Accept 12-hour format conversions
        if (hour >= 1 && hour <= 11) {
            answers.push((hour + 12).toString());
        }

        if (hour === 12) {
            answers.push('00', '12', '24');
        }

        // Accept full time with padding
        answers.push(`${paddedHour}:${paddedMinutes}`);

        // Accept time with unpadded hour
        answers.push(`${hour}:${paddedMinutes}`);

        // Accept time with unpadded minutes
        answers.push(`${paddedHour}:${minutes}`);

        // Accept time with both unpadded
        answers.push(`${hour}:${minutes}`);

        return answers;
    };

    const handleSubmit = (submittedValue) => {
        // Use the passed value if provided, otherwise use current answer
        const valueToCheck = submittedValue || answer;

        if (!valueToCheck || status === 'correct') return;

        const h = currentTime.getHours();
        const m = currentTime.getMinutes();
        const validAnswers = getValidAnswersForTime(h, m);

        if (validAnswers.includes(valueToCheck)) {
            setStatus('correct');
            progressRef.current?.handleCorrectAnswer();

            setTimeout(() => {
                setFade(false);
                setTimeout(() => {
                    randomizeClock();
                    setAnswer('00:00');
                    setFade(true);
                    setStatus('idle');
                }, 250);
            }, 600);
        } else {
            setStatus('wrong');
            progressRef.current?.handleIncorrectAnswer();
        }
    };

    // Handle TimeInput2 onChange events
    const handleTimeInputChange = (newValue) => {
        setAnswer(newValue);
    };

    // Handle virtual keyboard input
    const handleVirtualKeyPress = (button) => {
        if (status === 'correct') return;

        if (button === '{enter}') {
            // Get the committed value from TimeInput2 (with buffers committed and padded)
            const finalValue = timeInputRef.current?.commitAndSubmit();
            handleSubmit(finalValue);
        } else if (button === '{bksp}') {
            // Forward backspace to TimeInput2
            timeInputRef.current?.handleBackspace();
        } else if (/^[0-9]$/.test(button)) {
            // Forward digit to TimeInput2
            timeInputRef.current?.handleDigit(button);
        }
    };

    useEffect(() => {
        if (status === 'wrong') {
            const t = setTimeout(() => setStatus('idle'), 1000);
            return () => clearTimeout(t);
        }
    }, [status]);

    useEffect(() => {
        randomizeClock();
    }, []);

    useEffect(() => {
        keyboardRef.current?.setInput(answer.replace(':', ''));
    }, [answer]);

    return (
        <Box>
            <StyledClock currentTime={currentTime} fade={fade}>
                <TimeInput2
                    ref={timeInputRef}
                    value={answer}
                    onChange={handleTimeInputChange}
                    onSubmit={handleSubmit}
                    disabled={status === 'correct'}
                    status={status}
                />
            </StyledClock>

            {/* Temporary: Display expected answer for testing */}
            <Box display="flex" justifyContent="center" mb={2}>
                <Typography
                    variant="h6"
                    color="textSecondary"
                    sx={{
                        fontFamily: 'monospace',
                        fontSize: '1.2rem',
                        backgroundColor: '#f0f0f0',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}
                >
                    Expected: {currentTime.getHours().toString().padStart(2, '0')}:{currentTime.getMinutes().toString().padStart(2, '0')}
                </Typography>
            </Box>

            <Box mt={2} sx={{ width: 260 }}>
                <Keyboard
                    keyboardRef={(r) => (keyboardRef.current = r)}
                    layout={{
                        default: [
                            '1 2 3',
                            '4 5 6',
                            '7 8 9',
                            '{bksp} 0 {enter}',
                        ],
                    }}
                    display={{
                        '{bksp}': '⌫',
                        '{enter}': 'OK',
                    }}
                    onKeyPress={handleVirtualKeyPress}
                />
            </Box>
        </Box>
    );
}

export default ClockGame2;
