import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const TimeInput = forwardRef(({ value, onChange, onSubmit, disabled, status, mode = 'full-time' }, ref) => {
    const isHoursOnly = mode === 'hours-only';

    // Parse initial value into hours and minutes
    const parseTime = (timeString) => {
        if (isHoursOnly) {
            const hours = timeString || '00';
            return {
                hours: hours.padStart(2, '0'),
                minutes: '00'
            };
        }
        const [hours = '00', minutes = '00'] = (timeString || '00:00').split(':');
        return {
            hours: hours.padStart(2, '0'),
            minutes: minutes.padStart(2, '0')
        };
    };

    const initialTime = parseTime(value);

    // State management
    const [committedHours, setCommittedHours] = useState(initialTime.hours);
    const [committedMinutes, setCommittedMinutes] = useState(initialTime.minutes);
    const [hoursBuffer, setHoursBuffer] = useState('');
    const [minutesBuffer, setMinutesBuffer] = useState('');
    const [activeSection, setActiveSection] = useState('hours');
    const [userHasInteracted, setUserHasInteracted] = useState(false);

    const containerRef = useRef(null);

    // Format the final value to send to parent
    const formatValue = (hours, minutes) => {
        return isHoursOnly ? hours : `${hours}:${minutes}`;
    };

    // Notify parent of value change
    const notifyChange = (hours, minutes) => {
        onChange(formatValue(hours, minutes));
    };

    // Handle digit input for hours
    const handleHoursDigit = (digit) => {
        // If buffer is empty but we already have a committed value, ignore input
        // (this means we've already entered 2 digits and auto-committed)
        if (hoursBuffer === '' && committedHours !== '00') {
            return;
        }

        const newBuffer = hoursBuffer + digit;

        // Only allow up to 2 digits
        if (newBuffer.length > 2) {
            return;
        }

        setHoursBuffer(newBuffer);

        // Auto-commit when buffer reaches 2 digits
        if (newBuffer.length === 2) {
            setCommittedHours(newBuffer);
            setHoursBuffer('');
            notifyChange(newBuffer, committedMinutes);

            // In full-time mode, move to minutes
            if (!isHoursOnly) {
                setActiveSection('minutes');
            }
        }
    };

    // Handle digit input for minutes (full-time only)
    const handleMinutesDigit = (digit) => {
        // If buffer is empty but we already have a committed value, ignore input
        // (this means we've already entered 2 digits and auto-committed)
        if (minutesBuffer === '' && committedMinutes !== '00') {
            return;
        }

        const newBuffer = minutesBuffer + digit;

        // Only allow up to 2 digits
        if (newBuffer.length > 2) {
            return;
        }

        setMinutesBuffer(newBuffer);

        // Auto-commit when buffer reaches 2 digits
        if (newBuffer.length === 2) {
            setCommittedMinutes(newBuffer);
            setMinutesBuffer('');
            notifyChange(committedHours, newBuffer);
        }
    };

    // Handle digit input
    const handleDigitInput = (digit) => {
        if (disabled) return;
        setUserHasInteracted(true);

        if (activeSection === 'hours') {
            handleHoursDigit(digit);
        } else if (!isHoursOnly) {
            handleMinutesDigit(digit);
        }
    };

    // Handle backspace
    const handleBackspaceAction = () => {
        if (disabled) return;

        if (activeSection === 'hours') {
            if (hoursBuffer.length > 0) {
                // Remove last character from buffer
                setHoursBuffer(prev => prev.slice(0, -1));
            } else if (committedHours !== '00') {
                // Move committed value back to buffer with rightmost digit removed
                // e.g., "23" → "_2" (buffer = "2")
                const leftDigit = committedHours[0];
                setCommittedHours('00');
                setHoursBuffer(leftDigit === '0' ? '' : leftDigit);
                notifyChange('00', committedMinutes);
            }
            // else: already at __:__, nothing to delete
        } else if (!isHoursOnly) {
            if (minutesBuffer.length > 0) {
                // Remove last character from buffer
                setMinutesBuffer(prev => prev.slice(0, -1));
            } else if (committedMinutes !== '00') {
                // Move committed value back to buffer with rightmost digit removed
                // e.g., "45" → "_4" (buffer = "4")
                const leftDigit = committedMinutes[0];
                setCommittedMinutes('00');
                setMinutesBuffer(leftDigit === '0' ? '' : leftDigit);
                notifyChange(committedHours, '00');
            } else {
                // At __:__, move focus to hours
                setActiveSection('hours');
            }
        }
    };

    // Switch active section
    const switchSection = (section) => {
        if (disabled || isHoursOnly) return;

        // Commit current buffer before switching
        if (activeSection === 'hours' && hoursBuffer) {
            const paddedHours = hoursBuffer.padStart(2, '0');
            setCommittedHours(paddedHours);
            setHoursBuffer('');
            notifyChange(paddedHours, committedMinutes);
        } else if (activeSection === 'minutes' && minutesBuffer) {
            const paddedMinutes = minutesBuffer.padStart(2, '0');
            setCommittedMinutes(paddedMinutes);
            setMinutesBuffer('');
            notifyChange(committedHours, paddedMinutes);
        }

        setActiveSection(section);
    };

    // Get final values (committing any pending buffers)
    const getFinalValues = () => {
        let finalHours = committedHours;
        let finalMinutes = committedMinutes;

        if (hoursBuffer) {
            finalHours = hoursBuffer.padStart(2, '0');
        }
        if (minutesBuffer && !isHoursOnly) {
            finalMinutes = minutesBuffer.padStart(2, '0');
        }

        return { finalHours, finalMinutes };
    };

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        handleDigit: handleDigitInput,
        handleBackspace: handleBackspaceAction,
        focus: () => containerRef.current?.focus(),
        getCurrentValue: () => {
            const { finalHours, finalMinutes } = getFinalValues();
            return formatValue(finalHours, finalMinutes);
        },
        commitAndSubmit: () => {
            const { finalHours, finalMinutes } = getFinalValues();

            // Update state
            setCommittedHours(finalHours);
            setCommittedMinutes(finalMinutes);
            setHoursBuffer('');
            setMinutesBuffer('');

            // Notify parent
            const finalValue = formatValue(finalHours, finalMinutes);
            onChange(finalValue);

            if (onSubmit) {
                onSubmit(finalValue);
            }

            return finalValue;
        }
    }));

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (disabled) return;

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
            } else if (e.key === 'ArrowLeft' && !isHoursOnly) {
                e.preventDefault();
                switchSection('hours');
            } else if (e.key === 'ArrowRight' && !isHoursOnly) {
                e.preventDefault();
                switchSection('minutes');
            } else if (e.key === 'Enter' && onSubmit) {
                e.preventDefault();
                const { finalHours, finalMinutes } = getFinalValues();

                setCommittedHours(finalHours);
                setCommittedMinutes(finalMinutes);
                setHoursBuffer('');
                setMinutesBuffer('');

                const finalValue = formatValue(finalHours, finalMinutes);
                onChange(finalValue);
                onSubmit(finalValue);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [disabled, activeSection, hoursBuffer, minutesBuffer, committedHours, committedMinutes, onSubmit, isHoursOnly]);

    // Update when value prop changes from parent
    // Only sync if we don't have active buffers (to avoid overwriting user input)
    useEffect(() => {
        // Don't sync if user is actively typing (has buffer content)
        if (hoursBuffer || minutesBuffer) {
            return;
        }

        const newTime = parseTime(value);
        setCommittedHours(newTime.hours);
        setCommittedMinutes(newTime.minutes);

        // Reset to initial state when value is reset to default
        const isDefaultValue = newTime.hours === '00' && newTime.minutes === '00';
        if (isDefaultValue) {
            setActiveSection('hours');
            setUserHasInteracted(false);
        }
    }, [value, isHoursOnly, hoursBuffer, minutesBuffer]);

    // Auto-focus on mount
    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    // Move focus to hours section if status becomes 'wrong'
    useEffect(() => {
        if (status === 'wrong') {
            setActiveSection('hours');
            containerRef.current?.focus();
        }
    }, [status]);

    // Get display value for hours
    const getHoursDisplay = () => {
        if (hoursBuffer) {
            // Show buffer as-is, pad with underscore only if needed
            return hoursBuffer.padStart(2, '_');
        }
        if (!userHasInteracted && committedHours === '00') {
            return '__';
        }
        return committedHours;
    };

    // Get display value for minutes
    const getMinutesDisplay = () => {
        if (isHoursOnly) {
            return '00'; // Always show 00 in hours-only mode
        }

        if (minutesBuffer) {
            // Show buffer as-is, pad with underscore only if needed
            return minutesBuffer.padStart(2, '_');
        }
        if (!userHasInteracted && committedMinutes === '00') {
            return '__';
        }
        return committedMinutes;
    };

    // Styling helpers
    const getBackgroundColor = () => {
        if (status === 'correct') return '#d4edda';
        if (status === 'wrong') return '#f8d7da';
        return 'white';
    };

    const getActiveSectionColor = () => {
        if (status === 'correct' || status === 'wrong') return 'transparent';
        return '#e3f2fd';
    };

    return (
        <div
            ref={containerRef}
            data-testid="time-input-container"
            tabIndex={disabled ? -1 : 0}
            className={`time-input ${status === 'correct' ? 'status-correct' : ''} ${status === 'wrong' ? 'status-wrong' : ''}`}
            style={{
                width: 100,
                height: 48,
                backgroundColor: getBackgroundColor(),
                borderRadius: 4,
                border: '1px solid #ccc',
                transition: 'background-color 0.4s ease',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                userSelect: 'none',
                cursor: disabled ? 'not-allowed' : 'text',
                opacity: disabled ? 0.6 : 1,
                outline: 'none',
            }}
            onClick={() => !disabled && containerRef.current?.focus()}
            onFocus={(e) => {
                if (!disabled) {
                    e.currentTarget.style.borderColor = '#1976d2';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.2)';
                }
            }}
            onBlur={(e) => {
                e.currentTarget.style.borderColor = '#ccc';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Hours Section */}
            <div
                data-testid="hours-section"
                onClick={(e) => {
                    e.stopPropagation();
                    !disabled && switchSection('hours');
                }}
                style={{
                    flex: 1,
                    textAlign: 'right',
                    padding: '2px 4px',
                    backgroundColor: activeSection === 'hours' ? getActiveSectionColor() : 'transparent',
                    borderRadius: 4,
                    transition: 'background-color 0.2s ease',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    color: disabled ? '#666' : '#000',
                    fontFamily: 'monospace',
                }}
                onMouseEnter={(e) => {
                    if (!disabled && activeSection !== 'hours') {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                }}
                onMouseLeave={(e) => {
                    if (activeSection !== 'hours') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }
                }}
            >
                {getHoursDisplay()}
            </div>

            {/* Colon Separator */}
            <div
                data-testid="time-input-display"
                style={{
                    padding: '0 4px',
                    color: disabled ? '#999' : '#666',
                    fontWeight: 'bold',
                }}
            >
                :
            </div>

            {/* Minutes Section */}
            <div
                data-testid="minutes-section"
                onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled && !isHoursOnly) {
                        switchSection('minutes');
                    }
                }}
                style={{
                    flex: 1,
                    textAlign: 'left',
                    padding: '2px 4px',
                    backgroundColor: !isHoursOnly && activeSection === 'minutes' ? getActiveSectionColor() : 'transparent',
                    borderRadius: 4,
                    transition: 'background-color 0.2s ease',
                    cursor: isHoursOnly ? 'default' : (disabled ? 'not-allowed' : 'pointer'),
                    fontWeight: 'bold',
                    color: isHoursOnly ? '#999' : (disabled ? '#666' : '#000'),
                    fontFamily: 'monospace',
                    pointerEvents: isHoursOnly ? 'none' : 'auto',
                }}
                onMouseEnter={(e) => {
                    if (!disabled && !isHoursOnly && activeSection !== 'minutes') {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isHoursOnly && activeSection !== 'minutes') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }
                }}
            >
                {getMinutesDisplay()}
            </div>
        </div>
    );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;