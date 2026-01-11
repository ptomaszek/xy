import {render, screen, fireEvent, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeInput2 from '../TimeInput2';
import React from 'react';
import {vi} from 'vitest';

describe('TimeInput2 Component', () => {
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
                {...props}
                mode="full-time"
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
        it('renders without crashing and shows placeholder', () => {
            renderComponent();
            const {hours, minutes} = getSections();
            expect(hours.textContent).toBe('__');
            expect(minutes.textContent).toBe('__');
            expect(screen.getByTestId('time-input-display').textContent).toBe(':');
        });

        it('displays actual time when value is set', () => {
            renderComponent({value: '15:30'});
            const {hours, minutes} = getSections();
            expect(hours.textContent).toBe('15');
            expect(minutes.textContent).toBe('30');
        });
    });

    describe('Keyboard Input', () => {
        it('accepts and pads hours and minutes correctly', async () => {
            renderComponent();
            const {container, hours, minutes} = getSections();

            fireEvent.click(hours);
            await typeKeys(['1', '5'], container);
            expect(mockOnChange).toHaveBeenCalledWith('15:00');

            fireEvent.click(minutes);
            await typeKeys(['3', '0'], container);
            expect(mockOnChange).toHaveBeenCalledWith('15:30');
        });

        it('validates hours <= 23 and minutes <= 59', async () => {
            renderComponent();
            const {container, hours, minutes} = getSections();

            fireEvent.click(hours);
            await typeKeys(['2', '9'], container);
            expect(mockOnChange).toHaveBeenCalledWith('23:00');

            fireEvent.click(minutes);
            await typeKeys(['7', '8'], container);
            expect(mockOnChange).toHaveBeenCalledWith('23:59');
        });

        it('switches sections with Arrow keys', async () => {
            renderComponent();
            const {container, hours, minutes} = getSections();

            fireEvent.click(hours);
            fireEvent.keyDown(container, {key: 'ArrowRight'});
            fireEvent.keyDown(container, {key: '5'});
            expect(minutes.textContent).toBe('_5');

            fireEvent.keyDown(container, {key: 'ArrowLeft'});
            fireEvent.keyDown(container, {key: '7'});
            expect(hours.textContent).toBe('_7');
        });

        it('handles backspace correctly', async () => {
            renderComponent({value: '15:30'});
            const {container, hours} = getSections();

            fireEvent.click(hours);
            fireEvent.keyDown(container, {key: 'Backspace'});
            expect(mockOnChange).toHaveBeenCalledWith('00:30');
        });

        it('submits on Enter and pads buffers', async () => {
            renderComponent();
            const {container} = getSections();

            await typeKeys(['1', '5', '5'], container);
            fireEvent.keyDown(container, {key: 'Enter'});
            expect(mockOnSubmit).toHaveBeenCalledWith('15:05');
        });
    });

    describe('Disabled State', () => {
        it('blocks input and shows reduced opacity', () => {
            renderComponent({disabled: true});
            const {container} = getSections();
            fireEvent.keyDown(container, {key: '5'});
            expect(mockOnChange).not.toHaveBeenCalled();
            expect(window.getComputedStyle(container).opacity).toBe('0.6');
        });
    });

    describe('Status Display', () => {
        it('shows correct background colors for status and hides active highlight', () => {
            const {rerender} = renderComponent({value: '15:30', status: 'idle'});

            const container = screen.getByTestId('time-input-container');
            const hours = screen.getByTestId('hours-section');

            // Idle status → white background
            expect(window.getComputedStyle(container).backgroundColor).toBe('rgb(255, 255, 255)');
            // Active section highlight should be visible
            expect(window.getComputedStyle(hours).backgroundColor).not.toBe('transparent');

            // Status = correct → green background
            rerender(
                <TimeInput2
                    value="15:30"
                    status="correct"
                    onChange={mockOnChange}
                    onSubmit={mockOnSubmit}
                    disabled={false}
                />
            );
            expect(window.getComputedStyle(container).backgroundColor).toBe('rgb(212, 237, 218)'); // light green
            // Active section highlight hidden
            expect(['transparent', 'rgba(0, 0, 0, 0)']).toContain(
                window.getComputedStyle(hours).backgroundColor
            );

            // Status = wrong → red background
            rerender(
                <TimeInput2
                    value="15:30"
                    status="wrong"
                    onChange={mockOnChange}
                    onSubmit={mockOnSubmit}
                    disabled={false}
                />
            );
            expect(window.getComputedStyle(container).backgroundColor).toBe('rgb(248, 215, 218)'); // light red
            // Active section highlight hidden
            expect(['transparent', 'rgba(0, 0, 0, 0)']).toContain(
                window.getComputedStyle(hours).backgroundColor
            );
        });
    });

    describe('Mouse Interaction', () => {
        it('switches active section on click', async () => {
            renderComponent();
            const {container, minutes} = getSections();
            fireEvent.click(minutes);
            fireEvent.keyDown(container, {key: '3'});
            expect(minutes.textContent).toBe('_3');
        });
    });
});
