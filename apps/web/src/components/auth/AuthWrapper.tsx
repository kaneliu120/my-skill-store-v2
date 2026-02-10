'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import AuthModal from './AuthModal';

export default function AuthWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  );
}
