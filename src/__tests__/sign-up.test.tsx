// IMPORT MODULES
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import SkipLogIn from '@/app/auth/skip-log-in';
import SignUpCard from '@/app/sign-up/sign-up-card';
import React, { ReactElement, useState } from 'react';
import SignUpForm from '@/app/sign-up/sign-up-form';

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
    const { container } = render(<SignUpCard />);
    expect(container).toBeInTheDocument();
  });

  test('Render the elements', () => {
    render(<SignUpCard />);

    const cardContainer = screen.getByTestId('cardContainer');
    const heading = screen.getByTestId('heading');
    const logo = screen.getByTestId('logo');
    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');
    const firstName = screen.getByTestId('firstName');
    const lastName = screen.getByTestId('lastName');
    const haveAccountText = screen.getByTestId('haveAccountText');
    const logInLink = screen.getByTestId('logInLink');

    expect(cardContainer).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Create Account');
    expect(logo).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(haveAccountText).toBeInTheDocument();
    expect(haveAccountText).toHaveTextContent('Already have an account?');
    expect(logInLink).toBeInTheDocument();
  });
});

// TEST BEHAVIOR
describe('Behavior', () => {
  test('log in link should redirect to /log-in', () => {
    render(<SignUpCard />);
    const link = screen.getByTestId('logInLink');
    expect(link.getAttribute('href')).toBe('/log-in');
  })

  test('should be able to add text to the input', async () => {
    render(<SignUpCard />);

    const inputEmail = screen.getByPlaceholderText('Enter your email');
    const inputPassword = screen.getByPlaceholderText('Enter your password');
    const inputFirstName = screen.getByPlaceholderText('Enter your first name');
    const inputLastName = screen.getByPlaceholderText('Enter your last name');

    // console.log(email);
    await userEvent.type(inputEmail, 'abc@gmail.com');
    await userEvent.type(inputPassword, 'testpassword');
    await userEvent.type(inputFirstName, 'testfirstname');
    await userEvent.type(inputLastName, 'testlastname');

    expect(inputEmail).toHaveValue('abc@gmail.com');
    expect(inputPassword).toHaveValue('testpassword');
    expect(inputFirstName).toHaveValue('testfirstname');
    expect(inputLastName).toHaveValue('testlastname');
  });

  test('should call logIn function when submitted', async () => {
    const passwordSignUp = jest.fn(e => e.preventDefault());
    const email = 'abc@gmail.com';
    const password = 'testpassword';
    const firstName = 'testfirstname';
    const lastName = 'testlastname';
    const setEmail = jest.fn();
    const setPassword = jest.fn();
    const setFirstName = jest.fn();
    const setLastName = jest.fn();

    render(<SignUpForm handleSubmit={passwordSignUp} email={email} password={password} firstName={firstName} lastName={lastName} setEmail={setEmail} setPassword={setPassword} setFirstName={setFirstName} setLastName={setLastName}/>);

    const button = screen.getByTestId('button');
    fireEvent.click(button);
    expect(passwordSignUp).toHaveBeenCalledTimes(1);
  });
});