import React from 'react';

export default (props) => {
  const {
    name,
    isSelected,
    canvasHeight,
    canvasWidth,
    width,
    centerX,
    amplitude,
  } = props;

  const halfHeight = canvasHeight / 2;
  const c1x = centerX - width / 2;
  const c1y = halfHeight;
  const c2x = centerX + width / 2;
  const c2y = halfHeight;

  return (
    <svg
      height={canvasHeight}
      width={canvasWidth}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    >
      <path
        d={`
            M ${c1x} ${c1y}
            Q ${c1x + (c2x - c1x) / 2} ${halfHeight - amplitude}, ${c2x} ${c2y}
            `}
        stroke="cyan"
        fill="blue"
        fillOpacity={0.5}
      />

      <circle
        cx={centerX}
        cy={halfHeight}
        r="20"
        fill={isSelected ? 'magenta' : 'grey'}
        fillOpacity={0.5}
      />

      <text
        x={centerX}
        y={halfHeight + canvasHeight / 60}
        textAnchor="middle">
        {name}
      </text>
    </svg>
  );
}