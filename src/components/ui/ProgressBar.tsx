import { useEffect, useRef, useState } from "react";

export default function ProgressBar() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isSticky, setIsSticky] = useState(false);

    const stickyHeaderRef = useRef<HTMLHeadingElement>(null);
    const isClickScrolling = useRef<boolean>(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        const handleScroll = () => {
            // Calculate Scroll Progress
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const currentProgress = (window.scrollY / totalHeight) * 100;
                setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
            }

            // Detect if StickyNav reached top: 0
            if (stickyHeaderRef.current) {
                const rect = stickyHeaderRef.current.getBoundingClientRect();
                // If sticky element top reaches <= 0 (or your sticky offset top threshold)
                setIsSticky(rect.top <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (

        isSticky && (
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden pointer-events-none z-50">
                <div
                    className="h-full transition-all duration-150 ease-out"
                    style={{
                        background: 'linear-gradient(90deg, #FF7E57 10.56%, #FF583A 100%)',
                        width: `${scrollProgress}%`,
                        WebkitMaskImage: `linear-gradient(to right, black ${Math.min(70 + (scrollProgress / 100) * 30, 100)}%, transparent 100%)`,
                        maskImage: `linear-gradient(to right, black ${Math.min(70 + (scrollProgress / 100) * 30, 100)}%, transparent 100%)`,
                    }}
                />
            </div>
        )
    )
}