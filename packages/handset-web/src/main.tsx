import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import './index.css'
import { RouterProvider, createRouter, createBrowserHistory } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { MqttProvider } from '@/components/MqttProvider'

const history = createBrowserHistory()

const router = createRouter({
    routeTree,
    history: history,
    defaultPreload: 'intent',
    scrollRestoration: true,
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <MqttProvider>
                <RouterProvider router={router} />
            </MqttProvider>
        </StrictMode>
    )


}
