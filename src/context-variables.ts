'use client';

import { createContext, Dispatch, SetStateAction } from 'react';

interface ContextVariables {
  userId: number;
  userUid: string;
  userFirstName: string;
  userLastName: string;
  setUserId: Dispatch<SetStateAction<number>>;
  setUserUid: Dispatch<SetStateAction<string>>;
  setUserFirstName: Dispatch<SetStateAction<string>>;
  setUserLastName: Dispatch<SetStateAction<string>>;
}

const defaultState = {
  userId: 0,
  userUid: "noUid",
  userFirstName: "NoFirstName",
  userLastName: "NoLastName",
  setUserId: () => {},
  setUserUid: () => {},
  setUserFirstName: () => {},
  setUserLastName: () => {},
}

export const ContextVariables = createContext<ContextVariables>(defaultState);

