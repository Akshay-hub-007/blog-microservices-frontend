"use client"
import HomeLayout from '@/app/homelayout'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { useAppData } from '@/context/AppContext'
import { Filter } from 'lucide-react'
import React from 'react'

const page = () => {

  const { loading, blogLoading, blogs } = useAppData()
  return (
    <div>
      Home
    </div>
  )
}

export default page