import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Page from '../src/app/page';
import LandingPage from '../src/app/landing-page';
import CheckAuth from '@/app/auth/check-auth';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      pathname: '',
      push: () => jest.fn(),
      // ... whatever else you you call on `router`
    };
  },

  usePathname() {
    return '';
  },
}));


// MOCK JEST
// const mockedUseRouter = jest.fn();
// jest.mock("next/navigation", () => ({
//   useRouter: () => mockedUseRouter(),
//   usePathname: jest.fn().mockReturnValue(''),
// }));

describe('Check landing page components', () => {
  test('render the landing page component succesfully', () => {
    const { container } = render(<CheckAuth />);
    expect(container).toBeInTheDocument();
  });

  test('render the checkauth component succesfully', () => {
    const { container } = render(<LandingPage />);
    expect(container).toBeInTheDocument();
  })

  test('renders a heading', () => {
    render(<LandingPage />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})