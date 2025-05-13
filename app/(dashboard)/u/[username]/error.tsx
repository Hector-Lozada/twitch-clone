"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl w-full space-y-6">
        <div className="relative">
          <h1 className="text-9xl font-bold text-destructive">Error</h1>
          <AlertTriangle className="absolute -top-4 -right-4 w-24 h-24 text-muted-foreground/20" />
        </div>

        <h2 className="text-3xl font-bold">¡Ups! Algo salió mal</h2>

        <p className="text-muted-foreground">
          {error.message || 'Ocurrió un error inesperado.'}
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/')} className="gap-2">
            <Home className="w-5 h-5" />
            Volver al inicio
          </Button>
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="w-5 h-5" />
            Intentar nuevamente
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Redirigiendo en {countdown} segundos...
        </p>
      </div>
    </div>
  );
}