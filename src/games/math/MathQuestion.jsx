// src/games/math/MathQuestion.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import QuestionGenerator from './QuestionGenerator';
import KaTeXComponents from './KaTeXComponents';

function MathQuestion({ config, progressRef }) {
    const { coefficients, operations, range } = config;

    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('idle'); // idle | correct | wrong
    const [inputBg, setInputBg] = useState('white');
    const [buttonBg, setButtonBg] = useState('#007bff');
    const [fade, setFade] = useState(true);

    const inputRef = useRef(null);

    /* ===================== Focus input ===================== */
    const focusInput = useCallback(() => {
        const input = inputRef.current?.querySelector('input');
        input?.focus();
        input?.select();
    }, []);

    /* ===================== Question generation ===================== */
    const questionGenerator = QuestionGenerator({
        coefficients,
        operations,
        range,
        onQuestionGenerated: () => {
            setAnswer('');
            setStatus('idle');
            setInputBg('white');
            setButtonBg('#007bff');
        },
    });

    const { numbers, operators, correctAnswer, latexExpression, generateQuestion } = questionGenerator;

    /* ===================== Submit answer ===================== */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!answer) return;

        const userAnswer = parseInt(answer, 10);

        if (userAnswer === correctAnswer) {
            setStatus('correct');
            setInputBg('#d4edda'); // green
            setButtonBg('#9cc7a3'); // green
            progressRef.current?.handleCorrectAnswer();

            setTimeout(() => {
                setFade(false);
                setTimeout(() => {
                    generateQuestion();
                    setFade(true);
                    focusInput();
                }, 250);
            }, 600);
        } else {
            setStatus('wrong');
            setInputBg('#f8d7da'); // red
            setButtonBg('#f5c6cb'); // red
            progressRef.current?.handleIncorrectAnswer();
            focusInput();
        }
    };

    /* ===================== Fade background back ===================== */
    useEffect(() => {
        if (status === 'wrong') {
            const timer = setTimeout(() => {
                setInputBg('white');
                setButtonBg('#007bff');
                setStatus('idle');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    /* ===================== Initial question ===================== */
    useEffect(() => {
        generateQuestion();
    }, []);

    useEffect(() => {
        focusInput();
    }, [numbers, operators, focusInput]);

    /* ===================== Render ===================== */
    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Question content that fades during transitions */}
            <Box
                sx={{
                    opacity: fade ? 1 : 0,
                    transform: fade ? 'scale(1)' : 'scale(0.98)',
                    transition: 'opacity 250ms ease, transform 250ms ease',
                    mt: 3,
                }}
            >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h5">
                        <KaTeXComponents math={latexExpression} />
                    </Typography>

                    <TextField
                        ref={inputRef}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        value={answer}
                        disabled={status === 'correct'}
                        onChange={(e) => setAnswer(e.target.value)}
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

            {/* Submit button that remains stable during transitions */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        bgcolor: buttonBg,
                        '&:hover': {
                            bgcolor: status === 'correct' ? '#9cc7a3' : '#0056b3',
                        },
                        color: 'white',
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                    }}
                >
                    Zatwierdź
                </Button>
            </Box>
        </Box>
    );
}

export default MathQuestion;
