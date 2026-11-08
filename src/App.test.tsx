import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('Championship Day', () => {
  it('renders the page heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Championship Day' })).toBeInTheDocument();
  });

  it('shows every heat on the schedule', () => {
    render(<App />);

    expect(screen.getByText('Heat 1')).toBeInTheDocument();
    expect(screen.getByText('Heat 2')).toBeInTheDocument();
    expect(screen.getByText('Heat 3')).toBeInTheDocument();
  });

  it('shows finished sessions when Finished is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Finished' }));

    expect(screen.getByText('Heat 2')).toBeInTheDocument();
    expect(screen.queryByText('Heat 1')).not.toBeInTheDocument();
  });

  it('shows an athlete when Results is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Results' }));

    expect(screen.getByText('Lena Berg')).toBeInTheDocument();
  });

  it('shows the medal ceremonies note when Medals is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Medals' }));

    expect(
      screen.getByText('Medal ceremonies are published after the final heat.'),
    ).toBeInTheDocument();
  });

  it('shows the heat detail when Details is activated', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Details for Heat 1' }));

    expect(screen.getByText('First run starts at 10:15.')).toBeInTheDocument();
  });

  it('opens and closes alert preferences', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Manage alerts' }));
    expect(screen.getByText('Heat changes')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('Heat changes')).not.toBeInTheDocument();
  });

  it('shows a confirmation when the share control is used', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Copy link' }));

    expect(screen.getByText('Link copied')).toBeInTheDocument();
  });

  it('filters to finished sessions from the keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('button', { name: 'Live only' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All sessions' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Finished' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    screen.getByRole('button', { name: 'Finished' }).focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Heat 2')).toBeInTheDocument();
    expect(screen.queryByText('Heat 1')).not.toBeInTheDocument();
  });

  it('shows standing words and column names on the results table', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Results' }));

    expect(screen.getAllByText('Qualified').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Eliminated').length).toBeGreaterThan(0);
    expect(screen.getByRole('columnheader', { name: 'Athlete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sort by bib' })).toBeInTheDocument();
  });

  it('names the alerts dialog and returns focus on Escape', async () => {
    const user = userEvent.setup();
    render(<App />);

    const opener = screen.getByRole('button', { name: 'Manage alerts' });
    await user.click(opener);

    expect(screen.getByRole('dialog', { name: 'Alert preferences' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it('exposes the favourite control as a pressed toggle', async () => {
    const user = userEvent.setup();
    render(<App />);

    const favourite = screen.getByRole('button', { name: 'Favourite' });
    expect(favourite).toHaveAttribute('aria-pressed', 'false');

    await user.click(favourite);

    expect(favourite).toHaveAttribute('aria-pressed', 'true');
  });

  it('exposes the schedule as the active tab panel', () => {
    render(<App />);

    expect(screen.getByRole('tabpanel', { name: 'Schedule' })).toBeInTheDocument();
  });

  it('moves to the next view with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<App />);

    const schedule = screen.getByRole('tab', { name: 'Schedule' });
    schedule.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Results' })).toHaveFocus();
    expect(screen.getByText('Lena Berg')).toBeInTheDocument();
  });

  it('sorts bib descending on the first activation and reverses on the second', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Results' }));
    expect(screen.getByRole('button', { name: 'Sort by rank, ascending' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sort by bib' }));

    const descendingRows = screen.getAllByRole('row');
    expect(descendingRows[1]).toHaveTextContent('Hana Novak');
    expect(screen.getByRole('button', { name: 'Sort by bib, descending' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sort by bib, descending' }));

    const ascendingRows = screen.getAllByRole('row');
    expect(ascendingRows[1]).toHaveTextContent('Sofia Rossi');
    expect(screen.getByRole('button', { name: 'Sort by bib, ascending' })).toBeInTheDocument();
  });

  it('names the results region from the caption', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Results' }));

    expect(screen.getByRole('region', { name: 'Heat results' })).toBeInTheDocument();
  });
});
