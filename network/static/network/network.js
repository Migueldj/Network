
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('user-page').addEventListener('click', () => retrieve_posts());
});

function retrieve_posts() {
    fetch(`/userPosts`)
    .then(response => response.json())
    .then(posts => {
        posts.forEach(add_post);
        console.log(posts);
    });
}

function add_post(contents){
    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = `${contents.content}`;
    console.log(contents.content);
    document.querySelector('.posts-view').append(post);
}
