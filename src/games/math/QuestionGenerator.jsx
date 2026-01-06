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

        let nums = [];
        let ops = [];
        let current = 0;

        if (operations.includes('*')) {
            const a = Math.floor(Math.random() * (range + 1));
            const b =
                a === 0
                    ? Math.floor(Math.random() * (range + 1))
                    : Math.floor(Math.random() * (Math.floor(range / a) + 1));

            nums = [a, b];
            ops = ['*'];
        } else {
            for (let i = 0; i < coefficients; i++) {
                if (i === 0) {
                    current = Math.floor(Math.random() * (range + 1));
                    nums.push(current);
                } else {
                    const op = operations[Math.floor(Math.random() * operations.length)];
                    ops.push(op);

                    let n;
                    if (op === '+') {
                        n = Math.floor(Math.random() * (range - current + 1));
                        current += n;
                    } else {
                        n = Math.floor(Math.random() * (current + 1));
                        current -= n;
                    }
                    nums.push(n);
                }
            }
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
