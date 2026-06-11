import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
    component: function RouteComponent() {
        const navigate = useNavigate()
        // useEffect(() => {
        //     if (!configData) {
        //         navigate({ to: '/config' })
        //     }
        //     else {
        //         navigate({ to: '/dashboard' })
        //     }
        // }, [navigate, configData])

        return <div>Redirecting to dashboard...</div>
    },
})


