import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Box } from '@mui/material';

import StyledClock from './StyledClock';
import useClockQuestion from './useClockQuestion';
import NumericKeyboard from '../../components/keyboards/NumericKeyboard';
import MultiTimeInput from './MultiTimeInput';
import { getStrategy } from './clockStrategies';

function ClockQuestion({ config, progressRef }) {
    // 1. Load Strategy
    const strategy = useMemo(() => getStrategy(config.type), [config.type]);

    // 2. Unified State
    const [inputs, setInputs] = useState({ hh: '', mm: '' });
    const [activeSection, setActiveSection] = useState('hh');

    // UI State
    const [feedback, setFeedback] = useState('neutral');
    const [inputBg, setInputBg] = useState('white');
    const [fade, setFade] = useState(true);

    // Logic refs
    const replaceOnNextInput = useRef(false);

    const { currentTime, correctAnswer, generateQuestion } = useClockQuestion({
        minHour: 1,
        maxHour: 12,
        includeMinutes: strategy.includeMinutesInClock,
        minuteStep: strategy.minuteStep || 5,
        onQuestionGenerated: () => {
            setInputs({ hh: '', mm: '' });
            setActiveSection('hh'); // Always reset to first section
            replaceOnNextInput.current = false;
            setInputBg('white');
        },
    });

    useEffect(() => {
        generateQuestion();
    }, []);

    // 3. Generic Input Handler
    const handleInput = useCallback((key) => {
        if (feedback !== 'neutral') return;

        // Determine which field we are editing
        const field = activeSection;

        if (key === 'Backspace' || key === '{bksp}') {
            setInputs(prev => ({ ...prev, [field]: prev[field].slice(0, -1) }));
            return;
        }

        if (/^\d$/.test(key)) {
            setInputs(prev => {
                // If we flagged to replace (e.g., after an error), clear first
                const currentVal = replaceOnNextInput.current ? '' : prev[field];
                if (replaceOnNextInput.current) replaceOnNextInput.current = false;

                // Simple length limit (2 digits)
                if (currentVal.length >= 2) return prev;

                return { ...prev, [field]: currentVal + key };
            });

            // Optional: Auto-advance focus if 2 digits entered?
            // if (strategy.sections.includes('mm') && field === 'hh' && newVal.length === 2) setActiveSection('mm');
        }
    }, [activeSection, feedback]);

    // 4. Generic Submission
    const submitAnswer = useCallback(() => {
        // Ensure all required fields are filled
        const isComplete = strategy.sections.every(sec => inputs[sec] !== '');

        if (!isComplete) return;

        const isCorrect = strategy.isCorrect(inputs, correctAnswer);

        if (isCorrect) {
            progressRef.current?.handleCorrectAnswer();
            setFeedback('correct');
            setInputBg('#d4edda');

            setTimeout(() => {
                setFade(false);
                setTimeout(() => {
                    generateQuestion();
                    setFade(true);
                    setFeedback('neutral');
                }, 250);
            }, 600);
        } else {
            progressRef.current?.handleIncorrectAnswer();
            setFeedback('wrong');
            setInputBg('#f8d7da');
            replaceOnNextInput.current = true;

            setTimeout(() => {
                setFeedback('neutral');
                setInputBg('white');
                // Don't clear inputs, let user fix them
            }, 1000);
        }
    }, [inputs, strategy, correctAnswer, generateQuestion, progressRef]);

    // Keyboard Listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') submitAnswer();
            else handleInput(e.key);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleInput, submitAnswer]);

    const handleVirtualKey = (key) => {
        if (key === '{enter}') submitAnswer();
        else handleInput(key);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <StyledClock currentTime={currentTime} />

            <Box mt={1}>
                <Box sx={{
                    opacity: fade ? 1 : 0,
                    transform: fade ? 'scale(1)' : 'scale(0.98)',
                    transition: 'opacity 250ms ease, transform 250ms ease',
                }}>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                        <MultiTimeInput
                            sections={strategy.sections} // Dynamic sections!
                            values={inputs}              // Always an object
                            activeSection={activeSection}
                            bgcolor={inputBg}
                            disabled={feedback !== 'neutral'}
                            onSectionClick={setActiveSection}
                        />
                    </Box>
                </Box>

                <NumericKeyboard width={260} onKeyPress={handleVirtualKey} />
            </Box>
        </Box>
    );
}

export default ClockQuestion;