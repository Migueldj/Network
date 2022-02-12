import React , { useEffect, useState }from 'react';
import { IconButton } from '@material-ui/core';

export const Card = ({post}) => {
    const [likes, setLikes] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [edit, setEdit] = useState(false)
    const [postContent, setPostContent] = useState(post.content)
    const [canEdit, setCanEdit] = useState()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        fetch(`/post/${post.id}`)
        .then(response => response.json())
        .then(json => {
            console.log("post info",json);
            setLikes(json.likes.length)
            setIsLiked(json.isLiked)
            setCanEdit(json.canEdit)
            //This URL con only be fetched if the user is logged in and the loggedIn state changes to true, otherwise it remains false
            //This condition purpose is to give the user the ability to like a post
            setIsLoggedIn(true)
        });
    }, []);

    function handleClickUser(){
        window.location.href = `/user/${post.user}`;
    }

    function handleClickLike(){
        fetch(`/post/${post.id}`, {
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
            <div class="d-flex justify-between align-items-center mb-2">
                <div className='d-flex align-items-center'>
                    <img
                        className='user-icon mr-1'
                        src='https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'
                    />
                    <p className='cursor-pointer m-0 h5'
                        onClick={handleClickUser}
                    >
                        {post.user}
                    </p>
                </div>
                {post.timestamp}
            </div>
            <div className="d-flex align-center justify-content-between ml-icon-text">
                <div className='d-flex w-100'>
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
                            {/* <button
                                onClick={handleClickSave}
                            >
                                Save
                            </button> */}
                            </>
                        ) 
                        : 
                        (
                            <div className='d-flex align-items-center'>
                                <p className='m-0'>{postContent}</p>   
                            </div>
                                           
                        )
                    }
                </div>
                <div>
                    {
                        canEdit && !edit ? (
                            <IconButton
                                size={"small"}
                                onClick={() => {
                                    setEdit(true)
                                }}
                            >
                                <img
                                src={"https://www.pdfzorro.com/Images/IconsFunktionen/pdf-edit.webp"}
                                alt="Play"
                                width={20}
                                height={20}
                                />
                            </IconButton>
                        ) : 
                            ""
                    }
                    {
                        edit ? (
                            <IconButton
                                size={"small"}
                                onClick={handleClickSave}
                            >
                                <img
                                src={"https://icons-for-free.com/iconfiles/png/512/save+icon-1320167995084087448.png"}
                                alt="Play"
                                width={20}
                                />
                            </IconButton>
                        ) : 
                            ""
                    }
                </div>
            </div>
            <div className='ml-icon-text'>
                <div className='d-flex align-items-center'>
                    <IconButton
                        size={"small"}
                        onClick={() => {
                            isLoggedIn && handleClickLike()
                        }}
                    >
                        <img
                        src={isLiked ? "https://e7.pngegg.com/pngimages/763/345/png-clipart-like-button-social-media-facebook-messenger-speak-listen-apply-blue-angle-thumbnail.png" : "https://icones.pro/wp-content/uploads/2021/04/icone-noire-noir.png"}
                        alt="Play"
                        width={28}
                        />
                    </IconButton>
                    {likes}
                </div>
                <div>
                </div>
            </div>
        </div>
    </div>
  );
}
