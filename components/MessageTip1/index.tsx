import './index.css'

export function MessageTip(props: any) {
    const { tip,  style} = props
    return (
        <span className='message-tip' style={style}>
            {tip}
        </span>
    )
}
