"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useMemo, useRef, useState } from 'react'
import Cookies from "js-cookie"
import axios from 'axios'
import { author_service, useAppData } from '@/context/AppContext'
import toast from 'react-hot-toast'

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

const AddBlog = () => {

  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false)
  const [aiTitle, setAiTitle] = useState(false)
  const [aiDescription, setAIDescription] = useState(false);
  const [blogLoading, setAIBlogLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    blogcontent: ""
  });
  const { fetchBlogs } = useAppData()
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
        `${author_service}/api/v1/blog/new`,
        sendFormData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(data.message)

      setFormData({
        title: "",
        description: "",
        category: "",
        image: "",
        blogcontent: ""
      })

      setContent("");
        fetchBlogs()
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

  const aiTitleResponse = async () => {
    try {
      setAiTitle(true);

      const { data } = await axios.post(
        `${author_service}/api/v1/ai/title`,
        { text: formData.title }
      );
      console.log(data.title)
      console.log("AI Response:", data);

      // Ensure API returns: { title: "Generated Title" }
      setFormData(prev => ({
        ...prev,
        title: data
      }));

    } catch (error) {
      toast.error("Problem while fetching with AI")
      console.log(error)
    } finally {
      setAiTitle(false)
    }
  }

  const aiDescriptionResponse = async () => {
    try {
      setAIDescription(true);

      const { data } = await axios.post(
        `${author_service}/api/v1/ai/description`,
        { title: formData.title, description: formData.description }
      );


      setFormData(prev => ({
        ...prev,
        description: data
      }));

    } catch (error) {
      toast.error("Problem while fetching with AI")
      console.log(error)
    } finally {
      setAIDescription(false)
    }
  }

  const aiBlogResponse = async () => {
    console.log("AI blog ")
    try {
      console.log(formData)
      setAIBlogLoading(true);
      console.log(formData.blogcontent)
      const { data } = await axios.post(
        `${author_service}/api/v1/ai/blog`,
        { blog: formData.blogcontent }
      );

      console.log(data)
      setContent(data.html)
      setFormData(prev => ({
        ...prev,
        blogcontent: data.html
      }));

    } catch (error) {
      toast.error("Problem while fetching with AI")
      console.log(error)
    } finally {
      setAIBlogLoading(false)
    }
  }

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
                className={aiTitle ? "animate-pulse placeholder:opacity-60" : ""}
              />

              {formData.title !== "" && (
                <Button
                  type='button'
                  onClick={aiTitleResponse}
                  disabled={aiTitle || loading}
                >
                  <RefreshCw className={aiTitle ? "animate-pulse" : ""} />
                </Button>
              )}
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
              <Button
                type='button'
                onClick={aiDescriptionResponse}
                disabled={aiDescription || loading}
              >
                <RefreshCw className={aiDescription ? "animate-spin" : ""} />
              </Button>
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

            {/* FILE UPLOAD */}
            <div>
              <Label>File Upload</Label>
              <Input type='file' accept='image/*' onChange={handleFileChange} />
            </div>

            {/* BLOG CONTENT */}
            <div>
              <Label>Blog Content</Label>
              <div className='flex items-center justify-center mb-2'>
                <p className='text-sm text-muted-foreground'>
                  Paste or type your blog. Add image after grammar improvement.
                </p>
                <Button type='button' size={"sm"} disabled={blogLoading} onClick={aiBlogResponse}>
                  <RefreshCw size={16} className={blogLoading ? "animate-spin" : ""} />
                  <span className='ml-2'>Fix Grammar</span>
                </Button>
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

export default AddBlog
