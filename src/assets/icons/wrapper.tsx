import type { CSSProperties, HTMLProps, SVGProps } from 'react'

export type IconWrapperProps = {
  /** Whether to scale icon according to font-size. Sets width and height to 1em. */
  autoSize?: boolean
  /** Set icon fill color from design system */
  color?: string
  fill?: string
  /** Set width and height of icon in pixels */
  size?: number
  /** Props to pass directly to svg element */
  svgProps?: SVGProps<SVGSVGElement>
} & Omit<HTMLProps<HTMLSpanElement>, 'color' | 'size'>

export const IconWrapper = ({
  autoSize,
  color: colorProp,
  size: sizeProp,
  ...restProps
}: IconWrapperProps) => {
  const color = colorProp ? colorProp : 'currentColor'
  const size = sizeProp ? `${sizeProp}px` : '24px'

  return (
    <span
      // aria-hidden={'true'}
      role={'img'}
      style={
        {
          color: color,
          display: 'inline-flex',
          fontSize: 'inherit',
          height: size,
          width: size,
        } as CSSProperties
      }
      {...restProps}
    />
  )
}
