import GlitchText from './GlitchText'
import ScrambleText from './ScrambleText'

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

/** A heading that decodes on entering the viewport and glitches on hover. */
export default function Heading({ text, as: Tag = 'h2', className = '' }: Props) {
  return (
    <Tag className={`font-display font-black uppercase ${className}`}>
      <GlitchText text={text}>
        <ScrambleText text={text} multiline />
      </GlitchText>
    </Tag>
  )
}
