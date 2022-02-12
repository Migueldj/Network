import React, { useState, useEffect } from 'react';
import { Card } from "./Card"

export const App = () => {

    const [posts, setPosts] = useState();
    const [postsToShow, setPostsToShow] = useState()
    const [loading, setLoading] = useState(true)
    const [index, setIndex] = useState(0)
    const [numOfIndex, setNumOfIndex] = useState([])
    const [showPosts, setShowPosts] = useState(true)

    let location = window.location.href
    let username;

    if (location.includes("user")) {
        const regex = /[^\/]+$/
        username = location.match(regex)[0]
    }

    const initPagination = (array) => {
        const aux = Math.ceil(array.length/10)
        let arr = []
        for (let i = 0; i < aux ; i++) {
            arr.push(i)
        }
        setNumOfIndex(arr)
        
        if (array.length < 10) {
            setPostsToShow(array)
        } else {
            setPostsToShow(array.slice(0,9))
        }

    }

    function fetchData(url) {
        return fetch(`${url}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            initPagination(json)
            setLoading(false)
            setPosts(json)
        })
    }

    function fetchUserPosts(){
        fetch(`/userPosts/${username}`)
        .then(response => response.json())
        .then(json => {
            console.log("posts del usuario", json);
            initPagination(json)
            setLoading(false)
            setPosts(json)
        });
    }

    const changePostsToShow = (index) => {
        let aux = [...posts]
        let newAux = aux.splice(index*10, 10)
        console.log("estos se mostrarán ahora", newAux)
        setPostsToShow(newAux)
        setLoading(false)
    }


    useEffect(() => {
        if (location.includes("following")) {
            fetchData('/allFollowing')
        } else if (location.includes("user") && !location.includes("login")) {
            fetchUserPosts()
        } else if (location.includes("login") || location.includes("register")) {
            setShowPosts(false)
        } else {
            fetchData('/allPosts')
        }
    }, []); 

  return(
      <>
        {showPosts 
            ? (
                <>
                <div style={{"margin-top":"20px"}}>
                    {   
                        loading ? (
                            <div style={{"color":"white"}}>Loading posts...</div>
                        ) : (
                            postsToShow.map((el) => { return <Card post={el} key={el.id}/> })
                        )
                    }
                </div>
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        {
                            numOfIndex.map( el => 
                            <li 
                                className="page-item"
                                key={el}
                                onClick={() => {
                                    setLoading(true)
                                    setIndex(el)
                                    changePostsToShow(el)
                                }}
                            >
                                <a className="page-link">{el + 1}</a>
                            </li>
                            )
                        }
                    </ul>
                </nav>
                </>
            ) : ""
        }
       
      </>
  )
};
