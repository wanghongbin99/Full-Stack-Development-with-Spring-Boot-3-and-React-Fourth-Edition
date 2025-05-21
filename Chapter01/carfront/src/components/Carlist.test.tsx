import { render, screen } from '@testing-library/react';
import Carlist from './Carlist';

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: (props: any) => <div data-testid="datagrid-mock" {...props} />,
}));

describe('Carlist', () => {
  it('renders without crashing', () => {
    render(<Carlist />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});