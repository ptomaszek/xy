import React from 'react';
import { TextField } from '@mui/material';

/**
 * Custom Time Input component that shows HH:00 format
 * The hour part is editable, the :00 part is fixed and greyed out
 * @param {Object} props
 * @param {string} props.value - Current hour value (1-2 digits)
 * @param {function} props.onChange - Callback when hour changes
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.readOnly - Whether input is read-only
 * @param {string} props.status - 'idle' | 'correct' | 'wrong' for styling
 */
function TimeInput({ value, onChange, disabled, readOnly, status }) {
    const getBackgroundColor = () => {
        if (status === 'correct') return '#d4edda';
        if (status === 'wrong') return '#f8d7da';
        return 'white';
    };

    const getTextColor = () => {
        if (disabled) return '#666';
        return '#000';
    };

    // Ensure the value is always 1 or 2 digits
    const formattedValue = value.padStart(2, '0');

    return (
        <TextField
            value={formattedValue}
            onChange={(e) => {
                const newValue = e.target.value;
                // Only allow digits and limit to 2 characters
                if (/^\d{0,2}$/.test(newValue)) {
                    onChange(newValue);
                }
            }}
            disabled={disabled}
            inputProps={{
                readOnly: readOnly,
                maxLength: 2,
                style: {
                    color: getTextColor(),
                    textAlign: 'right', // Align digits to the right
                    paddingLeft: '4px', // Adjust the space slightly
                    fontFamily: 'monospace',
                    width: '40px',
                },
            }}
            sx={{
                width: 100,
                '& .MuiOutlinedInput-root': {
                    bgcolor: getBackgroundColor(),
                    transition: 'background-color 0.5s ease',
                    '& fieldset': {
                        borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                        borderColor: '#888',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#2196f3',
                    },
                },
                '& .MuiInputBase-input': {
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    letterSpacing: '0',
                    textAlign: 'right',
                },
            }}
            InputProps={{
                endAdornment: (
                    <span
                        style={{
                            color: '#666',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            fontFamily: 'monospace',
                            paddingLeft: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        :00
                    </span>
                ),
            }}
        />
    );
}

export default TimeInput;
