import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import TimeInput from './TimeInput';
import StyledClock from './StyledClock';

function ClockGame({ config, progressRef }) {
    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('idle'); // idle | correct | wrong
    const [currentTime, setCurrentTime] = useState(new Date());
    const [fade, setFade] = useState(true);

    const inputRef = useRef(null);
    const keyboardRef = useRef(null);

    /** If true, next digit replaces entire value */
    const replaceOnNextInput = useRef(false);

    const focusAndSelectInput = useCallback(() => {
        const container = inputRef.current;
        if (container) {
            container.focus();
        }
    }, []);

    // Function to set the time on the clock
    const setClockTime = (hour) => {
        const time = new Date();
        time.setHours(hour, 0, 0, 0);  // Set hour, minute to 00, seconds to 0
        setCurrentTime(time);
    };

    // Function to randomize the clock time
    const randomizeClock = () => {
        const randomHour = Math.floor(Math.random() * 12); // Choose hour from 0 to 11 (12 hours)
        setClockTime(randomHour);
    };

    // Function to handle answer submission
    const handleSubmit = () => {
        if (!answer || status === 'correct') return;

        const currentHour = currentTime.getHours();
        const validAnswers = getValidAnswersForHour(currentHour);

        if (validAnswers.includes(answer)) {
            setStatus('correct');
            progressRef.current?.handleCorrectAnswer();

            setTimeout(() => {
                setFade(false);
                setTimeout(() => {
                    randomizeClock();  // Randomize new time after correct answer
                    setAnswer('');  // Reset answer
                    setFade(true);
                    setStatus('idle');
                    focusAndSelectInput();
                }, 250);
            }, 600);
        } else {
            setStatus('wrong');
            replaceOnNextInput.current = true;
            progressRef.current?.handleIncorrectAnswer();
            focusAndSelectInput();
        }
    };

    const getValidAnswersForHour = (hour) => {
        const answers = [];

        // Add base hour (e.g., 1, 2, ..., 12)
        answers.push(hour.toString());

        // Add zero-padded version (e.g., 01, 02, ..., 12)
        answers.push(hour.toString().padStart(2, '0'));

        // Add corresponding 24-hour equivalent for hours 1-11
        if (hour >= 1 && hour <= 11) {
            answers.push((hour + 12).toString()); // Add 24-hour equivalent (1 -> 13, 2 -> 14, ..., 11 -> 23)
        }

        // Special case for hour 12
        if (hour === 12) {
            answers.push('00', '12', '24');  // For hour 12, we allow '00', '12', and '24'
        }

        return answers;
    };


    // Handle TimeInput onChange events
    const handleTimeInputChange = (newValue) => {
        setAnswer(newValue);
    };

    // Handle virtual keyboard input
    const handleVirtualKeyPress = (button) => {
        if (status === 'correct') return;

        if (button === '{bksp}') {
            inputRef.current?.handleBackspace();
        } else if (button === '{enter}') {
            // Get the committed value from TimeInput (with buffers committed and padded)
            const finalValue = inputRef.current?.commitAndSubmit();
            if (finalValue) {
                setAnswer(finalValue);
                handleSubmit();
            }
        } else if (/^[0-9]$/.test(button)) {
            // Forward digit to TimeInput
            inputRef.current?.handleDigit(button);
        }
    };

    // Reset visual error state
    useEffect(() => {
        if (status === 'wrong') {
            const timer = setTimeout(() => {
                setStatus('idle');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    // Initialize random clock time on start
    useEffect(() => {
        randomizeClock();
        focusAndSelectInput();
    }, []);

    // Keep onscreen keyboard in sync
    useEffect(() => {
        keyboardRef.current?.setInput(answer);
    }, [answer]);

    // Physical keyboard support - only for direct input, not virtual keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (status === 'correct') return;

            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                // For physical keyboard, we'll let TimeInput handle it through its own keydown handler
                // But if we need direct input, we can call the ref method
                inputRef.current?.handleDigit(e.key);
            }

            if (e.key === 'Backspace') {
                e.preventDefault();
                inputRef.current?.handleBackspace();
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                const finalValue = inputRef.current?.commitAndSubmit();
                if (finalValue) {
                    setAnswer(finalValue);
                    handleSubmit();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [status, handleSubmit]);

    return (
        <Box>
            <StyledClock currentTime={currentTime} fade={fade}>
                <TimeInput
                    ref={inputRef}
                    value={answer}
                    onChange={setAnswer}
                    onSubmit={handleSubmit}
                    disabled={status === 'correct'}
                    status={status}
                    mode="hours-only"
                />
            </StyledClock>

            {/* On-screen keyboard */}
            <Box
                mt={2}
                sx={{
                    width: 260,
                    maxWidth: '100%',
                }}
            >
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
                    buttonTheme={[
                        {
                            class:
                                status === 'correct'
                                    ? 'hg-ok-correct'
                                    : status === 'wrong'
                                        ? 'hg-ok-wrong'
                                        : 'hg-ok-idle',
                            buttons: '{enter}',
                        },
                    ]}
                    onKeyPress={handleVirtualKeyPress}
                />
            </Box>
        </Box>
    );
}

export default ClockGame;
