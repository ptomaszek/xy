// src/games/math/MathQuestion.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import QuestionGenerator from './QuestionGenerator';

function MathQuestion({ config, progressRef }) {
    const { coefficients, operations, range } = config;

    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('idle'); // idle | correct | wrong
    const [inputBg, setInputBg] = useState('white');
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
            progressRef.current?.handleIncorrectAnswer();
            focusInput();
        }
    };

    /* ===================== Fade red background back ===================== */
    useEffect(() => {
        if (status !== 'idle') {
            const timer = setTimeout(() => {
                setInputBg('white');
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
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                opacity: fade ? 1 : 0,
                transform: fade ? 'scale(1)' : 'scale(0.98)',
                transition: 'opacity 250ms ease, transform 250ms ease',
                mt: 3,
            }}
        >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h5">
                    <InlineMath math={latexExpression} />
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

            <Box display="flex" justifyContent="center">
                <Button
                    type="submit"
                    variant="contained"
                    disabled={status === 'correct' || !answer}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        bgcolor: status === 'correct' ? '#9cc7a3' : '#007bff',
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
