import Post from './Post'
import { useSelector } from 'react-redux'

const Feed = () => {
    const { posts } = useSelector(store => store.post)
    console.log("posts data is : ", posts)

    return (
        <div className='md:pl-[20%] xs:pl-[15%] px-5 my-10 flex flex-col items-center '>

            {/* display the post on home page from the posts array */}
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

export default Feed