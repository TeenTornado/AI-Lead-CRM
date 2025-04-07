import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RevenueAnalyticsComponent from '../RevenueAnalyticsComponent';

const mockMetrics = {
  mrr: 50000,
  arr: 600000,
  forecast: [55000, 58000, 62000, 65000, 70000, 75000],
  sources: {
    'Direct Sales': 300000,
    'Channel Partners': 200000,
    'Online': 100000
  }
};

describe('RevenueAnalyticsComponent', () => {
  it('renders without crashing', () => {
    render(<RevenueAnalyticsComponent metrics={mockMetrics} />);
    expect(screen.getByText('Monthly Recurring Revenue')).toBeInTheDocument();
  });

  it('displays loading skeleton when isLoading is true', () => {
    render(<RevenueAnalyticsComponent metrics={mockMetrics} isLoading={true} />);
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    const onError = vi.fn();
    const error = new Error('Test error');
    
    render(
      <RevenueAnalyticsComponent
        metrics={mockMetrics}
        onError={onError}
      />
    );
    
    // Simulate an error
    fireEvent.error(window, new ErrorEvent('error', { error }));
    
    expect(screen.getByText('Analytics Error')).toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('renders all metric cards with correct values', () => {
    render(<RevenueAnalyticsComponent metrics={mockMetrics} />);
    
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$600,000')).toBeInTheDocument();
  });

  it('renders all charts', () => {
    render(<RevenueAnalyticsComponent metrics={mockMetrics} />);
    
    expect(screen.getByText('Revenue Forecast')).toBeInTheDocument();
    expect(screen.getByText('Revenue Sources')).toBeInTheDocument();
    expect(screen.getByText('Revenue Trends')).toBeInTheDocument();
  });
});