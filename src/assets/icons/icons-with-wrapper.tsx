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
  // star: ({ svgProps, ...props }: IconWrapperProps) => (
  //   <IconWrapper {...props}>
  //     <Icons.star {...svgProps} />
  //   </IconWrapper>
  // ),
  // starFilled: ({ svgProps, ...props }: IconWrapperProps) => (
  //   <IconWrapper {...props}>
  //     <Icons.starFilled {...svgProps} />
  //   </IconWrapper>
  // ),
  star: ({ svgProps, fill, ...props }: IconWrapperProps) => (
    <IconWrapper {...props}>
      <Icons.star {...svgProps} fill={fill} />
    </IconWrapper>
  ),
}
