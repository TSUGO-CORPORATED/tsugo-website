'use client';

import { createContext, Dispatch, SetStateAction } from 'react';

interface ContextVariables {
  userId: number;
  userUid: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPhotoUrl: string;
  setUserId: Dispatch<SetStateAction<number>>;
  setUserUid: Dispatch<SetStateAction<string>>;
  setUserFirstName: Dispatch<SetStateAction<string>>;
  setUserLastName: Dispatch<SetStateAction<string>>;
  setUserEmail: Dispatch<SetStateAction<string>>;
  setUserPhotoUrl: Dispatch<SetStateAction<string>>;
}

const defaultState = {
  userId: 0,
  userUid: "noUid",
  userFirstName: "NoFirstName",
  userLastName: "NoLastName",
  userEmail: "NoEmail",
  userPhotoUrl: "NoPhotoUrl",
  setUserId: () => {},
  setUserUid: () => {},
  setUserFirstName: () => {},
  setUserLastName: () => {},
  setUserEmail: () => {},
  setUserPhotoUrl: () => {},
}

export const ContextVariables = createContext<ContextVariables>(defaultState);

