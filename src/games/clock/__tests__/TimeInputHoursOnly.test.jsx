import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeInput2 from '../TimeInput2';
import React from 'react';
import { vi } from 'vitest';

describe('TimeInput2 Component - Hours-Only Mode', () => {
    let mockOnChange;
    let mockOnSubmit;

    const renderComponent = (props = {}) => {
        return render(
            <TimeInput2
                value="00:00"
                onChange={mockOnChange}
                onSubmit={mockOnSubmit}
                disabled={false}
                status="idle"
                mode="hours-only"
                {...props}
            />
        );
    };

    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnSubmit = vi.fn();
    });

    const typeKeys = async (keys, container) => {
        keys.forEach(key => fireEvent.keyDown(container, {key}));
    };

    const getSections = () => ({
        hours: screen.getByTestId('hours-section'),
        minutes: screen.getByTestId('minutes-section'),
        container: screen.getByTestId('time-input-container'),
    });

    describe('Rendering', () => {
        it('renders hours section and fixed minutes display', () => {
            renderComponent();
            const { hours, minutes } = getSections();
            
            expect(hours).toBeInTheDocument();
            expect(minutes).toBeInTheDocument();
            expect(minutes.textContent).toBe('00');
            expect(screen.getByText(':')).toBeInTheDocument();
        });

        it('shows placeholder when no input', () => {
            renderComponent();
            const { hours } = getSections();
            expect(hours.textContent).toBe('__');
        });

        it('displays actual hours when value is set', () => {
            renderComponent({ value: '15:00' });
            const { hours } = getSections();
            expect(hours.textContent).toBe('15');
        });

        it('shows fixed minutes as greyed out', () => {
            renderComponent();
            const { minutes } = getSections();
            const minutesStyle = window.getComputedStyle(minutes);
            expect(minutesStyle.color).toBe('rgb(153, 153, 153)'); // #999
        });
    });

    describe('Input Behavior', () => {
        it('accepts single digit hours', async () => {
            renderComponent();
            const { container, hours } = getSections();

            fireEvent.click(hours);
            await typeKeys(['5'], container);
            expect(mockOnChange).toHaveBeenCalledWith('5');
        });

        it('accepts two digit hours', async () => {
            renderComponent();
            const { container, hours } = getSections();

            fireEvent.click(hours);
            await typeKeys(['1', '5'], container);
            expect(mockOnChange).toHaveBeenCalledWith('15');
        });

        it('validates hours <= 23', async () => {
            renderComponent();
            const { container, hours } = getSections();

            fireEvent.click(hours);
            await typeKeys(['2', '9'], container);
            expect(mockOnChange).toHaveBeenCalledWith('23'); // Should cap at 23
        });

        it('auto-submits when two digits entered', async () => {
            renderComponent();
            const { container, hours } = getSections();

            fireEvent.click(hours);
            await typeKeys(['1', '5'], container);
            expect(mockOnSubmit).toHaveBeenCalledWith('15');
        });

        it('handles backspace correctly', async () => {
            renderComponent({ value: '15:00' });
            const { container, hours } = getSections();

            fireEvent.click(hours);
            fireEvent.keyDown(container, {key: 'Backspace'});
            expect(mockOnChange).toHaveBeenCalledWith('00');
        });
    });

    describe('Disabled State', () => {
        it('blocks input when disabled', () => {
            renderComponent({ disabled: true });
            const { container, hours } = getSections();

            fireEvent.click(hours);
            fireEvent.keyDown(container, {key: '5'});
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        it('shows reduced opacity when disabled', () => {
            renderComponent({ disabled: true });
            const { container } = getSections();
            expect(window.getComputedStyle(container).opacity).toBe('0.6');
        });
    });

    describe('Status Display', () => {
        it('shows correct background colors for status', () => {
            const { rerender } = renderComponent({ status: 'idle' });
            const container = screen.getByTestId('time-input-container');

            // Idle status → white background
            expect(window.getComputedStyle(container).backgroundColor).toBe('rgb(255, 255, 255)');

            // Status = correct → green background
            rerender(
                <TimeInput2
                    value="15:00"
                    status="correct"
                    onChange={mockOnChange}
                    onSubmit={mockOnSubmit}
                    disabled={false}
                    mode="hours-only"
                />
            );
            expect(window.getComputedStyle(container).backgroundColor).toBe('rgb(212, 237, 218)');

            // Status = wrong → red background
            rerender(
                <TimeInput2
                    value="15:00"
                    status="wrong"
                    onChange={mockOnChange}
                    onSubmit={mockOnSubmit}
                    disabled={false}
                    mode="hours-only"
                />
            );
            expect(window.getComputedStyle(container).backgroundColor).toBe('rgb(248, 215, 218)');
        });
    });

    describe('Ref Methods', () => {
        it('exposes ref methods correctly', () => {
            const ref = React.createRef();
            renderComponent({ ref });
            
            expect(ref.current).toHaveProperty('handleDigit');
            expect(ref.current).toHaveProperty('handleBackspace');
            expect(ref.current).toHaveProperty('focus');
            expect(ref.current).toHaveProperty('getCurrentValue');
            expect(ref.current).toHaveProperty('commitAndSubmit');
        });

        it('getCurrentValue returns hours only', () => {
            const ref = React.createRef();
            renderComponent({ ref, value: '15:00' });
            
            const currentValue = ref.current.getCurrentValue();
            expect(currentValue).toBe('15');
        });
    });
});
