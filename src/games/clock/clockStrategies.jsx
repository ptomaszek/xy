/**
 * clockStrategies.js
 *
 * Defines the rules, validation, and answer checking logic for each game level.
 */

// --- 1. CORE LOGIC (Imported from your requirements) ---

/**
 * Checks if user input is a valid equivalent for the given analog clock hour.
 * Allows for 12h, 24h, and specific zero-padded formats.
 */
function isCorrectHourAnswer(userInput, analogHour) {
    // Handle special case for hour 12 (Accepts 12, 24, or 0)
    if (analogHour === 12) {
        return userInput === 12 || userInput === 24 || userInput === 0;
    }

    // Check direct 24-hour equivalents (1-11 and 13-23)
    // e.g. 1 PM can be answered as 1 or 13
    if (userInput === analogHour || userInput === analogHour + 12) {
        return true;
    }

    // Check zero-padded versions for single-digit hours
    // e.g. allows input "10" for hour 1, "20" for hour 2 (specific legacy logic)
    if (analogHour >= 1 && analogHour <= 9 && userInput === analogHour * 10) {
        return true;
    }

    return false;
}

/**
 * Helper to validate if a string is a number within min/max while typing
 */
const isValidInputRange = (val, min, max) => {
    if (val === '') return true;
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= min && num <= max;
};


// --- 2. STRATEGIES CONFIGURATION ---

export const CLOCK_STRATEGIES = {
    'full-hours': {
        sections: ['hh'],
        includeMinutesInClock: false,

        // Allow typing 0-99 to support the "analogHour * 10" check (e.g. 9 -> 90)
        validateInput: (val) => isValidInputRange(val, 0, 99),

        isCorrect: (values, correctTime) => {
            const userH = parseInt(values.hh, 10);
            return isCorrectHourAnswer(userH, correctTime.hour);
        }
    },

    'hours-minutes-5': {
        sections: ['hh', 'mm'],
        includeMinutesInClock: true,
        minuteStep: 5, // Default step
        validateInput: (val, section) => {
            if (section === 'hh') return isValidInputRange(val, 0, 24);
            if (section === 'mm') return isValidInputRange(val, 0, 59);
            return true;
        },

        isCorrect: (values, correctTime) => {
            const userH = parseInt(values.hh, 10);
            const userM = parseInt(values.mm, 10);
            return isCorrectHourAnswer(userH, correctTime.hour) && userM === correctTime.minute;
        }
    },
};

export const getStrategy = (type) => {
    return CLOCK_STRATEGIES[type] || CLOCK_STRATEGIES['full-hours'];
};
