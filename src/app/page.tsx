"use client"
import { useAppData } from '@/context/AppContext'
import React from 'react'

const page = () => {
   const { loading } =useAppData()
   if(loading) {

   }
  return (
    <div>page</div>
  )
}

export default page