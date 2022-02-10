import React, { useState, useEffect } from 'react';
import { Card } from "./Card"

export const App = () => {

    const [posts, setPosts] = useState();

    let location = window.location.href
    let username;
    if (location.includes("user")) {
        const regex = /[^\/]+$/
        username = location.match(regex)[0]
    }

    console.log(username)

    function fetchData(url) {
        return fetch(`${url}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setPosts(json)
        })
    }

    function fetchUserPosts(){
        fetch(`/userPosts/${username}`)
        .then(response => response.json())
        .then(json => {
            console.log("posts del usuario", json);
            setPosts(json)
        });
    }

    useEffect(() => {
        if (location.includes("following")) {
            fetchData('/allFollowing')
        } else if (location.includes("user")) {
            fetchUserPosts()
        } else {
            fetchData('/allPosts')
        }
    }, []); 

  return(
      <>
        <div>
            {   
                posts?.map(el => <Card post={el}/>)
            }
        </div>
      </>
  )
};
