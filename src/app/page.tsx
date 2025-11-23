"use client"
import HomeLayout from '@/components/homelayout'
import Loading from '@/components/Loading'
import { useAppData } from '@/context/AppContext'
import React from 'react'

const page = () => {
  const { loading, blogLoading, blogs } = useAppData()
  return (
    <HomeLayout>
      <div>
        {
          loading ? <Loading /> : <div className='container mx-auto px-4'>
            
          </div>
        }
      </div>
    </HomeLayout>
  )
}

export default page