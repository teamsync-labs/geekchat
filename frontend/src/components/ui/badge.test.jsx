import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('should render badge with text', () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText('Badge')).toBeInTheDocument();
  });
  it('should apply variant classes', () => {
    render(<Badge variant="destructive">Danger</Badge>);
    const badge = screen.getByText('Danger');
    expect(badge.className).toContain('destructive');
  });
});
