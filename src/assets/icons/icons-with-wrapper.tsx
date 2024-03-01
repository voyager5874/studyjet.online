import type { IconWrapperProps } from '@/assets/icons/wrapper'

import { IconWrapper } from '@/assets/icons/wrapper'

import { Icons } from './icons'

// type IconProps = HTMLAttributes<SVGElement>

export const IconsWithWrapper = {
  gitHub: ({ svgProps, ...props }: IconWrapperProps) => (
    <IconWrapper {...props}>
      <Icons.gitHub {...svgProps} />
    </IconWrapper>
  ),
  playCircle: ({ svgProps, ...props }: IconWrapperProps) => (
    <IconWrapper {...props}>
      <Icons.playCircle {...svgProps} />
    </IconWrapper>
  ),
  user: ({ svgProps, ...props }: IconWrapperProps) => (
    <IconWrapper {...props}>
      <Icons.user {...svgProps} />
    </IconWrapper>
  ),
  star: ({ svgProps, fill, ...props }: IconWrapperProps) => (
    <IconWrapper {...props}>
      <Icons.star {...svgProps} fill={fill} />
    </IconWrapper>
  ),
  bookMarked: ({ svgProps, fill, ...props }: IconWrapperProps) => (
    <IconWrapper {...props}>
      <Icons.bookMarked {...svgProps} />
    </IconWrapper>
  ),
  logout: ({ svgProps, fill, ...props }: IconWrapperProps) => (
    <IconWrapper {...props}>
      <Icons.logout {...svgProps} />
    </IconWrapper>
  ),
}
