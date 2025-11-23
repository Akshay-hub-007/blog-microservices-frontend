import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Input } from './ui/input'
import { BoxSelect } from 'lucide-react'
import { blogCategories } from '@/app/blog/new/page'
import { useAppData } from '@/context/AppContext'

const SideBar = () => {
    const { query, setQuery, setCategory } = useAppData();

    return (
        <Sidebar>
            <SidebarHeader className='bg-white text-2xl  font-bold mt-5 '>
                The Reading Retreat
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Search
                    </SidebarGroupLabel>
                    <Input type="type" placeholder="search you blog" value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <SidebarGroupLabel>
                        Category
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onChange={() => setCategory("")}>
                                <BoxSelect /> All
                            </SidebarMenuButton>

                            {
                                blogCategories.map((cat, i) => {
                                    return <SidebarMenuButton key={i} onChange={() => setCategory(cat)}>
                                        <BoxSelect /> <span>{cat}</span>
                                    </SidebarMenuButton>
                                })
                            }
                        </SidebarMenuItem>
                    </SidebarMenu>

                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default SideBar