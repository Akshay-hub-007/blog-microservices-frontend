"use client"
import HomeLayout from '@/app/homelayout'
import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { useAppData } from '@/context/AppContext'
import { Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const { toggleSidebar } = useSidebar();
    const { loading, blogLoading, blogs, isAuth } = useAppData()
    console.log(blogs)
    const list = Array.isArray(blogs) ? blogs : [];
    const router = useRouter()
    useEffect(() => {
        if (!isAuth) {

            router.push("/login")
        }
    }, [isAuth])
    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div className='container mx-auto px-4'>
                    <div className='flex justify-between items-center my-5'>
                        <h1 className='text-3xl font-bold'>
                            Latest Blogs
                        </h1>

                        <Button
                            onClick={toggleSidebar}
                            className='flex items-center gap-2 px-4 bg-primary text-white'
                        >
                            <Filter size={18} />
                            <span>Filter Blogs</span>
                        </Button>
                    </div>

                    {blogLoading ? (
                        <Loading />
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                            {list.length === 0 ? (
                                <p>No Blogs</p>
                            ) : (
                                list.map((b, i) => (
                                    <BlogCard key={i} image={b.image} title={b.title} description={b.description} id={b.id} time={b.created_at} />
                                ))
                            )}
                        </div>

                    )}
                </div>
            )}
        </div>
    )
}

export default page
