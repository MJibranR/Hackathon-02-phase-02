import { render, screen } from '@testing-library/react';
import Home from '../src/app/page'; // Assuming your Home component is here

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Welcome to Next.js!/i });
    expect(heading).toBeInTheDocument();
  });
});
