import React from 'react';

export const Card = ({post}) => {
  return (
    <div class="post">
        <div class="margin-card">
            <div class="d-flex justify-between">
                <a>{post.user}</a>
                {post.timestamp}
            </div>
            <div>{post.content}</div>
            <div>
                <div>
                    Likes: {post.likes.length}
                </div>
            </div>
        </div>
    </div>
  );
}
