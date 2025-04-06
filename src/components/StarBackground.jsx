import React, { useEffect, useRef } from 'react';

const StarBackground = () => {
  const canvasRef = useRef(null);
  const stars = useRef([]);

  const initStars = (width, height, count = 100) => {
    const s = [];
    for (let i = 0; i < count; i++) {
      s.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.3 + 0.2,
      });
    }
    stars.current = s;
  };

  const animateStars = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);
    stars.current.forEach((star) => {
      star.y += star.speed;
      if (star.y > height) star.y = 0;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    });
    requestAnimationFrame(() => animateStars(ctx, width, height));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);
    animateStars(ctx, canvas.width, canvas.height);

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        background: 'black',
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default StarBackground;
