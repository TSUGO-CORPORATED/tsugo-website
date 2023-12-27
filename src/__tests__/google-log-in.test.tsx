// IMPORT MODULES
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { ReactElement } from 'react';
import GoogleLogIn from '@/app/auth/google-log-in';

// MOCK FUNCTION
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

// RENDER TEST
describe('Render components', () => {
  test('render log in button', () => {
    render(<GoogleLogIn />);

    const button = screen.getByTestId('google-button');
    expect(button).toBeInTheDocument();

  });
});