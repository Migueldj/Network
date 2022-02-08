import React, { useState, useEffect } from 'react';
import { Card } from "./Card"

export const App = () => {
    const [posts, setPosts] = useState();
    function fetchData() {
        return fetch('/allPosts')
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setPosts(json)
        })
    }
    useEffect(() => {
        fetchData()
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
