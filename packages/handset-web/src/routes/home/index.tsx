import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlatformList } from '@/constant/platform'
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemHeader,
    ItemTitle,
} from "@/components/ui/item"
import { usePlatform } from '@/stores'

export const Route = createFileRoute('/home/')({

    component: function RouteComponent() {
        const navigate = useNavigate()
        const configData = usePlatform((state) => state.platformInfo)
        const setConfig = usePlatform((state) => state.setConfig)
        const handleSelectPlatform = (platform: any) => {
            setConfig({
                current: platform,
            })
            navigate({ to: platform.path })
        }
        return (<div>
            <ItemGroup className="grid grid-cols-3 gap-4">
                {PlatformList.map((platform) => (
                    <Item key={platform.name} variant="outline" onClick={() => { handleSelectPlatform(platform) }}>
                        <ItemHeader>
                            <div className="w-full">
                                {
                                    platform.icon && (
                                        platform.icon
                                    )
                                }
                            </div>
                        </ItemHeader>
                        <ItemContent>
                            <ItemTitle>{platform.name}</ItemTitle>
                            <ItemDescription>{platform.description}</ItemDescription>
                        </ItemContent>
                    </Item>
                ))}
            </ItemGroup>
        </div >)
    },
})


