import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

const getRandomDirection = () =>
  directions[Math.floor(Math.random() * directions.length)];

const FlyingText = ({ triggerCount, texts, originRef }) => {
  const [visibleTexts, setVisibleTexts] = useState([]);

  useEffect(() => {
    if (triggerCount === 0 || triggerCount > texts.length) return;

    const rect = originRef.current?.getBoundingClientRect();

    if (rect) {
      const text = texts[triggerCount - 1];
      const direction = getRandomDirection();
      const newText = {
        id: Date.now(),
        text,
        direction,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2 + window.scrollY, // <- this part is important!
      };

      setVisibleTexts((prev) => [...prev, newText]);

      setTimeout(() => {
        setVisibleTexts((prev) => prev.filter((t) => t.id !== newText.id));
      }, 5000);
    }
  }, [triggerCount, texts, originRef]);

  return (
    <>
      {visibleTexts.map(({ id, text, direction, x, y }) => (
        <AnimatedText
          key={id}
          $direction={direction}
          style={{ top: y, left: x }}
        >
          {text}
        </AnimatedText>
      ))}
    </>
  );
};

export default FlyingText;
const popOut = {
    'top-left': keyframes`
      50% { transform: translate(-25vw, -25vw); opacity: .5; }
      100% { transform: translate(-50vw, -50vw); opacity: 0; }
    `,
    'top-right': keyframes`
      50% { transform: translate(25vw, -25vw); opacity: .5; }
      100% { transform: translate(50vw, -50vw); opacity: 0; }
    `,
    'bottom-left': keyframes`
      50% { transform: translate(-25vw, 25vw); opacity: .5; }
      100% { transform: translate(-50vw, 50vw); opacity: 0; }
    `,
    'bottom-right': keyframes`
      50% { transform: translate(25vw, 25vw); opacity: .5; }
      100% { transform: translate(50vw, 50vw); opacity: 0; }
    `,
  };
  
  const AnimatedText = styled.span`
    position: fixed;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: bold;
    pointer-events: none;
    animation: ${({ $direction }) => popOut[$direction]} 15s forwards;
    z-index: 9999;
  `;
  