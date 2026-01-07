// src/games/math/MathQuestion.js
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {TextField, Box, Typography} from '@mui/material';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import QuestionGenerator from './QuestionGenerator';
import KaTeXComponents from './KaTeXComponents';

function MathQuestion({config, progressRef}) {
    const {coefficients, operations, range} = config;

    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('idle'); // idle | correct | wrong
    const [inputBg, setInputBg] = useState('white');
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

    const questionGenerator = QuestionGenerator({
        coefficients,
        operations,
        range,
        onQuestionGenerated: () => {
            setAnswer('');
            keyboardRef.current?.clearInput();
            replaceOnNextInput.current = false;
            setStatus('idle');
            setInputBg('white');
        },
    });

    const {correctAnswer, latexExpression, generateQuestion} = questionGenerator;

    const handleSubmit = () => {
        if (!answer || status === 'correct') return;

        const userAnswer = parseInt(answer, 10);

        if (userAnswer === correctAnswer) {
            setStatus('correct');
            setInputBg('#d4edda');
            progressRef.current?.handleCorrectAnswer();

            setTimeout(() => {
                setFade(false);
                setTimeout(() => {
                    generateQuestion();
                    setFade(true);
                    focusAndSelectInput();
                }, 250);
            }, 600);
        } else {
            setStatus('wrong');
            setInputBg('#f8d7da');
            replaceOnNextInput.current = true;
            progressRef.current?.handleIncorrectAnswer();
            focusAndSelectInput();
        }
    };

    /** Reset visual error state */
    useEffect(() => {
        if (status === 'wrong') {
            const timer = setTimeout(() => {
                setInputBg('white');
                setStatus('idle');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    useEffect(() => {
        generateQuestion();
    }, []);

    /** Keep onscreen keyboard in sync */
    useEffect(() => {
        keyboardRef.current?.setInput(answer);
    }, [answer]);

    /** Unified input handler (used by BOTH keyboards) */
    const addDigit = (digit) => {
        setAnswer(prev => {
            if (replaceOnNextInput.current) {
                replaceOnNextInput.current = false;
                return digit;
            }
            return prev.length < 3 ? prev + digit : prev;
        });
    };

    /** Physical keyboard support */
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
                    justifyContent="center"   // 👈 center horizontally
                    gap={2}
                    mb={2}
                    sx={{
                        width: '100%',        // 👈 take full row width
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h5">
                        <KaTeXComponents math={latexExpression}/>
                    </Typography>

                    <TextField
                        ref={inputRef}
                        value={answer}
                        disabled={status === 'correct'}
                        inputProps={{readOnly: true}} // blocks mobile keyboard
                        sx={{
                            width: 70,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: inputBg,
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
                    width: 260,          // 👈 fixed keyboard width
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

export default MathQuestion;
