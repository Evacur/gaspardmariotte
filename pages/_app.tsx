import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const DURATION = 0.5 

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url === router.asPath) return;
      setIsAnimating(true);
      setShowContent(false); 
      setPendingRoute(url);
    };
    router.events.on('routeChangeStart', handleStart);

    return () => {
      router.events.off('routeChangeStart', handleStart);
    };
   
  }, [router.asPath]);


  useEffect(() => {
    if (!isAnimating || !pendingRoute) return;
   
    const timeout = setTimeout(() => {
      setIsAnimating(false);
      setPendingRoute(null);
      setShowContent(true); 
    }, DURATION * 1000 * 2);
    return () => clearTimeout(timeout);
  }, [isAnimating, pendingRoute]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isAnimating && (
          <motion.div
            key={pendingRoute}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: DURATION, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              width: "100vw",
              height: "100vh",
              background: "#18181b",
              zIndex: 9999,
              pointerEvents: "none"
            }}
          />
        )}
      </AnimatePresence>
      {showContent && <Component key={router.asPath} {...pageProps} />}
    </>
  )
}
