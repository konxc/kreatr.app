import { describe, test, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { DashboardOverview } from '@/components/dashboard/overview'

describe('Dashboard Components', () => {
  test('DashboardOverview renders stats correctly', () => {
    const stats = {
      totalContent: 24,
      scheduledPosts: 8,
      totalViews: 12500,
      creditsRemaining: 50,
    }

    render(<DashboardOverview stats={stats} />)

    expect(screen.getByText('24')).toBeDefined()
    expect(screen.getByText('8')).toBeDefined()
    expect(screen.getByText('12.5K')).toBeDefined()
    expect(screen.getByText('50')).toBeDefined()
  })

  test('DashboardOverview handles undefined stats', () => {
    render(<DashboardOverview />)

    expect(screen.getByText('0')).toBeDefined()
  })
})
