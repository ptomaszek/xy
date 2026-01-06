import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Fade
} from '@mui/material';
import { Favorite } from '@mui/icons-material';

/**
 * Reusable component for tracking level progress with configurable rules
 *
 * @param {Object} props
 * @param {number} [props.tasksToComplete=10] - Number of tasks required to complete level
 * @param {number} [props.maxMistakes=3] - Maximum allowed mistakes before level failure
 * @param {function} props.onLevelComplete - Callback when level is completed successfully
 * @param {function} props.onLevelRestart - Callback when level is restarted
 * @param {function} props.onNextLevel - Callback when user chooses to go to next level
 * @param {React.ReactNode} props.children - Child components to render (will be blocked by modals)
 * @returns {React.ReactElement}
 */
const LevelProgressTracker = forwardRef(({
                                             tasksToComplete = 10,
                                             maxMistakes = 3,
                                             onLevelComplete,
                                             onLevelRestart,
                                             onNextLevel,
                                             children
                                         }, ref) => {
    const [taskCount, setTaskCount] = useState(0);
    const [mistakeCount, setMistakeCount] = useState(0);
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLevelActive, setIsLevelActive] = useState(true);

    // Delayed open states for fade-in effect
    const [delayedFailureOpen, setDelayedFailureOpen] = useState(false);
    const [delayedSuccessOpen, setDelayedSuccessOpen] = useState(false);

    // Reset level state
    const resetLevel = () => {
        setTaskCount(0);
        setMistakeCount(0);
        setShowFailureModal(false);
        setShowSuccessModal(false);
        setDelayedFailureOpen(false);
        setDelayedSuccessOpen(false);
        setIsLevelActive(true);
        if (onLevelRestart) onLevelRestart();
    };

    // Handle correct answer
    const handleCorrectAnswer = () => {
        if (!isLevelActive) return;

        const newTaskCount = taskCount + 1;
        setTaskCount(newTaskCount);

        if (newTaskCount >= tasksToComplete) {
            setIsLevelActive(false);
            setShowSuccessModal(true);
            if (onLevelComplete) onLevelComplete();
        }
    };

    // Handle incorrect answer
    const handleIncorrectAnswer = () => {
        if (!isLevelActive) return;

        const newMistakeCount = mistakeCount + 1;
        setMistakeCount(newMistakeCount);

        if (newMistakeCount >= maxMistakes) {
            setIsLevelActive(false);
            setShowFailureModal(true);
        }
    };

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
        handleCorrectAnswer,
        handleIncorrectAnswer,
        resetLevel
    }), [handleCorrectAnswer, handleIncorrectAnswer, resetLevel]);

    // Delay failure modal opening
    useEffect(() => {
        let timer;
        if (showFailureModal) {
            timer = setTimeout(() => setDelayedFailureOpen(true), 500);
        } else {
            setDelayedFailureOpen(false);
        }
        return () => clearTimeout(timer);
    }, [showFailureModal]);

    // Delay success modal opening
    useEffect(() => {
        let timer;
        if (showSuccessModal) {
            timer = setTimeout(() => setDelayedSuccessOpen(true), 500);
        } else {
            setDelayedSuccessOpen(false);
        }
        return () => clearTimeout(timer);
    }, [showSuccessModal]);

    // Progress calculation
    const mistakesLeft = Math.max(0, maxMistakes - mistakeCount);

    return (
        <div style={{ position: 'relative' }}>
            {/* Hearts (lives) */}
            <Box sx={{ mb: 1, display: 'flex', gap: 0.5 }}>
                {Array.from({ length: maxMistakes }).map((_, index) => {
                    const isLost = index >= mistakesLeft;
                    return (
                        <Favorite
                            key={index}
                            sx={{
                                fontSize: 18,
                                color: isLost ? '#ccc' : '#f44336',
                                transition: 'color 0.3s, opacity 0.3s',
                                opacity: isLost ? 0.4 : 1,
                                transform: isLost ? 'scale(0.8)' : 'scale(1)',
                            }}
                        />
                    );
                })}
            </Box>

            {/* Chunked Progress Bar */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {Array.from({ length: tasksToComplete }).map((_, index) => {
                    const isCompleted = index < taskCount;
                    return (
                        <Box
                            key={index}
                            sx={{
                                flex: 1,
                                height: 12,
                                borderRadius: 2,
                                backgroundColor: isCompleted ? '#2196f3' : '#e0e0e0',
                                transition: 'background-color 0.3s',
                            }}
                        />
                    );
                })}
            </Box>

            {/* Child content - blocked when modal is visible */}
            <div style={{
                position: 'relative',
                opacity: showFailureModal || showSuccessModal ? 0.3 : 1,
                pointerEvents: showFailureModal || showSuccessModal ? 'none' : 'auto'
            }}>
                {children}
            </div>

            {/* Failure Modal */}
            <Dialog
                open={delayedFailureOpen}
                onClose={() => {}}
                TransitionComponent={Fade}
                transitionDuration={500}
                aria-labelledby="failure-modal-title"
                aria-describedby="failure-modal-description"
            >
                <DialogTitle id="failure-modal-title" sx={{ color: 'error.main' }}>
                    Koniec gry
                </DialogTitle>
                <DialogContent>
                    <Typography id="failure-modal-description" sx={{ mt: 1 }}>
                        Przekroczyłeś limit błędów ({maxMistakes}). Musisz zrestartować poziom.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetLevel} variant="contained" color="primary" autoFocus>
                        Restartuj poziom
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Modal */}
            <Dialog
                open={delayedSuccessOpen}
                onClose={() => {}}
                TransitionComponent={Fade}
                transitionDuration={500}
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                <DialogTitle id="success-modal-title" sx={{ color: 'success.main' }}>
                    Gratulacje! 🎉
                </DialogTitle>
                <DialogContent>
                    <Typography id="success-modal-description" sx={{ mt: 1 }}>
                        Poziom ukończony!
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <Button onClick={resetLevel} variant="outlined" color="primary">
                        Zagraj ponownie
                    </Button>
                    <Button
                        onClick={() => {
                            resetLevel();
                            if (onNextLevel) onNextLevel();
                        }}
                        variant="contained"
                        color="success"
                        autoFocus
                    >
                        Następny poziom
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});

export default LevelProgressTracker;
