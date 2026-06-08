import React from 'react'
import { useState, useEffect, useRef } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function CardInput(props: any) {
    const { style, data, onSubmit,color } = props
    const [text, setText] = useState(data || '')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const handleSubmit = () => {
        onSubmit(text,color)
    }
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.autofocus = true
            setTimeout(() => {
               textareaRef.current? textareaRef.current.focus():null
            }, 100)
        }
    }, [])
    return (
        <div className="w-[350px] z-100" style={style}>
            <Card>
                <CardHeader className='p-2 flex flex-row justify-start gap-2' >
                    <Button variant="secondary" onClick={handleSubmit}>提交</Button>
                </CardHeader>
                <CardContent className='p-2'>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Textarea ref={textareaRef} id="name" placeholder="请输入" value={text} onChange={(e) => { setText(e.target.value) }} />
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
