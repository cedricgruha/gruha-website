import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface AgentCard {
    id: number;
    name: string;
    status: string;
    tag: string;
    description: string;
    image: string;
    color: string; // The primary color for the card
}

const cardsData: AgentCard[] = [
    {
        id: 1,
        name: "Kabir",
        status: "Active",
        tag: "Projects Curator",
        description: "Handpicks projects that match your stage of life, budget, and builder trust score.",
        image: "https://i.pravatar.cc/300?u=kabir",
        color: "bg-[#60A5FA]", // Specific blue from image
    },
    {
        id: 2,
        name: "Riya",
        status: "Active",
        tag: "Location Explorer",
        description: "Maps micro-market dynamics, commute realities, and neighbourhood trajectories over 5 years.",
        image: "https://i.pravatar.cc/300?u=riya",
        color: "bg-[#4FD1C5]", // Teal/Green peeking card
    },
    {
        id: 3,
        name: "Ananya",
        status: "Busy",
        tag: "Finance Expert",
        description: "Evaluates mortgage options and tax benefits to optimize your real estate investment.",
        image: "https://i.pravatar.cc/300?u=ananya",
        color: "bg-[#E9D5A3]", // Beige/Tan peeking card
    }
];

const ExactCardSlider: React.FC = () => {
    const [cards, setCards] = useState<AgentCard[]>(cardsData);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Function to move to next card (Shuffle to back)
    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        const topCard = cardsRef.current[0];
        if (!topCard) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setCards((prev) => {
                    const newCards = [...prev];
                    const first = newCards.shift()!;
                    newCards.push(first);
                    return newCards;
                });
                setIsAnimating(false);
            }
        });

        tl.to(topCard, {
            x: 100,
            y: -20,
            rotation: 15,
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "power2.inOut"
        });
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // To move backwards, we take the last card and bring it to front
        setCards((prev) => {
            const newCards = [...prev];
            const last = newCards.pop()!;
            newCards.unshift(last);
            return newCards;
        });

        // Reset animation state after the React re-render + GSAP layout effect
        setTimeout(() => setIsAnimating(false), 500);
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                // Visual Logic:
                // index 0: Center (Blue)
                // index 1: Rotated Left (Teal)
                // index 2: Rotated Right (Beige)

                let rotation = 0;
                let xOffset = 0;
                let scale = 1;
                let opacity = 1;

                if (index === 1) {
                    rotation = -12;
                    xOffset = -40;
                    scale = 0.92;
                } else if (index === 2) {
                    rotation = 12;
                    xOffset = 40;
                    scale = 0.92;
                } else if (index > 2) {
                    opacity = 0; // Hide others
                }

                gsap.to(card, {
                    x: xOffset,
                    rotation: rotation,
                    scale: scale,
                    opacity: opacity,
                    zIndex: cards.length - index,
                    duration: 0.6,
                    ease: "expo.out"
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [cards]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="relative flex items-center justify-center w-full max-w-2xl">

                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute left-[-20px] md:left-[-80px] z-50 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* The Card Stack */}
                <div className="relative w-[340px] h-[520px]" ref={containerRef}>
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className={`absolute inset-0 ${card.color} rounded-[45px] p-8 flex flex-col items-center text-white shadow-2xl overflow-hidden`}
                        >
                            {/* Header */}
                            <div className="w-full flex justify-between items-center mb-6">
                                <div className="bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                                    <span className="text-xs font-bold">{card.status}</span>
                                </div>
                                <span className="text-xs font-bold opacity-60">2 of 6</span>
                            </div>

                            {/* Profile Image with Glow Effect */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-110" />
                                <div className="relative w-44 h-44 rounded-full border-4 border-white/30 p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 shadow-inner">
                                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <h3 className="text-4xl font-serif mb-6 tracking-tight">{card.name}</h3>

                            {/* Tag Pill */}
                            <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full flex items-center gap-2 mb-10 border border-white/10 shadow-sm">
                                <Plus size={14} className="opacity-80" />
                                <span className="text-sm font-medium">{card.tag}</span>
                            </div>

                            {/* Description */}
                            <p className="text-[15px] leading-relaxed text-center font-medium opacity-90 px-2">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute right-[-20px] md:right-[-80px] z-50 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Pagination (Bottom) */}
                <div className="absolute bottom-[-60px] flex items-center gap-2.5">
                    <div className="w-2 h-2 bg-blue-200 rounded-full" />
                    <div className="w-10 h-2 bg-blue-500 rounded-full" /> {/* The active pill */}
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-blue-200 rounded-full" />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ExactCardSlider;