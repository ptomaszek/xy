/**
 * Clock game validation functions
 * Contains validation logic for different level types
 */

/**
 * Checks if user input is a valid equivalent for the given analog clock hour (Level 1)
 * Returns true if the input matches any valid 24-hour equivalent
 *
 * @param {number} userInput - The user's input (0-99)
 * @param {number} analogHour - The analog clock hour (1-12)
 * @returns {boolean} True if the input is a valid equivalent
 */
export function isCorrectHourAnswer(userInput, analogHour) {
    // Handle special case for hour 12
    if (analogHour === 12) {
        return userInput === 12 || userInput === 24 || userInput === 0;
    }

    // Check direct 24-hour equivalents (1-11 and 13-23)
    if (userInput === analogHour || userInput === analogHour + 12) {
        return true;
    }

    // Check zero-padded versions for single-digit hours (10-90 represent 01-09)
    if (analogHour >= 1 && analogHour <= 9 && userInput === analogHour * 10) {
        return true;
    }

    return false;
}

/**
 * Checks if user input (hours:minutes) is a valid equivalent for the given analog clock time (Level 2)
 *
 * @param {number} userHours - The user's hour input
 * @param {number} userMinutes - The user's minute input
 * @param {number} analogHour - The analog clock hour (1-12)
 * @param {number} analogMinute - The analog clock minute (0-59)
 * @returns {boolean} True if the input is a valid equivalent
 */
export function isCorrectTimeAnswer(userHours, userMinutes, analogHour, analogMinute) {
    // Normalize user hours to 0-23 range
    let normalizedUserHours = userHours;
    if (userHours === 24) normalizedUserHours = 0;
    if (userHours > 24) normalizedUserHours = userHours % 24;

    // Handle 12-hour format conversion (12 PM = 12, 12 AM = 0)
    if (normalizedUserHours === 12) {
        normalizedUserHours = 0; // 12 AM
    }

    // Check if hours and minutes match exactly
    return normalizedUserHours === analogHour && userMinutes === analogMinute;
}
