
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    // Show button when page is scrolled down more than 300px
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        variant="secondary"
        size="icon"
        onClick={scrollToTop}
        className={cn(
          'h-12 w-12 rounded-full shadow-lg transition-opacity hover:bg-primary/90 hover:text-primary-foreground',
          isVisible ? 'opacity-100' : 'opacity-0',
          'pointer-events-auto' 
        )}
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      >
        <ArrowUp className="h-6 w-6" />
        <span className="sr-only">Go to top</span>
      </Button>
    </div>
  );
}
