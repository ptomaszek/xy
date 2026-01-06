import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useNavigate} from 'react-router-dom';
import {InlineMath} from 'react-katex';
import 'katex/dist/katex.min.css';
import LevelProgressTracker from './LevelProgressTracker';

/* ===================== Helpers ===================== */
const generateLevelDescription = (config, levelNumber) => {
    const {coefficients, operations, range} = config;

    const operationNames = {
        '+': 'Dodawanie',
        '-': 'Odejmowanie',
        '*': 'Mnożenie',
    };

    const uniqueOperations = [...new Set(operations)];
    const operationText = uniqueOperations.map(op => operationNames[op]).join(', ');

    return `Poziom ${levelNumber}: ${operationText} w zakresie ${range}`;
};

const calculateResult = (numbers, operators) =>
    operators.reduce((result, op, i) => {
        const next = numbers[i + 1];
        if (op === '+') return result + next;
        if (op === '-') return result - next;
        if (op === '*') return result * next;
        return result;
    }, numbers[0] ?? 0);

const buildLatexExpression = (numbers, operators) =>
    numbers
        .flatMap((n, i) =>
            i < operators.length
                ? [n, operators[i] === '*' ? '\\times' : operators[i]]
                : [n]
        )
        .join(' ') + ' =';

/* ===================== Component ===================== */

function MathGame({ config }) {
    const { level, coefficients, operations, range } = config;

    const [numbers, setNumbers] = useState([]);
    const [operators, setOperators] = useState([]);
    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('idle'); // idle | correct | wrong
    const [inputBg, setInputBg] = useState('white');

    const inputRef = useRef(null);
    const progressRef = useRef(null);
    const navigate = useNavigate();

    /* ===================== Focus ===================== */
    const focusInput = useCallback(() => {
        const input = inputRef.current?.querySelector('input');
        input?.focus();
        input?.select();
    }, []);

    /* ===================== Question Generation ===================== */
    const generateQuestion = useCallback(() => {
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
        setAnswer('');
        setStatus('idle');
        setInputBg('white');
    }, [coefficients, operations, range]);

    /* ===================== Derived ===================== */
    const correctAnswer = useMemo(
        () => calculateResult(numbers, operators),
        [numbers, operators]
    );

    const latexExpression = useMemo(
        () => buildLatexExpression(numbers, operators),
        [numbers, operators]
    );

    /* ===================== Submit ===================== */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!answer) return;

        const userAnswer = parseInt(answer, 10);

        if (userAnswer === correctAnswer) {
            setStatus('correct');
            setInputBg('#d4edda'); // green for correct
            progressRef.current?.handleCorrectAnswer();
            setTimeout(generateQuestion, 800);
        } else {
            setStatus('wrong');
            setInputBg('#f8d7da'); // red
            progressRef.current?.handleIncorrectAnswer();
            focusInput();
        }
    };

    const handleNextLevel = () => {
        const path = window.location.hash;
        if (path.includes('/levels/1')) navigate('/games/math/levels/2');
        else if (path.includes('/levels/2')) navigate('/games/math/levels/3');
        else navigate('/games/math');
    };

    /* ===================== Fade red background effect ===================== */
    useEffect(() => {
        if (status !== 'idle') {
            const timer = setTimeout(() => {
                setInputBg('white'); // fade input back
                setStatus('idle'); // reset status
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [status]);
    ;

    /* ===================== Initial setup ===================== */
    useEffect(generateQuestion, [generateQuestion]);
    useEffect(focusInput, [numbers, operators, focusInput]);

    /* ===================== Render ===================== */
    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4} px={2}>

            {/* Level Info */}
            <Box
                sx={{
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    color: '#555',
                    mb: 5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#f0f4f8',
                }}
            >
                {generateLevelDescription(config, level)}
            </Box>

            {/* Progress Tracker outside question container */}
            <Box sx={{ minWidth: 250, maxWidth: '90%' }}>
                <LevelProgressTracker
                    ref={progressRef}
                    tasksToComplete={10}
                    maxMistakes={3}
                    onLevelRestart={generateQuestion}
                    onNextLevel={handleNextLevel}
                />
            </Box>

            {/* Math question + input + mark */}
            <Box component="form" onSubmit={handleSubmit} mt={3}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h5">
                        <InlineMath math={latexExpression} />
                    </Typography>

                    <TextField
                        ref={inputRef}
                        type="tel"
                        inputMode="numeric"             // Numeric keyboard on mobile
                        pattern="[0-9]*"                // Restrict input to digits only
                        value={answer}
                        disabled={status === 'correct'}
                        onChange={(e) => setAnswer(e.target.value)}
                        sx={{
                            width: 70,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: inputBg,
                                transition: 'background-color 0.5s ease',
                            },
                        }}
                    />
                </Box>

                <Box display="flex" justifyContent="center">
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={status === 'correct' || !answer}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            bgcolor: status === 'correct' ? '#9cc7a3' : '#007bff',
                            '&:hover': {
                                bgcolor: status === 'correct' ? '#9cc7a3' : '#0056b3',
                            },
                            color: 'white',
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Zatwierdź
                    </Button>
                </Box>

            </Box>
        </Box>
    );
}

export default MathGame;
