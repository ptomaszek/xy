import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';

import StyledClock from './StyledClock';
import useClockQuestion from './useClockQuestion';
import NumericKeyboard from '../../components/keyboards/NumericKeyboard';

/* =========================
   HOUR VALIDATION + NORMALIZATION
   ========================= */

/**
 * Validates input hour and converts it to analog hour (1–12).
 * Returns:
 *   - number (1–12) if valid
 *   - null if invalid
 */
const normalizeAnalogHour = (value) => {
    const hour = Number(value);
    if (!Number.isInteger(hour)) return null;
    if (hour < 0 || hour > 24) return null;

    // Analog clocks are modulo-12 systems
    const analog = hour % 12;
    return analog === 0 ? 12 : analog;
};

function ClockQuestion({ progressRef }) {
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState('neutral'); // neutral | wrong | correct

    const {
        currentTime,
        correctAnswer, // ALWAYS 1–12
        generateQuestion,
    } = useClockQuestion({
        minHour: 1,
        maxHour: 12,
        onQuestionGenerated: () => setInput(''),
    });

    useEffect(() => {
        generateQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitAnswer = useCallback(() => {
        if (!input) return;

        const normalized = normalizeAnalogHour(input);

        if (normalized === null) {
            progressRef.current?.handleIncorrectAnswer();
            setFeedback('wrong');
            setTimeout(() => setFeedback('neutral'), 300);
            return;
        }

        if (normalized === correctAnswer) {
            progressRef.current?.handleCorrectAnswer();
            setFeedback('correct');

            setTimeout(() => {
                generateQuestion();
                setInput('');
                setFeedback('neutral');
            }, 300);
        } else {
            progressRef.current?.handleIncorrectAnswer();
            setFeedback('wrong');
            setTimeout(() => setFeedback('neutral'), 300);
        }
    }, [input, correctAnswer, generateQuestion, progressRef]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (feedback !== 'neutral') return;

            if (e.key === 'Enter') {
                submitAnswer();
                return;
            }

            if (e.key === 'Backspace') {
                setInput(prev => prev.slice(0, -1));
                return;
            }

            if (/^\d$/.test(e.key)) {
                setInput(prev => (prev.length < 2 ? prev + e.key : prev));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [submitAnswer, feedback]);

    const handleVirtualKey = (key) => {
        if (feedback !== 'neutral') return;

        if (key === '{enter}') submitAnswer();
        else if (key === '{bksp}') setInput(prev => prev.slice(0, -1));
        else if (/^\d$/.test(key)) {
            setInput(prev => (prev.length < 2 ? prev + key : prev));
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <StyledClock currentTime={currentTime} />

            <Box mt={1}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                    <Box
                        sx={{
                            borderRadius: 2,
                            padding: 1,
                            transition: 'all 200ms ease',
                            backgroundColor:
                                feedback === 'wrong'
                                    ? 'rgb(248, 215, 218)'
                                    : feedback === 'correct'
                                        ? 'rgb(212, 237, 218)'
                                        : 'transparent',
                            boxShadow:
                                feedback === 'wrong'
                                    ? '0 0 0 2px rgba(220, 53, 69, 0.4)'
                                    : feedback === 'correct'
                                        ? '0 0 0 2px rgba(40, 167, 69, 0.4)'
                                        : 'none',
                            pointerEvents: feedback !== 'neutral' ? 'none' : 'auto',
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enUS}>
                            <TimeField
                                value={input ? new Date(0, 0, 0, Number(input)) : null}
                                format="HH"

                                sx={{
                                    width: 120,
                                    '& input': {
                                        textAlign: 'center',
                                        fontSize: '1.6rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Box>

                    <NumericKeyboard
                        width={180}
                        onKeyPress={handleVirtualKey}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default ClockQuestion;
