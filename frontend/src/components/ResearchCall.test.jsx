import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import ResearchCall from './ResearchCall'

describe('ResearchCall', () => {
  const mockOnGoHome = vi.fn()

  it('should render call screen', async () => {
    await act(async () => {
      render(<ResearchCall onGoHome={mockOnGoHome} />)
    })
    expect(screen.getByText('Alex Kim')).toBeInTheDocument()
  })
})
