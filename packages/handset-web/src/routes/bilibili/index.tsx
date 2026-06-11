import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useMqtt } from '@/components/MqttProvider'
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export const Route = createFileRoute('/bilibili/')({

    component: function RouteComponent() {
        const [searchValue, setSearchValue] = useState('')
        const mqttClient = useMqtt()
        const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
            mqttClient.publish('tv-web/log1997/receive', {
                action: 'bilibili',
                data: direction
            })
        }
        const handleEnter = () => {
            mqttClient.publish('tv-web/log1997/receive', {
                action: 'bilibili',
                data: 'enter'
            })
        }
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

        const handleCloseTab = () => {
            mqttClient.publish('tv-web/log1997/receive', {
                action: 'global',
                data: 'closeTab'
            })
        }
        return <div>
            <Button onClick={() => handleMove('up')}>
                上
            </Button>
            <Button onClick={() => handleMove('down')}>
                下
            </Button>
            <Button onClick={() => handleMove('left')}>
                左
            </Button>
            <Button onClick={() => handleMove('right')}>
                右
            </Button>
            <Button onClick={handleEnter}>
                进入
            </Button>
            <Field orientation="horizontal">
                <Input type="search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search..." />
                <Button onClick={handleSearch}>Search</Button>
            </Field>

            <Button onClick={() => handleNavigate('back')}>
                后退
            </Button>
            <Button onClick={() => handleNavigate('forward')}>
                前进
            </Button>
            <Button onClick={handleCloseTab}>
                退出
            </Button>
        </div>
    },
})


