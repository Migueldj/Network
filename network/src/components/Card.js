import React , { useEffect, useState }from 'react';

export const Card = ({post}) => {
    const [likes, setLikes] = useState();
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        fetch(`/post/${post.id}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setLikes(json.likes.length)
            setIsLiked(json.isLiked)
        });
    }, []);

    function handleClickUser(){
        window.location.href = `/user/${post.user}`;
    }

    function handleClickLike(post_id){
        fetch(`/post/${post_id}`, {
            method: 'PUT',
        });
        if (isLiked) {
            setLikes(likes-1)
        } else {
            setLikes(likes+1)
        }
        setIsLiked(!isLiked)
    }
    
  return (
    <div class="post">
        <div class="margin-card">
            <div class="d-flex justify-between">
                <p
                onClick={handleClickUser}
                >
                    {post.user}
                </p>
                {post.timestamp}
            </div>
            <div>{post.content}</div>
            <div>
                <div>
                    Likes: {likes}
                    <button
                        onClick={() => {
                            console.log(post.id);
                            handleClickLike(post.id)
                        }}
                    >
                        {
                            isLiked
                            ? 
                            "unlike"
                            :
                            "like"
                        }
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
