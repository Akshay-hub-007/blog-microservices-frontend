"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppData, user_service } from '@/context/AppContext'
import React, { useRef, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Instagram, Linkedin } from 'lucide-react'
const page = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { user, setUser } = useAppData()
    const [loading, setLoading] = useState(false)

    const handleClick = () => {
        inputRef.current?.click()

    }
    const handleFileChange = async (e: any) => {

        const file = e.target.files[0];
        if (file) {
            const formData = new FormData()
            console.log("file uploading")
            formData.append("file", file)
            try {
                setLoading(true);
                const token = Cookies.get('token')

                const { data } = await axios.post(`${user_service}/api/v1/user/update/pic`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                toast.success(data.message)

                setLoading(false)

                Cookies.set("token", data.token, {
                    expires: 5,
                    secure: true,
                    path: "/"
                })
                setUser(data.user)
                setLoading(false)
            } catch (error) {
                toast.error("Image  Update failed")
                setLoading(false)
            }
        }
    }
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <Card className='w-full  max-w-xl shadow-lg border rounded-2xl p-6'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-2xl font-semibold'>
                        Profile
                    </CardTitle>
                    <CardContent className=' flex flex-col items-center space-y-4'>
                        <Avatar className='w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer'>
                            <AvatarImage src={user?.image} alt='Profile Pic' onClick={handleClick} />
                            <input type='file' className='hidden' onChange={handleFileChange} ref={inputRef} accept='image/*' />
                        </Avatar>
                        <div className='w-full spacey-2 text-center'>
                            <label htmlFor="name" className='font-medium'>Name</label>
                            <p>{user?.name}</p>
                        </div>
                        {
                            user?.bio && (
                                <div className='w-full spacey-2 text-center'>
                                    <label htmlFor="name" className='font-medium'>Bio</label>
                                    <p>{user.bio}</p>
                                </div>
                            )
                        }
                        <div className='flex gap-4 mt-3'>
                            {
                                user?.instagram && <a  href={`${user.instagram}`} target='_blank' rel="noopener noreferrer">
                                    <Instagram className='text-blue-200 text-2xl' />
                                </a>
                            }
                             {
                                user?.linkedin && <a  href={`${user.linkedin}`} target='_blank' rel="noopener noreferrer">
                                    <Linkedin className='text-pink-200 text-2xl'/>
                                </a>
                            }
                             {
                                user?.facebook && <a  href={`${user.instagram}`} target='_blank' rel="noopener noreferrer">
                                    <Instagram className='text-blue-200' />
                                </a>
                            }
                        </div>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}

export default page