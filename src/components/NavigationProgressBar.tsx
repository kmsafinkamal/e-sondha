'use client';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  const start = () => {
    clearTimers();
    setVisible(true);
    setProgress(15);

    // Progressive trickle animation
    const t1 = setTimeout(() => setProgress(45), 100);
    const t2 = setTimeout(() => setProgress(70), 280);
    const t3 = setTimeout(() => setProgress(85), 550);
    timerRef.current = [t1, t2, t3];
  };

  const complete = () => {
    clearTimers();
    setProgress(100);
    const tFinish = setTimeout(() => {
      setVisible(false);
      const tReset = setTimeout(() => setProgress(0), 200);
      timerRef.current.push(tReset);
    }, 200);
    timerRef.current.push(tFinish);
  };

  // Complete progress on route change
  useEffect(() => {
    complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept all internal link clicks for instant 0ms tactile feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external, target="_blank", mailto, tel, or hash links
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        anchor.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if clicking link to current exact URL
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl || href === window.location.pathname) {
        return;
      }

      // Internal route navigation detected -> trigger progress instantly
      start();
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      clearTimers();
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="h-[2.5px] bg-[#25435a] transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 8px rgba(37, 67, 90, 0.6), 0 0 2px #25435a',
        }}
      >
        {/* Glow peg at the leading edge */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/40" />
      </div>
    </div>
  );
}
