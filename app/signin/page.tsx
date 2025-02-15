'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { MantraAuthForm } from '@/components/auth/auth-login';
import { BackgroundBeams } from "@/components/auth/background-beams";

export default function AuthForm() {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      redirect('/calendar');
    }
  }, [status]);

  return (
    <div className="size-full flex items-center justify-center p-4 relative">
      <BackgroundBeams />
      <MantraAuthForm />
    </div>
  );
}

