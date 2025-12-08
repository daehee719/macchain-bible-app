import React from 'react'
import { cn } from '../utils/cn'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text, 
  fullScreen = false,
  className 
}) => {
  const sizeMultiplier = {
    sm: 0.6,
    md: 1,
    lg: 1.5
  }

  const multiplier = sizeMultiplier[size]
  const viewSize = 200 * multiplier
  const centerX = viewSize / 2
  const centerY = viewSize / 2

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-12'

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-4">
        {/* SVG 십자가 일러스트 로딩 애니메이션 */}
        <svg
          width={viewSize}
          height={viewSize}
          viewBox={`0 0 ${viewSize} ${viewSize}`}
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            {/* 배경 그라데이션 - 어두운 구름 효과 */}
            <radialGradient id="cloudGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgb(30, 41, 59)" stopOpacity="0.9">
                <animate attributeName="stop-opacity" values="0.7; 0.9; 0.7" dur="4s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stopColor="rgb(15, 23, 42)" stopOpacity="1">
                <animate attributeName="stop-opacity" values="0.8; 1; 0.8" dur="4s" repeatCount="indefinite" begin="1s"/>
              </stop>
            </radialGradient>

            {/* 빛의 광선 그라데이션 */}
            <linearGradient id="lightRayGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity="0.8">
                <animate attributeName="stop-opacity" values="0.4; 0.8; 0.4" dur="3s" repeatCount="indefinite"/>
              </stop>
              <stop offset="50%" stopColor="rgb(251, 191, 36)" stopOpacity="0.4">
                <animate attributeName="stop-opacity" values="0.2; 0.4; 0.2" dur="3s" repeatCount="indefinite" begin="0.5s"/>
              </stop>
              <stop offset="100%" stopColor="rgb(251, 191, 36)" stopOpacity="0">
                <animate attributeName="stop-opacity" values="0; 0.2; 0" dur="3s" repeatCount="indefinite" begin="1s"/>
              </stop>
            </linearGradient>

            {/* 십자가 글로우 효과 */}
            <filter id="crossGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* 십자가 그라데이션 */}
            <linearGradient id="crossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="1"/>
              <stop offset="100%" stopColor="rgb(124, 58, 237)" stopOpacity="1">
                <animate attributeName="stop-opacity" values="0.8; 1; 0.8" dur="2.5s" repeatCount="indefinite"/>
              </stop>
            </linearGradient>

            {/* CSS 스타일 */}
            <style>{`
              .cross-wood { 
                fill: url(#crossGradient);
                stroke: rgb(167, 139, 250);
                stroke-width: 1.5;
                filter: url(#crossGlow);
              }
              .light-ray {
                fill: url(#lightRayGradient);
                opacity: 0.6;
              }
              .cloud {
                fill: url(#cloudGradient);
              }
            `}</style>
          </defs>

          {/* 배경 - 어두운 구름 */}
          <rect width={viewSize} height={viewSize} className="cloud" rx="4"/>

          {/* 구름 텍스처 (간단한 형태) */}
          <ellipse cx={viewSize * 0.3} cy={viewSize * 0.2} rx={viewSize * 0.15} ry={viewSize * 0.1} fill="rgb(30, 41, 59)" opacity="0.3">
            <animate attributeName="cx" values={`${viewSize * 0.3}; ${viewSize * 0.35}; ${viewSize * 0.3}`} dur="8s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx={viewSize * 0.7} cy={viewSize * 0.15} rx={viewSize * 0.12} ry={viewSize * 0.08} fill="rgb(30, 41, 59)" opacity="0.3">
            <animate attributeName="cx" values={`${viewSize * 0.7}; ${viewSize * 0.65}; ${viewSize * 0.7}`} dur="6s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx={viewSize * 0.2} cy={viewSize * 0.4} rx={viewSize * 0.1} ry={viewSize * 0.06} fill="rgb(30, 41, 59)" opacity="0.25">
            <animate attributeName="cy" values={`${viewSize * 0.4}; ${viewSize * 0.38}; ${viewSize * 0.4}`} dur="7s" repeatCount="indefinite"/>
          </ellipse>

          {/* 빛의 광선 - 우측 상단에서 비추는 효과 */}
          <g>
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1; 1.1; 1"
              dur="3s"
              repeatCount="indefinite"
            />
            {/* 광선 1 */}
            <polygon
              points={`${viewSize * 0.85},${viewSize * 0.1} ${viewSize * 0.95},${viewSize * 0.15} ${viewSize * 0.75},${viewSize * 0.35} ${viewSize * 0.65},${viewSize * 0.3}`}
              className="light-ray"
            />
            {/* 광선 2 */}
            <polygon
              points={`${viewSize * 0.9},${viewSize * 0.05} ${viewSize * 1},${viewSize * 0.1} ${viewSize * 0.7},${viewSize * 0.5} ${viewSize * 0.6},${viewSize * 0.45}`}
              className="light-ray"
            >
              <animate attributeName="opacity" values="0.5; 0.7; 0.5" dur="2.5s" repeatCount="indefinite"/>
            </polygon>
            {/* 광선 3 */}
            <polygon
              points={`${viewSize * 0.88},${viewSize * 0.08} ${viewSize * 0.98},${viewSize * 0.12} ${viewSize * 0.65},${viewSize * 0.6} ${viewSize * 0.55},${viewSize * 0.55}`}
              className="light-ray"
            >
              <animate attributeName="opacity" values="0.4; 0.6; 0.4" dur="2s" repeatCount="indefinite" begin="0.5s"/>
            </polygon>
          </g>

          {/* 십자가 그룹 - 펄스 애니메이션 */}
          <g transform={`translate(${centerX}, ${centerY})`}>
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1; 1.05; 1"
              dur="2.5s"
              repeatCount="indefinite"
              additive="sum"
            />
            
            {/* 십자가 세로 막대 */}
            <rect
              x={-viewSize * 0.08}
              y={-viewSize * 0.35}
              width={viewSize * 0.16}
              height={viewSize * 0.7}
              rx={viewSize * 0.08}
              className="cross-wood"
            />
            
            {/* 십자가 가로 막대 */}
            <rect
              x={-viewSize * 0.3}
              y={-viewSize * 0.08}
              width={viewSize * 0.6}
              height={viewSize * 0.16}
              rx={viewSize * 0.08}
              className="cross-wood"
            />
          </g>

          {/* 추가 빛 효과 - 십자가 주변 */}
          <circle
            cx={centerX}
            cy={centerY}
            r={viewSize * 0.25}
            fill="none"
            stroke="rgb(251, 191, 36)"
            strokeWidth="2"
            strokeOpacity="0.3"
            strokeDasharray="4 4"
          >
            <animate attributeName="r" values={`${viewSize * 0.25}; ${viewSize * 0.3}; ${viewSize * 0.25}`} dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values="0.2; 0.4; 0.2" dur="2.5s" repeatCount="indefinite"/>
          </circle>
        </svg>

        {/* 로딩 텍스트 */}
        {text && (
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 font-normal text-base">
              {text}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// 스켈레톤 컴포넌트는 제거하고 Loading 컴포넌트만 사용
// 필요시 Loading 컴포넌트를 사용하세요
