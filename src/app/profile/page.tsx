"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAppData, user_service } from "@/context/AppContext";
import React, { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Loading from "@/components/Loading";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Page = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { user, setUser, isAuth, setIsAuth, logoutUser } = useAppData();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    if (!user) redirect("/login")
    const [formData, setFormData] = useState({
        name: "",
        instagram: "",
        facebook: "",
        linkedin: "",
        bio: "",
    });

    // 🔥 Fix: Sync formData when user loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                instagram: user.instagram || "",
                facebook: user.facebook || "",
                linkedin: user.linkedin || "",
                bio: user.bio || "",
            });
        }
    }, [user]);

    // ===== File Upload Handler =====
    const handleFileChange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const fd = new FormData();
        fd.append("file", file);

        try {
            setLoading(true);
            const token = Cookies.get("token");

            const { data } = await axios.post(
                `${user_service}/api/v1/user/update/pic`,
                fd,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(data.message);

            Cookies.set("token", data.token, {
                expires: 5,
                secure: true,
                path: "/",
            });

            setUser(data.user);
        } catch (error) {
            toast.error("Image Update Failed");
        } finally {
            setLoading(false);
        }
    };

    // ===== Form Submit Handler =====
    const handleFormSubmit = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("token");

            const { data } = await axios.post(
                `${user_service}/api/v1/user/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // FIXED
                    },
                }
            );
            console.log(data)
            toast.success(data.message);

            Cookies.set("token", data.token, {
                expires: 5,
                secure: true,
                path: "/",
            });

            setUser(data.user);
            setOpen(false);
        } catch (error) {
            toast.error("Update Failed");
        } finally {
            setLoading(false);
        }
    };

    // ===== Logout =====


    return (
        <div className="flex items-center justify-center min-h-screen">
            {loading ? (
                <Loading />
            ) : (
                <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6">

                    {/* HEADER */}
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
                    </CardHeader>

                    {/* CONTENT */}
                    <CardContent className="flex flex-col items-center space-y-4">

                        {/* Avatar */}
                        <Avatar className="w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer">
                            <AvatarImage
                                src={user?.image}
                                alt="Profile Pic"
                                onClick={() => inputRef.current?.click()}
                            />
                            <input
                                type="file"
                                className="hidden"
                                ref={inputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </Avatar>

                        {/* Name */}
                        <div className="w-full text-center">
                            <label className="font-medium">Name</label>
                            <p>{user?.name}</p>
                        </div>

                        {/* Bio */}
                        {user?.bio && (
                            <div className="w-full text-center">
                                <label className="font-medium">Bio</label>
                                <p>{user.bio}</p>
                            </div>
                        )}

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-3">
                            {user?.instagram && (
                                <a href={user.instagram} target="_blank" rel="noopener noreferrer">
                                    <Instagram className="text-pink-500 hover:text-pink-600" />
                                </a>
                            )}

                            {user?.linkedin && (
                                <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="text-blue-500 hover:text-blue-600" />
                                </a>
                            )}

                            {user?.facebook && (
                                <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="text-blue-700 hover:text-blue-900" />
                                </a>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center">
                            <Button onClick={logoutUser}>Logout</Button>
                            <Button onClick={() => router.push("/blog/new")}>Add Blog</Button>

                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Edit</Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-3">

                                        <div>
                                            <Label>Name</Label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label>Bio</Label>
                                            <Input
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label>Instagram</Label>
                                            <Input
                                                value={formData.instagram}
                                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label>Facebook</Label>
                                            <Input
                                                value={formData.facebook}
                                                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label>LinkedIn</Label>
                                            <Input
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            />
                                        </div>

                                        <Button className="w-full" onClick={handleFormSubmit}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Page;
