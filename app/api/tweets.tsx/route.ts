import { NextResponse } from "next/server"

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN
const TWITTER_USER_ID = process.env.TWITTER_USER_ID // You'll need to find your Twitter user ID

export async function GET() {
  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/${TWITTER_USER_ID}/tweets?tweet.fields=created_at&max_results=5`,
      {
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch tweets")
    }

    const data = await response.json()
    return NextResponse.json(data.data)
  } catch (error) {
    console.error("Error fetching tweets:", error)
    return NextResponse.json({ error: "Failed to fetch tweets" }, { status: 500 })
  }
}

