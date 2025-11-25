"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Cookies from "js-cookie"
import axios from 'axios'
import { author_service, blog_service, useAppData } from '@/context/AppContext'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'

export const blogCategories = [
  "Technology",
  "Health",
  "Finance",
  "Travel",
  "Education",
  "Entertainment",
  "Study"
]

const JoeEditor = dynamic(() => import("jodit-react"), {
  ssr: false
})

const EditorPage = () => {
  const { id } = useParams()
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    blogcontent: ""
  });
  const [existingImage, setExistingImage] = useState(null);
  const router = useRouter()
  const {fetchBlogs} = useAppData()
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const token = Cookies.get("token")
        const { data } = await axios.get(`${blog_service}/api/v1/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log(data)
        setFormData({
          title: data.blog.title,
          description: data.blog.description,
          category: data.blog.category,
          image: null,
          blogcontent: data.blog.image
        })
        setContent(data.blog.content)
        setExistingImage(data.blog.image)
        setTimeout(()=>{
          fetchBlogs()
        },4000)
      } catch (error) {
        console.log("Error in fetching blog : ", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])
  const handleInputChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    setFormData(prev => ({ ...prev, image: file }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const sendFormData = new FormData();

    sendFormData.append("title", formData.title)
    sendFormData.append("description", formData.description)
    sendFormData.append("category", formData.category)
    sendFormData.append("blogcontent", formData.blogcontent)

    if (formData.image) {
      sendFormData.append("file", formData.image)
    }

    try {
      const token = Cookies.get("token")

      const { data } = await axios.post(
        `${author_service}/api/v1/blog/${id}`,
        sendFormData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(data.message)

     router.push(`/blog/${id}`)

    } catch (error: any) {
      toast.error("Error in Creating blog")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing...'
  }), []);




  return (
    <div className='max-w-4xl mx-auto p-6'>
      <Card>
        <CardHeader>
          <div className='text-2xl font-bold'>Add New Blog</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>

            {/* TITLE */}
            <Label>Title</Label>
            <div className='flex justify-center items-center gap-2'>
              <Input
                name="title"
                required
                value={formData?.title}
                onChange={handleInputChange}
                placeholder='Enter Blog Title'
              />


            </div>

            {/* DESCRIPTION */}
            <Label>Description</Label>
            <div className='flex justify-center items-center gap-2'>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder='Enter Blog Description'
              />
              {/* <Button
                type='button'
                onClick={aiDescriptionResponse}
                disabled={aiDescription || loading}
              >
                <RefreshCw className={aiDescription ? "animate-spin" : ""} />
              </Button> */}
            </div>

            {/* CATEGORY */}
            <Label>Category</Label>
            <Select
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.category || "Select Category"} />
              </SelectTrigger>
              <SelectContent>
                {blogCategories.map((e, i) => (
                  <SelectItem value={e} key={i}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <Label>Image Upload</Label>
              {
                existingImage && !formData.image && (
                  <img src={existingImage} alt="" className='w-40 h-40 object-cover rounded-xl mb-2' />
                )
              }
              <Input type='file' accept='image/*' onChange={handleFileChange} />
            </div>

            <div>
              <Label>Blog Content</Label>
              <div className='flex items-center justify-center mb-2'>
                <p className='text-sm text-muted-foreground'>
                  Paste or type your blog. Add image after grammar improvement.
                </p>
                {/* <Button type='button' size={"sm"} disabled={blogLoading} onClick={aiBlogResponse}>
                  <RefreshCw size={16} className={blogLoading ? "animate-spin" : ""} />
                  <span className='ml-2'>Fix Grammar</span>
                </Button> */}
              </div>

              <JoeEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(newContent: any) => {
                  setContent(newContent)
                  setFormData(prev => ({
                    ...prev,
                    blogcontent: newContent
                  }))
                }}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <Button type="submit" className='w-full' disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditorPage
