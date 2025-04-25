/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Instagram, Twitter } from "lucide-react"

// You'll need to set up these environment variables in your .env.local file
const INSTAGRAM_ACCESS_TOKEN = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN
const TWITTER_BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN

interface InstagramPost {
  id: string
  media_url: string
  permalink: string
  caption: string
  timestamp: string
}

interface Tweet {
  id: string
  text: string
  created_at: string
}

export default function Contact() {
  const [activeTab, setActiveTab] = useState("instagram")
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([])
  const [tweets, setTweets] = useState<Tweet[]>([])

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/themessengersmusic", username: "@themessengersmusic" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/debdootmanna", username: "@debdootmanna" },
    { name: "Email", icon: Mail, url: "mailto:mannadebdoot007@proton.me", username: "mannadebdoot007@proton.me" },
  ]

  useEffect(() => {
    async function fetchInstagramPosts() {
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`,
        )
        const data = await response.json()
        setInstagramPosts(data.data.slice(0, 6))
      } catch (error) {
        console.error("Error fetching Instagram posts:", error)
      }
    }

    async function fetchTweets() {
      try {
        const response = await fetch("/api/tweets") // We'll create this API route
        const data = await response.json()
        setTweets(data.slice(0, 5))
      } catch (error) {
        console.error("Error fetching tweets:", error)
      }
    }

    fetchInstagramPosts()
    fetchTweets()

    // Refresh data every 5 minutes
    const intervalId = setInterval(
      () => {
        fetchInstagramPosts()
        fetchTweets()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {socialLinks.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-primary hover:underline p-4 border rounded-lg transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <link.icon className="w-6 h-6" />
            <span>{link.username}</span>
          </Link>
        ))}
      </div>

      <div className="mb-12">
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${activeTab === "instagram" ? "border-b-2 border-primary" : ""}`}
            onClick={() => setActiveTab("instagram")}
          >
            Instagram
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "twitter" ? "border-b-2 border-primary" : ""}`}
            onClick={() => setActiveTab("twitter")}
          >
            Twitter
          </button>
        </div>

        {activeTab === "instagram" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {instagramPosts.map((post) => (
              <Link key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="relative">
                <Image
                  src={post.media_url || "/placeholder.svg"}
                  alt={post.caption || "Instagram post"}
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                  <p className="text-sm truncate">{post.caption}</p>
                  <p className="text-xs">{new Date(post.timestamp).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "twitter" && (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div key={tweet.id} className="border p-4 rounded-lg">
                <p>{tweet.text}</p>
                <p className="mt-2 text-sm text-muted-foreground">{new Date(tweet.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

