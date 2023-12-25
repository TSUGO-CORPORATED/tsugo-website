import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import LandingPage from '@/app/landing-page';
import CheckAuth from '@/app/auth/check-auth';
import React, { ReactElement } from 'react';


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


describe('Check landing page components', () => {
  test('render the landing page component succesfully', () => {
    const { container } = render(<CheckAuth />);
    expect(container).toBeInTheDocument();
  });

  test('render the checkauth component succesfully', () => {
    const { container } = render(<LandingPage />);
    expect(container).toBeInTheDocument();
  })

  test('renders headings and description', () => {
    // Arrange
    render(<LandingPage />)
 
    // Act
    // const headingGroup = screen.getAllByRole('heading', { level: 1 })
    const headingWelcome = screen.getByTestId('heading-welcome');
    const headingTo = screen.getByTestId('heading-to');
    const headingTsugo = screen.getByTestId('heading-tsugo');
    const description = screen.getByText('Where Connections Blossom - Making Language Support Always "Tsugo" for You!');
 
    // Assert
    expect(headingWelcome).toBeInTheDocument();
    expect(headingWelcome).toHaveTextContent('Welcome');
    expect(headingTo).toBeInTheDocument();
    expect(headingTo).toHaveTextContent('to');
    expect(headingTsugo).toBeInTheDocument();
    expect(headingTsugo).toHaveTextContent('Tsugo');
    expect(description).toBeVisible();
  })
});

describe("Test button to log-in", () => {
  test('should exist', () => {
    render(<LandingPage />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  describe('links', () => {
    // jest.mock(
    //   'next/link',
    //   () =>
    //     ({ children, ...rest }: { children: ReactElement }) =>
    //       React.cloneElement(children, { ...rest }),
    // );

    it('should redirect to / when clicking on "The React Parks" text', () => {
      render(<LandingPage />);
      const button = screen.getByTestId('link');
      expect(button.getAttribute('href')).toBe('/log-in');
    })
  });
});
