// Deployment configuration helper
// Handles different deployment environments (Walrus, Vercel, local)

export interface DeploymentConfig {
  isWalrus: boolean
  isVercel: boolean
  isLocal: boolean
  baseUrl: string
  contentPath: string
}

export function getDeploymentConfig(): DeploymentConfig {
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  
  // Detect Walrus deployment
  const isWalrus = hostname.includes('.wal.app') || hostname.includes('.walrus')
  
  // Detect Vercel deployment
  const isVercel = hostname.includes('.vercel.app') || hostname.includes('vercel')
  
  // Detect local development
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || protocol === 'file:'
  
  // Determine base URL
  let baseUrl = '/'
  if (import.meta.env.BASE_URL) {
    baseUrl = import.meta.env.BASE_URL
  }
  
  // Content path (relative to base)
  const contentPath = 'content/'
  
  console.log('Deployment configuration:', {
    hostname,
    protocol,
    isWalrus,
    isVercel,
    isLocal,
    baseUrl,
    contentPath
  })
  
  return {
    isWalrus,
    isVercel,
    isLocal,
    baseUrl,
    contentPath
  }
}

// Helper to construct content URLs
export function getContentUrl(path: string): string {
  const config = getDeploymentConfig()
  
  // Remove leading slash from path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // For Walrus, use absolute paths
  if (config.isWalrus) {
    return `/${cleanPath}`
  }
  
  // For other deployments, use base URL
  return `${config.baseUrl}${cleanPath}`.replace(/\/+/g, '/')
}