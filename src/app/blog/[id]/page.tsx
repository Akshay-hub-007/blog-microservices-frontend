"use client"
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { author_service, Blog, blog_service, useAppData, User } from '@/context/AppContext'
import axios from 'axios'
import { Bookmark, BookmarkCheck, Edit, SectionIcon, Trash2, User2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie"
import toast from 'react-hot-toast'
interface Comment {
  id: string;
  userid: string;
  comment: string;
  created_at: string;
  username: string;
}
const BlogPage = () => {
  const { isAuth, user, fetchBlogs, savedBlogs, getSavedBlogs } = useAppData()
  const { id } = useParams()

  const [blog, setBlog] = useState<Blog | null>(null)
  const [author, setAuthor] = useState<User | null>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const fetchComments = async () => {
    try {
      const token = Cookies.get("token")
      const { data } = await axios.get(`${blog_service}/api/v1/comment/${id}`)
      console.log(data)
      setComments(data)

    } catch (error) {
      console.log("Error in fetching comments")
    }
  }
  useEffect(() => {
    fetchComments()
  }, [id])
  async function fetchSingleBlog() {
    try {
      setLoading(true)
      const { data } = await axios.get(`${blog_service}/api/v1/blog/${id}`)
      console.log(data)
      setBlog(data.blog)
      setAuthor(data.author)
      console.log(data)
    } catch (error) {
      console.log("Error in fetching blog", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSingleBlog()
  }, [id])
  const [comment, setComment] = useState("")
  async function addComment() {
    try {

      setLoading(true)
      const token = Cookies.get("token")
      const { data } = await axios.post(`${blog_service}/api/v1/comment/${id}`, {
        comment
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success(data.message)
      setComment("")
      fetchComments()
    } catch (error) {
      toast.error("Problem while adding comment")
    } finally {
      setLoading(false)
    }
  }

  const deleteComment = async (id: string) => {
    try {
      const token = Cookies.get("token")
      const { data } = await axios.delete(`${blog_service}/api/v1/comment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success(data.message)
      fetchComments()
    } catch (error) {
      toast.error("Error in Deleting comment");
    }
  }
  async function deleteBlog(id: string) {
    if (confirm("Are you sure want to delete the blog")) {
      try {
        setLoading(true)
        const token = Cookies.get("token")
        const { data } = await axios.delete(`${author_service}/api/v1/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        toast.success(`${data.message}`)
        router.push("/blogs")
        setTimeout(() => {
          fetchBlogs()
        }, 4000)
      } catch (error) {
        toast.error("Error in delete blog")
      } finally {
        setLoading(false)
      }
    }
  }
  const [savedBlog, setSavedBlog] = useState(false)

  async function saveBlog(id: string) {
    const token = Cookies.get("token")
    try {
      setLoading(true)
      const { data } = await axios.post(`${blog_service}/api/v1/save/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(data.message);
      setSavedBlog(!savedBlog)
      getSavedBlogs()
    } catch (error) {
      toast.error("Problem with saving blog")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (savedBlogs && savedBlogs?.some((b) => b.blogid == id)) {
      setSavedBlog(true)
    } else {
      setSavedBlog(false)
    }
  }, [savedBlogs, id])
  if (!blog) {
    return <Loading />
  }
  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
          <h1 className='text-3xl font-bold text-gray-900'>{blog.title}</h1>
          <p className='text-gray-600 mt-2 flex items-center'>
            <Link href={`/profile/${author?._id}`} className='flex items-center gap-2'>
              <img src={blog.image} className='w-8 h-8 rounded-full' alt="" />
              {author?.name}
            </Link>
            {
              isAuth && <Button variant={"ghost"} className='mx-3' size={"lg"} onClick={() => saveBlog(blog.id)} disabled={loading} >
                {savedBlog ? <BookmarkCheck /> : <Bookmark />}
              </Button>
            }
            {
              blog.author === user?._id && (
                <>
                  <Button size={"sm"} onClick={() => router.push(`/blog/edit/${blog.id}`)}>
                    <Edit />
                  </Button>

                  <Button variant={"destructive"} className='ml-2' size={"sm"} onClick={() => deleteBlog(blog.id)} disabled={loading}>
                    <Trash2 />
                  </Button>
                </>
              )
            }
          </p>
        </CardHeader>
        <CardContent>
          <img src={blog.image} alt={blog.title}
            className='w-full h-64 object-cover rounded-lg mb-4' />

          <p className='text-lg text-gray-700 mb-4'>{blog.description}</p>
          <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: blog.blogcontent }}>

          </div>
        </CardContent>
      </Card>
      {
        isAuth && <Card>
          <CardHeader className='text-xl font-semibold'>Leave a comment</CardHeader>
          <CardContent>
            <Label htmlFor='comment'>Your Comment</Label>
            <Input
              id='comment'
              className='my-2'
              placeholder='Type Your Comment here'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={addComment} disabled={loading} >{loading ? "Submitting..." : "Post Comment"}</Button>
          </CardContent>
        </Card>

      }

      <Card>
        <CardHeader>
          <h3 className='text-lg font-medium'> All Comments</h3>
        </CardHeader>
        <CardContent>
          {
            comments && comments?.length > 0 && comments.map((comment, index) => {
              return <div key={index} className='border-b py-2 flex  items-center gap-3'>
                <div>
                  <p className='font-semibold flex items-center gap-1'>
                    <span className='user border border-gray-400 rounded-full p-1'><User2 /></span>
                    {comment.username}
                  </p>
                  <p>{comment.comment}</p>
                  <p className='text-xs text-gray-500'>{new Date(comment.created_at).toLocaleString()}</p>
                </div>
                {
                  comment.userid == user?._id && <Button variant={"destructive"} onClick={() => deleteComment(comment.id)} ><Trash2 /></Button>
                }
              </div>
            })
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogPage
