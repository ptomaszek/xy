import React, { useState, useCallback, useMemo } from 'react';

/**
 * QuestionGenerator component that handles the generation of math questions
 * based on provided configuration parameters.
 * 
 * @param {Object} props
 * @param {number} props.coefficients - Number of coefficients in the expression
 * @param {string[]} props.operations - Array of operations to use ('+', '-', '*')
 * @param {number} props.range - Maximum value for numbers in the expression
 * @param {function} props.onQuestionGenerated - Callback when a new question is generated
 * @param {boolean} props.disabled - Whether question generation should be disabled
 * @returns {Object} Question state and methods
 */
function QuestionGenerator({ coefficients, operations, range, onQuestionGenerated, disabled = false }) {
    const [numbers, setNumbers] = useState([]);
    const [operators, setOperators] = useState([]);

    /* ===================== Question Generation ===================== */
    const generateQuestion = useCallback(() => {
        if (disabled) return;

        // 50% chance to enforce non-trivial generation
        const enforceNonTrivial = Math.random() < 0.5;
        let attempts = 0;
        const maxAttempts = 50; // Safety limit to prevent infinite loops

        let nums = [];
        let ops = [];
        let current = 0;
        let isValidQuestion = false;

        while (!isValidQuestion && attempts < maxAttempts) {
            nums = [];
            ops = [];
            current = 0;

            if (operations.includes('*')) {
                // For multiplication, handle trivial cases
                const a = getRandomNumber(range, enforceNonTrivial);
                const b = a === 0
                    ? getRandomNumber(range, enforceNonTrivial)
                    : getRandomNumber(Math.floor(range / a), enforceNonTrivial);

                nums = [a, b];
                ops = ['*'];
            } else {
                for (let i = 0; i < coefficients; i++) {
                    if (i === 0) {
                        current = getRandomNumber(range, enforceNonTrivial);
                        nums.push(current);
                    } else {
                        const op = operations[Math.floor(Math.random() * operations.length)];
                        ops.push(op);

                        let n;
                        if (op === '+') {
                            n = getRandomNumber(range - current, enforceNonTrivial);
                            current += n;
                        } else {
                            n = getRandomNumber(current, enforceNonTrivial);
                            current -= n;
                        }
                        nums.push(n);
                    }
                }
            }

            // Check if the final answer is trivial (0) when enforcing non-trivial
            const finalAnswer = calculateResult(nums, ops);
            if (enforceNonTrivial && finalAnswer === 0) {
                attempts++;
                continue; // Regenerate if answer is 0 and we're enforcing non-trivial
            }

            isValidQuestion = true;
        }

        setNumbers(nums);
        setOperators(ops);
        
        // Notify parent component about the new question
        if (onQuestionGenerated) {
            onQuestionGenerated({ numbers: nums, operators: ops });
        }
    }, [coefficients, operations, range, disabled, onQuestionGenerated]);

    /* ===================== Derived ===================== */
    const correctAnswer = useMemo(
        () => calculateResult(numbers, operators),
        [numbers, operators]
    );

    const latexExpression = useMemo(
        () => buildLatexExpression(numbers, operators),
        [numbers, operators]
    );

    return {
        numbers,
        operators,
        correctAnswer,
        latexExpression,
        generateQuestion
    };
}

/* ===================== Helper Functions ===================== */

/**
 * Generate a random number within the specified range
 * @param {number} range - Maximum value for the random number
 * @param {boolean} excludeTrivial - Whether to exclude 0 and 1 (trivial cases)
 * @returns {number} Random number between 0 and range (inclusive), optionally excluding trivial cases
 */
const getRandomNumber = (range, excludeTrivial = false) => {
    let num;
    let attempts = 0;
    const maxAttempts = 100; // Safety limit to prevent infinite loops
    
    do {
        num = Math.floor(Math.random() * (range + 1));
        attempts++;
        
        // If not excluding trivial cases, or if the number is not trivial, accept it
        if (!excludeTrivial || (num !== 0 && num !== 1)) {
            break;
        }
        
        // Safety check to prevent infinite loops in edge cases
        if (attempts >= maxAttempts) {
            break;
        }
    } while (excludeTrivial && (num === 0 || num === 1));
    
    return num;
};

/**
 * Calculate the result of a math expression given numbers and operators
 * @param {number[]} numbers - Array of numbers
 * @param {string[]} operators - Array of operators ('+', '-', '*')
 * @returns {number} The calculated result
 */
const calculateResult = (numbers, operators) =>
    operators.reduce((result, op, i) => {
        const next = numbers[i + 1];
        if (op === '+') return result + next;
        if (op === '-') return result - next;
        if (op === '*') return result * next;
        return result;
    }, numbers[0] ?? 0);

/**
 * Build a LaTeX expression string from numbers and operators
 * @param {number[]} numbers - Array of numbers
 * @param {string[]} operators - Array of operators
 * @returns {string} LaTeX formatted expression
 */
const buildLatexExpression = (numbers, operators) =>
    numbers
        .flatMap((n, i) =>
            i < operators.length
                ? [n, operators[i] === '*' ? '\\times' : operators[i]]
                : [n]
        )
        .join(' ') + ' =';

export default QuestionGenerator;
export { calculateResult, buildLatexExpression };
