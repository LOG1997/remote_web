import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useMqtt } from '@/components/MqttProvider'
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { DirectionPart } from './parts/_Direction'
import { OtherActionGroup } from './parts/_OtherActionGroup'

export const Route = createFileRoute('/bilibili/')({
    loader: async () => {
        return {
            meta: {
                back: '/',
                backName: 'home',
            },
        }
    },
    component: function RouteComponent() {
        const [searchValue, setSearchValue] = useState('')
        const mqttClient = useMqtt()
        const handleSearch = () => {
            mqttClient.publish('tv-web/log1997/receive', {
                action: 'bilibili',
                data: 'search',
                payload: searchValue
            })
        }
        const handleNavigate = (direction: 'back' | 'forward') => {
            mqttClient.publish('tv-web/log1997/receive', {
                action: 'navigate',
                data: direction
            })
        }

        return <div>
            <DirectionPart />
            <OtherActionGroup />
            <Button onClick={() => handleNavigate('back')}>
                后退
            </Button>
            <Button onClick={() => handleNavigate('forward')}>
                前进
            </Button>
        </div>
    },
})


