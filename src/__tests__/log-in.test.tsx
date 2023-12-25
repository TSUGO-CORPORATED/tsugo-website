// IMPORT MODULES
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import SkipLogIn from '@/app/auth/skip-log-in';
import LogInCard from '@/app/log-in/log-in-card';
import LogInForm from '@/app/log-in/log-in-form';
import React, { ReactElement, useState } from 'react';

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
describe('Render', () => {
  test('render the skip log in component succesfully', () => {
    const { container } = render(<SkipLogIn />);
    expect(container).toBeInTheDocument();
  });

  test('render the log in card component succesfully', () => {
    const { container } = render(<LogInCard />);
    expect(container).toBeInTheDocument();
  });

  test('Render the elements', () => {
    render(<LogInCard />);

    const heading = screen.getByTestId('heading');
    const logo = screen.getByTestId('logo');
    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');


    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Log In to Your Account');
    expect(logo).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });
});

// TEST BEHAVIOR
describe('Behavior', () => {
  test('should be able to add text to the input', async () => {
    render(<LogInCard />);

    const inputEmail = screen.getByPlaceholderText('Enter your email');
    const inputPassword = screen.getByPlaceholderText('Enter your password');

    await userEvent.type(inputEmail, 'abc@gmail.com');
    await userEvent.type(inputPassword, 'testpassword');

    expect(inputEmail).toHaveValue('abc@gmail.com');
    expect(inputPassword).toHaveValue('testpassword');
  });

  test('should call logIn function when submitted', async () => {
    const logIn = jest.fn(e => e.preventDefault());
    const email = 'abc@gmail.com';
    const password = 'testpassword';
    const setEmail = jest.fn();
    const setPassword = jest.fn();

    render(<LogInForm handleSubmit={logIn} email={email} password={password} setEmail={setEmail} setPassword={setPassword}/>);

    const button = screen.getByTestId('button');
    fireEvent.click(button);
    expect(logIn).toHaveBeenCalledTimes(1);
  });
});