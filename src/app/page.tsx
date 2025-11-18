"use client"
import { useAppData } from '@/context/AppContext'
import React from 'react'

const page = () => {
   const { loading,isAuth } =useAppData()
   if(loading) {

   }
  //  if(!isAuth) re
  return (
    <div>page</div>
  )
}

export default page