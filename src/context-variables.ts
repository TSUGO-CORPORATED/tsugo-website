'use client';

import { createContext, Dispatch, SetStateAction } from 'react';

interface ContextVariables {
  userId: number;
  // userEmail: string;
  userFirstName: string;
  userLastName: string;
  setUserId: Dispatch<SetStateAction<number>>;
  // setUserEmail: Dispatch<SetStateAction<string>>;
  setUserFirstName: Dispatch<SetStateAction<string>>;
  setUserLastName: Dispatch<SetStateAction<string>>;
}

const defaultState = {
  userId: 0,
  // userEmail: "NoEmail",
  userFirstName: "NoFirstName",
  userLastName: "NoLastName",
  setUserId: () => {},
  // setUserEmail: () => {},
  setUserFirstName: () => {},
  setUserLastName: () => {},
}

export const ContextVariables = createContext<ContextVariables>(defaultState);

