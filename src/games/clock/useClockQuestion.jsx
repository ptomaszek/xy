import { useCallback, useMemo, useState } from 'react';

// Added minuteStep to parameters (default is 5)
function useClockQuestion({
                              minHour = 1,
                              maxHour = 12,
                              includeMinutes = false,
                              minuteStep = 5,
                              onQuestionGenerated
                          }) {
    const [hour, setHour] = useState(null);
    const [minute, setMinute] = useState(null);

    const generateQuestion = useCallback(() => {
        const h = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;

        // Calculate number of steps in an hour (e.g. 60 / 10 = 6 slots)
        // Then multiply back by step to get 0, 10, 20...
        const m = includeMinutes
            ? Math.floor(Math.random() * (60 / minuteStep)) * minuteStep
            : 0;

        setHour(h);
        setMinute(m);
        onQuestionGenerated?.({ hour: h, minute: m });
    }, [minHour, maxHour, includeMinutes, minuteStep, onQuestionGenerated]);

    const currentTime = useMemo(() => {
        if (hour == null) return null;
        return new Date(2000, 0, 1, hour, minute, 0);
    }, [hour, minute]);

    return {
        hour,
        minute,
        correctAnswer: { hour, minute },
        currentTime,
        generateQuestion,
    };
}

export default useClockQuestion;