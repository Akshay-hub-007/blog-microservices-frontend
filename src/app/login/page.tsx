"use client"
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppData, user_service } from '@/context/AppContext'
import axios from 'axios'
import React from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { useGoogleLogin } from "@react-oauth/google"
import { redirect } from 'next/navigation'
import { loadComponents } from 'next/dist/server/load-components'
import Loading from '@/components/Loading'
function LoginPage() {

  const { isAuth, loading ,setLoading, setIsAuth} = useAppData()
  if (isAuth) redirect("/")
  const reponseGoogle = async (authResult: any) => {
    try {
      console.log("authresult")
      setLoading(true)
      console.log(authResult)
      const result = await axios.post(`${user_service}/api/v1/login`, {
        code: authResult['code']
      })
      console.log("after")
      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/"
      })
      toast.success(result.data.message)
      setLoading(false)
      setIsAuth(true)
    } catch (error) {
      setLoading(false)
      console.log("error :", error)
      toast.error("problem while login with you.")
    }
  }

  const googlelogin = useGoogleLogin({
    onSuccess: reponseGoogle,
    onError: reponseGoogle,
    flow: "auth-code"
  })
  return (
    <>
      {
        loading ? <Loading /> :
          (
            <div className='w-[350px] m-auto  mt-[200px]'>
              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Login to the reading account</CardTitle>
                  <CardDescription>
                    Your Go to blog app
                  </CardDescription>
                  <CardAction>
                    <Button variant="link">Sign Up</Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <Button onClick={googlelogin}>Login wihth Google <img src={"/google.png"} className="w-6 h-6 rounded-4xl" alt="google icon" /></Button>
                </CardContent>

              </Card>
            </div>
          )
      }
    </>
  )
}

export default LoginPage