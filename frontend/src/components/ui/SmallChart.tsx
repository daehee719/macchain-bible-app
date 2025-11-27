import React from 'react'

type Props = {
  data: number[]
  width?: number
  height?: number
}

export default function SmallChart({ data, width = 120, height = 32 }: Props) {
  if (!data || data.length === 0) return <svg width={width} height={height} />

  const max = Math.max(...data)
  const min = Math.min(...data)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / (max - min || 1)) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline fill="none" stroke="#2563eb" strokeWidth={2} points={points} />
    </svg>
  )
}
