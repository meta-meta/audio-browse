import React from 'react';

export default (props) => {
  const {
    name,
    isSelected,
    canvasHeight,
    canvasWidth,
    width,
    amplitude,
    selectHandler,
  } = props;

  const centerX = Math.max(20, props.centerX)
  const halfHeight = canvasHeight / 1.7;
  const c1x = centerX - width / 2;
  const c1y = halfHeight;
  const c2x = centerX + width / 2;
  const c2y = halfHeight;

  return (
    <div>
      <div
        onMouseDown={selectHandler}
        onTouchStart={selectHandler}
        style={{
          position: 'absolute',
          top: halfHeight - 20,
          // left: (c1x + (c2x - c1x) / 2) - Math.max(40, (c2x - c1x)) / 2,
          // height: Math.max(40, amplitude / 2),
          // width: Math.max(40, (c2x - c1x)),
          left: centerX - 20,
          height: 40,
          width: 40,
          // border: '1px solid red',
          cursor: 'pointer',
          zIndex: 1,
        }}
      />

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
          fillOpacity={0.4}
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
          y={halfHeight + 40}
          fill="grey"
          textAnchor="middle">
          {name}
        </text>
      </svg>
    </div>
  );
}
