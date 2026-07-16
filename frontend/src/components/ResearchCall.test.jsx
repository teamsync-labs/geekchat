import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResearchCall from './ResearchCall';

describe('ResearchCall', () => {
  it('should render call screen with participant name', () => {
    render(<ResearchCall />);
    expect(screen.getByText('Alex Kim')).toBeInTheDocument();
  });

  it('should display timer with data-testid', () => {
    render(<ResearchCall />);
    expect(screen.getByTestId('timer')).toBeInTheDocument();
  });

  it('should toggle mute when mic button clicked', async () => {
    const user = userEvent.setup();
    render(<ResearchCall />);
    const micButton = screen.getByTestId('mic-button');
    await user.click(micButton);
    // Ищем иконку ТОЛЬКО внутри кнопки
    const micOffIcon = within(micButton).getByTestId('mic-off-icon');
    expect(micOffIcon).toBeInTheDocument();
  });

  it('should toggle video when video button clicked', async () => {
    const user = userEvent.setup();
    render(<ResearchCall />);
    const videoButton = screen.getByTestId('video-button');
    await user.click(videoButton);
    // Ищем иконку ТОЛЬКО внутри кнопки
    const videoOffIcon = within(videoButton).getByTestId('video-off-icon');
    expect(videoOffIcon).toBeInTheDocument();
  });

  it('should open end call modal when end button clicked', async () => {
    const user = userEvent.setup();
    render(<ResearchCall />);
    const endButton = screen.getByTestId('end-call-button');
    await user.click(endButton);
    expect(screen.getByTestId('end-call-modal-title')).toBeInTheDocument();
  });

  it('should close modal when cancel clicked', async () => {
    const user = userEvent.setup();
    render(<ResearchCall />);
    const endButton = screen.getByTestId('end-call-button');
    await user.click(endButton);
    const cancelButton = screen.getByText('Отмена');
    await user.click(cancelButton);
    expect(screen.queryByTestId('end-call-modal-title')).not.toBeInTheDocument();
  });

  it('should switch tabs when clicking guide/notes/timeline', async () => {
    const user = userEvent.setup();
    render(<ResearchCall />);
    expect(screen.getByText('Interview guide')).toBeInTheDocument();
    const notesTab = screen.getByText('Notes');
    await user.click(notesTab);
    expect(screen.getByText('Notes will appear here')).toBeInTheDocument();
    const timelineTab = screen.getByText('Timeline');
    await user.click(timelineTab);
    expect(screen.getByText('Timeline will appear here')).toBeInTheDocument();
  });
});
