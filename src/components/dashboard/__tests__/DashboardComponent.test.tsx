import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardComponent from '../DashboardComponent';

const mockStats = {
  totalLeads: 1234,
  conversionRate: 24.5,
  activeMeetings: 15,
  runningCampaigns: 8
};

describe('DashboardComponent', () => {
  it('renders without crashing', () => {
    render(<DashboardComponent stats={mockStats} />);
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
  });

  it('displays loading skeleton when isLoading is true', () => {
    render(<DashboardComponent stats={mockStats} isLoading={true} />);
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    const onError = vi.fn();
    const error = new Error('Test error');
    
    render(
      <DashboardComponent
        stats={mockStats}
        onError={onError}
      />
    );
    
    // Simulate an error
    fireEvent.error(window, new ErrorEvent('error', { error }));
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('renders all stat cards with correct values', () => {
    render(<DashboardComponent stats={mockStats} />);
    
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('24.5%')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders quick action buttons', () => {
    render(<DashboardComponent stats={mockStats} />);
    
    const quickActions = screen.getAllByRole('button', { name: /Quick/i });
    expect(quickActions).toHaveLength(3);
  });
});