import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

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
        const input = inputRef.current?.querySelector('input');
        if (input) {
            input.focus();
            input.select();
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

    // Function to generate all valid answers for a given hour
    const getValidAnswersForHour = (hour) => {
        const answers = [];
        
        // Add base hour
        answers.push(hour.toString());
        
        // For hour 0 add alternative forms
        if (hour === 0) {
            answers.push('00', '12', '24');
        } else if (hour >= 1 && hour <= 11) {
            // For hours 1-11 add 12-hour and 24-hour versions
            answers.push((hour + 12).toString());
        }
        
        return answers;
    };

    // Function to add digits to the answer
    const addDigit = (digit) => {
        setAnswer(prev => {
            if (replaceOnNextInput.current) {
                replaceOnNextInput.current = false;
                return digit;
            }
            return prev.length < 2 ? prev + digit : prev;
        });
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

    // Physical keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (status === 'correct') return;

            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                addDigit(e.key);
            }

            if (e.key === 'Backspace') {
                e.preventDefault();
                setAnswer(prev => prev.slice(0, -1));
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [status, handleSubmit]);

    return (
        <Box>
            <Box
                sx={{
                    opacity: fade ? 1 : 0,
                    transform: fade ? 'scale(1)' : 'scale(0.98)',
                    transition: 'opacity 250ms ease, transform 250ms ease',
                    mt: 3,
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    mb={2}
                    sx={{
                        width: '100%',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h5">
                        <Clock
                            value={currentTime}
                            size={150}
                            renderNumbers={true}
                            renderHourMarks={true}
                            renderMinuteMarks={false}
                            hourHandWidth={6}
                            minuteHandWidth={0}
                            secondHandWidth={0}
                        />
                    </Typography>

                    <TextField
                        ref={inputRef}
                        value={answer}
                        disabled={status === 'correct'}
                        inputProps={{readOnly: true}}
                        sx={{
                            width: 70,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: status === 'correct' ? '#d4edda' : status === 'wrong' ? '#f8d7da' : 'white',
                                transition: 'background-color 0.5s ease',
                            },
                        }}
                    />
                </Box>
            </Box>

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
                    onKeyPress={(button) => {
                        if (status === 'correct') return;

                        if (button === '{bksp}') {
                            setAnswer(prev => prev.slice(0, -1));
                        } else if (button === '{enter}') {
                            handleSubmit();
                        } else {
                            addDigit(button);
                        }
                    }}
                />
            </Box>
        </Box>
    );
}

export default ClockGame;
