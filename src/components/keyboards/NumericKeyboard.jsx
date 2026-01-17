import React from 'react';
import { Box } from '@mui/material';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

function NumericKeyboard({
                             onKeyPress,
                             width = 180,
                             keyboardRef,
                             status,
                         }) {
    return (
        <Box
            sx={{
                width,
                maxWidth: '100%',
            }}
        >
            <Keyboard
                keyboardRef={keyboardRef}
                layout={{
                    default: [
                        '1 2 3',
                        '4 5 6',
                        '7 8 9',
                        '{bksp} 0 {enter}',
                    ],
                }}
                display={{
                    '{bksp}': '⌫',
                    '{enter}': 'OK',
                }}
                buttonTheme={
                    status
                        ? [
                            {
                                class:
                                    status === 'correct'
                                        ? 'hg-ok-correct'
                                        : status === 'wrong'
                                            ? 'hg-ok-wrong'
                                            : 'hg-ok-idle',
                                buttons: '{enter}',
                            },
                        ]
                        : undefined
                }
                onKeyPress={onKeyPress}
            />
        </Box>
    );
}

export default NumericKeyboard;
