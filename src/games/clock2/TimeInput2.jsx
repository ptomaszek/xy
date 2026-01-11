import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography } from '@mui/material';

const TimeInput2 = forwardRef(({ value, onChange, onSubmit, disabled, status }, ref) => {
    // Parse initial value into hours and minutes
    const parseTime = (timeString) => {
        const [hours = '00', minutes = '00'] = timeString.split(':');
        return {
            hours: hours.padStart(2, '0'),
            minutes: minutes.padStart(2, '0')
        };
    };

    const initialTime = parseTime(value || '00:00');

    // State management
    const [committedHours, setCommittedHours] = useState(initialTime.hours);
    const [committedMinutes, setCommittedMinutes] = useState(initialTime.minutes);
    const [hoursBuffer, setHoursBuffer] = useState('');
    const [minutesBuffer, setMinutesBuffer] = useState('');
    const [activeSection, setActiveSection] = useState('hours');
    const [userHasInteracted, setUserHasInteracted] = useState(false);

    const hoursRef = useRef(null);
    const minutesRef = useRef(null);
    const containerRef = useRef(null);

    // Get background color based on status
    const getBackgroundColor = () => {
        if (status === 'correct') return '#d4edda';
        if (status === 'wrong') return '#f8d7da';
        return 'white';
    };

    // Get active section background color
    const getActiveSectionColor = () => {
        // Don't show active section color if there's a status
        if (status === 'correct' || status === 'wrong') return 'transparent';
        return '#e3f2fd'; // Light blue for active section
    };

    // Commit buffer to committed value
    const commitBuffer = (section) => {
        if (section === 'hours') {
            if (hoursBuffer) {
                const paddedHours = hoursBuffer.padStart(2, '0');
                // Validate hours (00-23)
                const hourNum = parseInt(paddedHours, 10);
                const validHours = hourNum <= 23 ? paddedHours : '23';
                setCommittedHours(validHours);
                setHoursBuffer('');

                // Update parent with new time
                const newValue = `${validHours}:${committedMinutes}`;
                onChange(newValue);
                return validHours;
            }
            return committedHours;
        } else {
            if (minutesBuffer) {
                const paddedMinutes = minutesBuffer.padStart(2, '0');
                // Validate minutes (00-59)
                const minuteNum = parseInt(paddedMinutes, 10);
                const validMinutes = minuteNum <= 59 ? paddedMinutes : '59';
                setCommittedMinutes(validMinutes);
                setMinutesBuffer('');

                // Update parent with new time
                const newValue = `${committedHours}:${validMinutes}`;
                onChange(newValue);
                return validMinutes;
            }
            return committedMinutes;
        }
    };

    // Handle digit input
    const handleDigitInput = (digit) => {
        if (disabled) return;

        setUserHasInteracted(true);

        if (activeSection === 'hours') {
            const newBuffer = hoursBuffer + digit;
            if (newBuffer.length <= 2) {
                setHoursBuffer(newBuffer);

                // If buffer is now 2 digits, validate and commit
                if (newBuffer.length === 2) {
                    const hourNum = parseInt(newBuffer, 10);
                    const validHours = hourNum <= 23 ? newBuffer : '23';
                    setCommittedHours(validHours);
                    setHoursBuffer('');
                    onChange(`${validHours}:${committedMinutes}`);

                    // Auto-switch to minutes section
                    setActiveSection('minutes');
                }
            }
        } else {
            const newBuffer = minutesBuffer + digit;
            if (newBuffer.length <= 2) {
                setMinutesBuffer(newBuffer);

                // If buffer is now 2 digits, validate and commit
                if (newBuffer.length === 2) {
                    const minuteNum = parseInt(newBuffer, 10);
                    const validMinutes = minuteNum <= 59 ? newBuffer : '59';
                    setCommittedMinutes(validMinutes);
                    setMinutesBuffer('');
                    onChange(`${committedHours}:${validMinutes}`);
                }
            }
        }
    };

    // Handle backspace
    const handleBackspaceAction = () => {
        if (disabled) return;

        if (activeSection === 'hours') {
            if (hoursBuffer.length > 0) {
                setHoursBuffer(prev => prev.slice(0, -1));
            } else {
                // Clear committed hours
                setCommittedHours('00');
                onChange(`00:${committedMinutes}`);
            }
        } else {
            if (minutesBuffer.length > 0) {
                setMinutesBuffer(prev => prev.slice(0, -1));
            } else {
                // Clear committed minutes
                setCommittedMinutes('00');
                onChange(`${committedHours}:00`);
            }
        }
    };

    // Switch active section
    const switchSection = (section) => {
        if (disabled) return;

        // Commit current buffer before switching
        if (activeSection !== section) {
            commitBuffer(activeSection);
            setActiveSection(section);
        }
    };

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        handleDigit: handleDigitInput,
        handleBackspace: handleBackspaceAction,
        focus: () => containerRef.current?.focus(),
        getCurrentValue: () => {
            // Return current value with any uncommitted buffers padded and committed
            let finalHours = committedHours;
            let finalMinutes = committedMinutes;

            if (hoursBuffer) {
                const paddedHours = hoursBuffer.padStart(2, '0');
                const hourNum = parseInt(paddedHours, 10);
                finalHours = hourNum <= 23 ? paddedHours : '23';
            }

            if (minutesBuffer) {
                const paddedMinutes = minutesBuffer.padStart(2, '0');
                const minuteNum = parseInt(paddedMinutes, 10);
                finalMinutes = minuteNum <= 59 ? paddedMinutes : '59';
            }

            return `${finalHours}:${finalMinutes}`;
        },
        commitAndSubmit: () => {
            // Commit both buffers
            let finalHours = committedHours;
            let finalMinutes = committedMinutes;

            if (hoursBuffer) {
                const paddedHours = hoursBuffer.padStart(2, '0');
                const hourNum = parseInt(paddedHours, 10);
                finalHours = hourNum <= 23 ? paddedHours : '23';
                setCommittedHours(finalHours);
                setHoursBuffer('');
            }

            if (minutesBuffer) {
                const paddedMinutes = minutesBuffer.padStart(2, '0');
                const minuteNum = parseInt(paddedMinutes, 10);
                finalMinutes = minuteNum <= 59 ? paddedMinutes : '59';
                setCommittedMinutes(finalMinutes);
                setMinutesBuffer('');
            }

            const finalValue = `${finalHours}:${finalMinutes}`;
            onChange(finalValue);
            return finalValue;
        }
    }));

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (disabled) return;

            // Only handle if the container is focused or if we're targeting the document
            if (!containerRef.current?.contains(document.activeElement) &&
                e.target !== document.body &&
                e.target !== containerRef.current) {
                return;
            }

            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                handleDigitInput(e.key);
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                handleBackspaceAction();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                switchSection('hours');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                switchSection('minutes');
            } else if (e.key === 'Enter' && onSubmit) {
                e.preventDefault();
                // Commit both buffers before submitting
                let finalHours = committedHours;
                let finalMinutes = committedMinutes;

                if (hoursBuffer) {
                    const paddedHours = hoursBuffer.padStart(2, '0');
                    const hourNum = parseInt(paddedHours, 10);
                    finalHours = hourNum <= 23 ? paddedHours : '23';
                    setCommittedHours(finalHours);
                    setHoursBuffer('');
                }

                if (minutesBuffer) {
                    const paddedMinutes = minutesBuffer.padStart(2, '0');
                    const minuteNum = parseInt(paddedMinutes, 10);
                    finalMinutes = minuteNum <= 59 ? paddedMinutes : '59';
                    setCommittedMinutes(finalMinutes);
                    setMinutesBuffer('');
                }

                // Update parent with final committed values
                const finalValue = `${finalHours}:${finalMinutes}`;
                onChange(finalValue);

                // Pass the final value directly to onSubmit
                onSubmit(finalValue);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled, activeSection, hoursBuffer, minutesBuffer, committedHours, committedMinutes, onSubmit]);

    // Update buffers when value prop changes (from parent)
    useEffect(() => {
        const newTime = parseTime(value || '00:00');
        setCommittedHours(newTime.hours);
        setCommittedMinutes(newTime.minutes);
        setHoursBuffer('');
        setMinutesBuffer('');
        // Reset to hours section only when the value is reset to 00:00
        if (newTime.hours === '00' && newTime.minutes === '00') {
            setActiveSection('hours');
            setUserHasInteracted(false);
        }
    }, [value]);

    // Auto-focus on mount
    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    // Move focus to hours section if status becomes 'wrong'
    useEffect(() => {
        if (status === 'wrong') {
            setActiveSection('hours');
            // Optional: focus the container so keyboard inputs go there
            containerRef.current?.focus();
        }
    }, [status]);


    // Get display value for each section
    const getHoursDisplay = () => {
        if (hoursBuffer) return hoursBuffer.padStart(2, '_');
        // Show __ only when user hasn't interacted yet and value is 00
        if (!userHasInteracted && committedHours === '00') return '__';
        return committedHours;
    };

    const getMinutesDisplay = () => {
        if (minutesBuffer) return minutesBuffer.padStart(2, '_');
        // Show __ only when user hasn't interacted yet and value is 00
        if (!userHasInteracted && committedMinutes === '00') return '__';
        return committedMinutes;
    };

    return (
        <Box
            ref={containerRef}
            data-testid="time-input-container"
            tabIndex={disabled ? -1 : 0}
            className={`time-input ${status === 'correct' ? 'status-correct' : ''} ${status === 'wrong' ? 'status-wrong' : ''}`}
            sx={{
                width: 130,
                height: 'fit-content',
                bgcolor: getBackgroundColor(),
                borderRadius: 1,
                border: '1px solid #ccc',
                transition: 'background-color 0.4s ease',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'monospace',
                fontSize: '1.5rem',
                userSelect: 'none',
                cursor: disabled ? 'not-allowed' : 'text',
                opacity: disabled ? 0.6 : 1,
                outline: 'none',
                '&:focus': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                },
            }}
            onClick={() => !disabled && containerRef.current?.focus()}
        >
            {/* Hours Section */}
            <Box
                ref={hoursRef}
                data-testid="hours-section"
                onClick={(e) => {
                    e.stopPropagation();
                    !disabled && switchSection('hours');
                }}
                sx={{
                    flex: 1,
                    textAlign: 'right',
                    py: 0.5,
                    px: 1,
                    bgcolor: activeSection === 'hours' ? getActiveSectionColor() : 'transparent',
                    borderRadius: 1,
                    transition: 'background-color 0.2s ease',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    '&:hover': {
                        bgcolor: !disabled && activeSection !== 'hours' ? '#f5f5f5' : undefined,
                    },
                }}
            >
                <Typography
                    component="span"
                    sx={{
                        fontWeight: activeSection === 'hours' ? 'bold' : 'normal',
                        color: disabled ? '#666' : '#000',
                    }}
                >
                    {getHoursDisplay()}
                </Typography>
            </Box>

            {/* Colon Separator */}
            <Box
                data-testid="time-input-display"
                sx={{
                    px: 0.5,
                    color: disabled ? '#999' : '#666',
                    fontWeight: 'bold',
                }}
            >
                :
            </Box>

            {/* Minutes Section */}
            <Box
                ref={minutesRef}
                data-testid="minutes-section"
                onClick={(e) => {
                    e.stopPropagation();
                    !disabled && switchSection('minutes');
                }}
                sx={{
                    flex: 1,
                    textAlign: 'left',
                    py: 0.5,
                    px: 1,
                    bgcolor: activeSection === 'minutes' ? getActiveSectionColor() : 'transparent',
                    borderRadius: 1,
                    transition: 'background-color 0.2s ease',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    '&:hover': {
                        bgcolor: !disabled && activeSection !== 'minutes' ? '#f5f5f5' : undefined,
                    },
                }}
            >
                <Typography
                    component="span"
                    sx={{
                        fontWeight: activeSection === 'minutes' ? 'bold' : 'normal',
                        color: disabled ? '#666' : '#000',
                    }}
                >
                    {getMinutesDisplay()}
                </Typography>
            </Box>
        </Box>
    );
});

TimeInput2.displayName = 'TimeInput2';

export default TimeInput2;