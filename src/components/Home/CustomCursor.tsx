import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

const PALETTE = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
];

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef({ x: -100, y: -100 });
  const colorIndexRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Check touch devices
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
    }
  }, []);

  // Particle Canvas Animation Loop
  useEffect(() => {
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        p.size = Math.max(0.5, p.size * 0.96);

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isTouch]);

  // Mouse movement, clicks, and element hover inspection
  useEffect(() => {
    if (isTouch) return;

    // Helper to spawn ink droplets
    const spawnParticles = (x: number, y: number, count = 2, speedMultiplier = 1) => {
      for (let i = 0; i < count; i++) {
        colorIndexRef.current = (colorIndexRef.current + 1) % PALETTE.length;
        const color = PALETTE[colorIndexRef.current];
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 1.8 + 0.6) * speedMultiplier;
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.4, // subtle gravity downward
          size: Math.random() * 4.5 + 2.5,
          color,
          alpha: 1,
          life: 0,
          maxLife: Math.floor(Math.random() * 30 + 24),
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });
      if (!isVisible) setIsVisible(true);

      // Calculate distance from last position to spawn ink trail
      const dx = clientX - lastPosRef.current.x;
      const dy = clientY - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 4) {
        // Spawn ink drops at tip of the pencil (adjusting coordinates slightly)
        const tipX = clientX;
        const tipY = clientY;
        spawnParticles(tipX, tipY, dist > 20 ? 3 : 1, 1);
        lastPosRef.current = { x: clientX, y: clientY };
      }

      // Check if target is clickable
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.closest('button') !== null ||
          target.closest('a') !== null ||
          target.closest('input') !== null ||
          target.closest('textarea') !== null ||
          target.closest('select') !== null ||
          target.closest('[role="button"]') !== null ||
          target.closest('[onclick]') !== null ||
          target.classList.contains('cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer';

        setIsPointer(isInteractive);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Burst ink droplets on click
      spawnParticles(e.clientX, e.clientY, 12, 2.5);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Global CSS to hide default cursor across Home Page */}
      <style>{`
        body, a, button, input, select, textarea, [role="button"], * {
          cursor: none !important;
        }
      `}</style>

      {/* Particle ink trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[99998]"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Custom Emoji Cursor */}
      <div
        className={`fixed pointer-events-none z-[99999] transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isPointer
            ? `translate(-30%, -10%) scale(${isClicking ? 0.82 : 1.1})`
            : `translate(-15%, -80%) scale(${isClicking ? 0.85 : 1})`,
          transition: 'transform 0.08s ease-out, opacity 0.15s ease-out',
        }}
      >
        {/* Soft glowing aura under cursor */}
        <div
          className={`absolute -inset-2 rounded-full blur-md opacity-40 transition-colors duration-300 pointer-events-none ${isPointer ? 'bg-indigo-400' : 'bg-pink-400'
            }`}
        />

        {/* Emoji Display */}
        <div className="relative text-2xl sm:text-3xl select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in duration-100">
          {isPointer ? '👆' : '✏️'}
        </div>
      </div>
    </>
  );
}
