import React , { useEffect, useState }from 'react';

export const Card = ({post}) => {
    const [likes, setLikes] = useState();
    const [isLiked, setIsLiked] = useState(false);
    const [edit, setEdit] = useState(false)
    const [postContent, setPostContent] = useState(post.content)
    const [canEdit, setCanEdit] = useState()

    useEffect(() => {
        fetch(`/post/${post.id}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setLikes(json.likes.length)
            setIsLiked(json.isLiked)
            setCanEdit(json.canEdit)
        });
    }, []);

    function handleClickUser(){
        window.location.href = `/user/${post.user}`;
    }

    function handleClickLike(post_id){
        fetch(`/post/${post_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                like: true,
                edit: false,
            })
        });
        if (isLiked) {
            setLikes(likes-1)
        } else {
            setLikes(likes+1)
        }
        setIsLiked(!isLiked)
    }

    const handleClickSave = () => {
        setEdit(false)
        fetch(`/post/${post.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                edit: true,
                like: false,
                text: postContent,
            })
        });
    }

    const handleOnChangeInput = (e) => {
        setPostContent(e.target.value)
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
            <div>
                {
                    edit ? (
                        <>
                        <input
                            type={"text"}
                            value={postContent}
                            autoFocus={true}
                            class="form-control"
                            onChange={handleOnChangeInput}
                        >
                        </input>
                        <button
                            onClick={handleClickSave}
                        >
                            Save
                        </button>
                        </>
                    ) 
                    : 
                    (
                        <p>{postContent}</p>                  
                    )
                }
            </div>
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
                <div>
                <div>
                    {
                        canEdit ? (
                            <button
                                onClick={() => {
                                    setEdit(true)
                                }}
                            >
                                Edit
                            </button>
                        ) : ""
                    }

                </div>
                </div>
            </div>
        </div>
    </div>
  );
}
