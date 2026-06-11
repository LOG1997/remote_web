import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useMqtt } from '@/components/MqttProvider'

export const Route = createFileRoute('/bilibili/')({

    component: function RouteComponent() {
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
        </div>
    },
})


