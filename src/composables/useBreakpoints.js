import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export default () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('md')
  const isTablet = breakpoints.between('md', 'lg')
  const isDesktop = breakpoints.greaterOrEqual('lg')
  return { isMobile, isTablet, isDesktop }
}
