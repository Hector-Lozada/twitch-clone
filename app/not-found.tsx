"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket, Home, RefreshCw } from 'lucide-react';

const NotFoundPage = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="relative">
          <motion.h1 
            className="text-9xl font-bold text-primary relative z-10"
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
          >
            404
          </motion.h1>
          <div className="absolute -top-4 -right-4 -z-0">
            <Rocket className="w-24 h-24 text-muted-foreground/20 animate-pulse" />
          </div>
        </div>

        <motion.h2 
          className="text-3xl md:text-4xl font-bold mt-6 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          ¡Ups! Página no encontrada
        </motion.h2>

        <motion.p 
          className="text-lg text-muted-foreground mb-8 max-w-md mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          La página que buscas podría haber sido eliminada, haber cambiado de nombre o no estar disponible temporalmente.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            onClick={() => router.push('/')}
            className="gap-2"
            size="lg"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Button>
          <Button 
            onClick={() => router.refresh()}
            variant="outline"
            className="gap-2"
            size="lg"
          >
            <RefreshCw className="w-5 h-5" />
            Reintentar
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 text-sm text-muted-foreground"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Redirigiendo en {countdown} segundos...
        </motion.div>

        <motion.div 
          className="mt-12 grid grid-cols-3 md:grid-cols-5 gap-4 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="h-8 w-8 bg-muted rounded-md"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;