import { formatCurrency } from "@/lib/utils"

interface TreemapContentProps {
  root?: any
  depth?: number
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  payload?: any
  colors?: any
  onCellClick?: (payload: any) => void
}

const TreemapContent: React.FC<TreemapContentProps> = ({ 
  root, 
  depth, 
  x, 
  y, 
  width, 
  height, 
  index, 
  payload,
  onCellClick 
}) => {
  if (depth === 1 && x !== undefined && y !== undefined && width !== undefined && height !== undefined) {
    return (
      <g
        onClick={() => {
          if (payload?.settlement && onCellClick) {
            onCellClick(payload)
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: payload?.fill || 'hsl(var(--primary))',
            stroke: '#fff',
            strokeWidth: 2,
            fillOpacity: 0.8,
          }}
        />
        {width > 40 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 8}
              textAnchor="middle"
              fill="white"
              fontSize={12}
              fontWeight="bold"
            >
              {payload?.name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 8}
              textAnchor="middle"
              fill="white"
              fontSize={10}
            >
              {formatCurrency(payload?.size || 0)}
            </text>
          </>
        )}
      </g>
    )
  }
  return null
}

export default TreemapContent