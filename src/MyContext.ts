'use client';

import { createContext, Dispatch, SetStateAction } from 'react';

interface MyContext {
  userId: number;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  setUserId: Dispatch<SetStateAction<number>>;
  setUserEmail: Dispatch<SetStateAction<string>>;
  setUserFirstName: Dispatch<SetStateAction<string>>;
  setUserLastName: Dispatch<SetStateAction<string>>;
}

const defaultState = {
  userId: 0,
  userEmail: "testEmail",
  userFirstName: "testFirstName",
  userLastName: "testLastName",
  setUserId: () => {},
  setUserEmail: () => {},
  setUserFirstName: () => {},
  setUserLastName: () => {},
}

export const MyContext = createContext<MyContext>(defaultState);

