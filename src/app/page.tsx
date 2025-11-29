"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl font-bold mb-4">Welcome to My Blog</h1>
        <p className="text-lg text-gray-600 mb-6">
          Explore articles, tutorials, and insights crafted to help you learn and grow.
        </p>
        <Button className="px-6 py-4 text-lg rounded-2xl" onClick={()=> router.push("/blogs")}>Get Started</Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl w-full">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item * 0.1 }}
          >
            <Card className="rounded-2xl shadow p-4 hover:shadow-lg transition">
              <CardContent>
                <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                <h2 className="text-xl font-semibold mb-2">Blog Title {item}</h2>
                <p className="text-gray-600 text-sm">
                  Short description of the blog post goes here. Learn, explore, and grow.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
