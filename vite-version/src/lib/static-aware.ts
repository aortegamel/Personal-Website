// Check if we're rendering a static pre-rendered page
export const isStaticContent = (): boolean => {
  return typeof window !== 'undefined' && window.__STATIC_CONTENT__ === true
}

// List of routes that are pre-rendered
export const staticRoutes = [
  '/posts',
  '/projects',
  '/posts/',
  '/posts/',
  '/projects/nyxusd',
  '/projects/bot',
  '/projects/qwensuicoder',
  '/projects/singleagenttrader'
]

// Check if current route should be static
export const isStaticRoute = (pathname: string): boolean => {
  return staticRoutes.includes(pathname)
}

// Window type augmentation
declare global {
  interface Window {
    __STATIC_CONTENT__?: boolean
  }
}