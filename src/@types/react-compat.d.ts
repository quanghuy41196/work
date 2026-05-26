// Fix for React type conflicts between different packages
// This resolves conflicts with react-modal's bundled React types
import 'react'

declare module 'react' {
    // Make ReactNode compatible across different React type versions
    type CompatReactNode = ReactNode
}

export { }

