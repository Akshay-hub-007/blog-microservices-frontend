import React, { ReactNode } from 'react'
import { SidebarProvider } from '../components/ui/sidebar'
import Sidebar from '../components/Sidebar'
interface BlogProps {
    children: ReactNode
}
const HomeLayout: React.FC<BlogProps> = ({ children }) => {
    return (
        <div>
            <SidebarProvider>
                <Sidebar />
                <main className='w-full'>
                    <div className='w-full min-h-[calc(100vh-45)] px-4'>
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </div>
    )
}

export default HomeLayout
