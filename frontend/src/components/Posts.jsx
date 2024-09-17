import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post)
  console.log("posts data is : ", posts)

  return (
    <div>
      {
        posts?.map((post, index) => {
          return (
            <Post key={index} post={post} />
          )
        })
      }
    </div>
  )
}

export default Posts