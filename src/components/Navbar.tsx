"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { CircleUserRound, LogIn, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppData } from '@/context/AppContext'

const Navbar = () => {
    const [isopen, setIsOpen] = useState(false)

    const { loading, isAuth } = useAppData()
    return (
        <nav className='bg-white shadow-md p-4 z-50'>
            <div className='container flex justify-between items-center'>
                <Link href={"/"} className='text-xl font-bold text-gray-900'> The reading Retreat</Link>

                <div className="md:hidden">
                    <Button variant={"ghost"} onClick={() => setIsOpen(!isopen)}>
                        {
                            isopen ? <X className="h-6 w-6" /> : <Menu className='w-6 h-6' />
                        }
                    </Button>
                </div>
                <ul className='hidden md:flex justify-center items-center space-x-6 text-gray-700'>
                    <li>
                        <Link href={"/"} className='hover:text-blue-500'>Home</Link>
                    </li>
                    <li>
                        <Link href={"/savedblogs"} className='hover:text-blue-500'>Saved Blogs</Link>
                    </li>
                    {isAuth ?
                        <li>
                            <Link href={"/profile"} className='hover:text-blue-500'>
                                <CircleUserRound className='h-6 w-6' />
                            </Link>
                        </li>
                        : <li>
                            <Link href={"/login"} className='hover:text-blue-500'>
                                <LogIn className='h-6 w-6' />
                            </Link>
                        </li>}
                </ul>
            </div>

            <div className={cn('md:hidden overflow-hidden transition-all duration-300 ease-in-out', isopen ? "max-h-40 opacity-100" : "max-h-0 opacity-0")}>
                <ul className='flex flex-col justify-center items-center space-y-4 text-gray-700  bg-white shadow-md'>
                    <li>
                        <Link href={"/"} className='hover:text-blue-500'>Home</Link>
                    </li>
                    <li>
                        <Link href={"/savedblogs"} className='hover:text-blue-500'>Saved Blogs</Link>
                    </li>
                    {isAuth ?
                        <li>
                            <Link href={"/profile"} className='hover:text-blue-500'>
                                <CircleUserRound className='h-6 w-6' />
                            </Link>
                        </li>
                        : <li>
                            <Link href={"/login"} className='hover:text-blue-500'>
                                <LogIn className='h-6 w-6' />
                            </Link>
                        </li>}
                </ul>

            </div>
        </nav>
    )
}

export default Navbar