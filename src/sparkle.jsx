import React from 'react';
import styled, { keyframes } from 'styled-components';

// Utility functions
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const range = (start, end = start) => Array.from({ length: end - start }, (_, i) => i + start);

// Hook: Prefers Reduced Motion
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// Hook: Random Interval
const useRandomInterval = (callback, minDelay, maxDelay) => {
  const timeoutId = React.useRef(null);
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const isEnabled = typeof minDelay === 'number' && typeof maxDelay === 'number';
    if (!isEnabled) return;

    const handleTick = () => {
      const nextTick = random(minDelay, maxDelay);
      timeoutId.current = setTimeout(() => {
        savedCallback.current();
        handleTick();
      }, nextTick);
    };

    handleTick();
    return () => clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);
};

// Generate a sparkle
const generateSparkle = (color) => ({
  id: String(random(10000, 99999)),
  createdAt: Date.now(),
  color,
  size: random(10, 20),
  style: {
    top: random(0, 100) + '%',
    left: random(0, 100) + '%',
  },
});

// Main Sparkles Component
const DEFAULT_COLOR = '#FFC700';

const Sparkles = ({ color = DEFAULT_COLOR, sparkling = true, children, ...delegated }) => {
  const [sparkles, setSparkles] = React.useState(() =>
    range(10).map(() => generateSparkle(color))
  );

  const prefersReducedMotion = usePrefersReducedMotion();

  useRandomInterval(
    () => {
      if (!sparkling) return;
  
      const sparkle = generateSparkle(color);
      const now = Date.now();
      const nextSparkles = sparkles.filter((sp) => now - sp.createdAt < 750);
      nextSparkles.push(sparkle);
      setSparkles(nextSparkles);
    },
    sparkling && !prefersReducedMotion ? 20 : null,
    sparkling && !prefersReducedMotion ? 100 : null
  );

  return (
    <Wrapper {...delegated}>
      {sparkling &&
        sparkles.map((sparkle) => (
          <Sparkle
            key={sparkle.id}
            color={sparkle.color}
            size={sparkle.size}
            style={sparkle.style}
          />
        ))}
      <ChildWrapper>{children}</ChildWrapper>
    </Wrapper>
  );
};

// Single Sparkle Component
const Sparkle = ({ size, color, style }) => {
  const path =
    'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z';

  return (
    <SparkleWrapper style={style}>
      <SparkleSvg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <path d={path} fill={color} />
      </SparkleSvg>
    </SparkleWrapper>
  );
};

// Animations
const comeInOut = keyframes`
  0% { transform: scale(0); }
  50% { transform: scale(1); }
  100% { transform: scale(0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(180deg); }
`;

// Styled Components
const Wrapper = styled.span`
  display: inline-block;
  position: relative;
`;

const SparkleWrapper = styled.span`
  position: absolute;
  display: block;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${comeInOut} 700ms forwards;
  }
`;

const SparkleSvg = styled.svg`
  display: block;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${spin} 1000ms linear;
  }
`;

const ChildWrapper = styled.strong`
  position: relative;
  z-index: 1;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Sparkles;