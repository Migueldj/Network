
document.addEventListener('DOMContentLoaded', function() {
    userSignedIn=document.getElementById('user-page')
    if (userSignedIn) {
        userSignedIn.addEventListener('click', () => load_posts("userPosts"));
    }
    document.getElementById('all-posts').addEventListener('click', () => load_posts("allPosts"));

    load_posts("allPosts");

});

function load_posts(filter){
    document.querySelector('.posts-view').innerHTML = ""; //This clears the previous posts displayed on the page
    retrieve_posts(filter);
}

function retrieve_posts(filter) {
    fetch(`/${filter}`)
    .then(response => response.json())
    .then(posts => {
        posts.forEach(add_post);
        console.log(posts);
    });
}

function add_post(contents){
    const post = document.createElement('div');
    const user = document.createElement('div');
    const content = document.createElement('div');
    const timestamp = document.createElement('div');
    const likes = document.createElement('div');
    post.className = 'post';
    user.className = 'user';
    user.innerHTML = `${contents.user}`;
    content.className = 'content';
    content.innerHTML = `${contents.content}`;
    timestamp.className = 'timestamp';
    timestamp.innerHTML = `${contents.timestamp}`;
    likes.className = 'likes';
    likes.innerHTML = `Like: ${contents.likes.length}`;
    
    post.append(user);
    post.append(content);
    post.append(likes);
    post.append(timestamp);
    document.querySelector('.posts-view').append(post);
}
