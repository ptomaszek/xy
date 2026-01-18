import React, { forwardRef } from 'react';
import { Box, Typography, TextField } from '@mui/material';

/**
 * MultiTimeInput component for displaying and accepting time in various formats (HH, HH:MM, HH:MM:SS).
 * 
 * @param {Object} props
 * @param {string[]} props.sections - Array of sections to show, e.g., ['hh'], ['hh', 'mm'], ['hh', 'mm', 'ss']
 * @param {Object|string} props.values - Current values for each section, e.g., { hh: '12', mm: '30' } or '12' (if only one section)
 * @param {string} props.activeSection - The section currently being edited ('hh', 'mm', or 'ss')
 * @param {string} [props.bgcolor='white'] - Background color for the inputs
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {Function} [props.onSectionClick] - Callback when a section is clicked
 */
const MultiTimeInput = forwardRef(({
    sections = ['hh'],
    values,
    activeSection = 'hh',
    bgcolor = 'white',
    disabled = false,
    onSectionClick,
    ...otherProps
}, ref) => {
    // Determine the value for a given section
    const getSectionValue = (type) => {
        if (typeof values === 'string') return values;
        return values?.[type] || '';
    };

    const renderSection = (type, index) => {
        const isActive = activeSection === type;
        const sectionValue = getSectionValue(type);
        
        return (
            <React.Fragment key={type}>
                {index > 0 && (
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 600, 
                            mx: 0.5,
                            color: disabled ? 'text.disabled' : 'text.primary'
                        }}
                    >
                        :
                    </Typography>
                )}
                <TextField
                    // Only attach the ref to the first/only input if multiple sections exist,
                    // or to the single input if only one exists.
                    // ClockQuestion expects the ref on the TextField to find the input element.
                    ref={index === 0 ? ref : undefined}
                    value={sectionValue}
                    onClick={() => onSectionClick?.(type)}
                    disabled={disabled}
                    inputProps={{
                        readOnly: true,
                        style: {
                            textAlign: 'center',
                            fontSize: '1.6rem',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            padding: '8px 0',
                        },
                    }}
                    sx={{
                        width: 80,
                        '& .MuiOutlinedInput-root': {
                            bgcolor,
                            transition: 'background-color 0.5s ease',
                            '& fieldset': {
                                borderColor: isActive ? 'primary.main' : undefined,
                                borderWidth: isActive ? 2 : 1,
                            },
                        },
                    }}
                    {...otherProps}
                />
            </React.Fragment>
        );
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            {sections.map((section, index) => renderSection(section, index))}
        </Box>
    );
});

MultiTimeInput.displayName = 'MultiTimeInput';

export default MultiTimeInput;
