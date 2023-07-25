import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import '../css/Home.css';


function Home() {
    const [showReadIcon, setReadIcon] = useState(true);
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        //check if auth
        if (!localStorage.getItem("accessToken")) {
            navigate('/login');
        } else {
            axios.get('http://localhost:4000/posts',
            {  headers: { accessToken: localStorage.getItem('accessToken') }}).then((response) => {
                setListOfPosts(response.data.listOfPosts);
                setLikedPosts(response.data.likedPosts.map((like) => {
                    return like.PostId;
                }
                ));
            });
        }
    }, []);

    const toggleRead = () => {
        setReadIcon(!showReadIcon);
        };

    const likePost = (postId) => {
        axios.post('http://localhost:4000/likes',
         {  PostId: postId }, 
         {  headers: { accessToken: localStorage.getItem('accessToken') }}
        ).then((response) => {
            //update likes automatically
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) {
                    if (response.data.liked) {
                        return {...post, Likes: [...post.Likes, 0] };
                    } else {
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return {...post, Likes: likesArray };
                    }
                } else {
                    return post;
                }
            }));
            //change color when liked/unliked
            if (likedPosts.includes(postId)) {
                setLikedPosts(likedPosts.filter((id) => {
                    return id != postId; 
                }))
            } else {
                setLikedPosts([...likedPosts, postId])
            }
        });
    };
  
    return (
        <div className="App"> {listOfPosts.map((value, key) => {
            return (
            <div className="post" > 
                <div className='titleContainer'> 
                <div className='title'>{value.title}</div>
                    <div className='read'>
                    {showReadIcon &&
                        <> 
                        <FiberNewIcon 
                        id='fiberNewIcon'
                        style={{ fontSize: '2rem', height: '30px' }}
                        onClick={() => {
                         toggleRead()
                        }}>
                        </FiberNewIcon>
                        <p><strong>post!</strong></p>
                        </>
                    }
                    </div>
                </div>
                <div className='postText'
                onClick={() => {navigate(`/post/${value.id}`)}}> {value.postText} </div>
                <div className='imageUrl'> { value.imageUrl } </div>
                <div className="userContainer">
                    <div className='username'
                    onClick={() =>{navigate(`/post/${value.id}`)}}> Posted by {value.username}
                    </div>
                    <div className="likeContainer">
                    <ThumbUpIcon
                     className={likedPosts.includes(value.id) ? "unlikeBtn" : "likeBtn" }
                     style={{ fontSize: '1.5rem', height: '27px' }}
                     onClick={() =>
                     {likePost(value.id)}}>
                        {" "}
                        Like
                    </ThumbUpIcon>
                    <label> {value.Likes.length} </label>
                    </div>
                </div>
            </div> 
            );
        })}
        </div>  
  )
}

export default Home