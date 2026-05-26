import type { SyntaxHighlighterProps as ReactSyntaxHighlighterProps } from 'react-syntax-highlighter'
import { Prism } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

type SyntaxHighlighterProps = ReactSyntaxHighlighterProps

// Type compatibility wrapper for react-syntax-highlighter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CompatPrism = Prism as unknown as React.ComponentType<any>

const SyntaxHighlighter = (props: SyntaxHighlighterProps) => {
    const { children, ...rest } = props

    return (
        <CompatPrism style={oneDark} {...rest}>
            {children}
        </CompatPrism>
    )
}

export default SyntaxHighlighter
