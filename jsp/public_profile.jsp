<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Haven — Public Profile</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #FAF8F5; color: #2D2D2D; }
    .profile-header { text-align: center; padding: 60px 20px 40px; background: linear-gradient(180deg, #EAE5DE 0%, #FAF8F5 100%); }
    .avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid #4A5D3A; margin-bottom: 16px; }
    .display-name { font-size: 28px; font-weight: 700; color: #2D2D2D; }
    .username { font-size: 16px; color: #8A8578; margin-top: 4px; }
    .bio { font-size: 15px; color: #5A5650; margin-top: 12px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.5; }
    .posts-section { max-width: 600px; margin: 0 auto; padding: 20px; }
    .post-card { background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .loading { text-align: center; padding: 40px; font-size: 16px; color: #8A8578; }
    .error { color: #D4654A; text-align: center; padding: 40px; }
    .brand { text-align: center; padding: 40px; font-size: 14px; color: #B0A99F; }
    .brand a { color: #4A5D3A; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>

  <div id="profile-container">
    <div class="loading">Loading profile...</div>
  </div>

  <script>
    // This script fetches data from the Haven Node.js API
    // In a real JSP application, this might be fetched on the server side using HttpURLConnection
    const username = new URLSearchParams(window.location.search).get('u') || 'example';
    
    fetch('http://localhost:5000/api/users/public/' + username)
      .then(response => {
        if (!response.ok) throw new Error('User not found');
        return response.json();
      })
      .then(data => {
        const { user, posts } = data;
        const container = document.getElementById('profile-container');
        
        let html = \`
          <div class="profile-header">
            \${user.avatar 
              ? \`<img class="avatar" src="\${user.avatar}" alt="\${user.displayName}">\`
              : \`<img class="avatar" src="https://ui-avatars.com/api/?name=\${user.username}&background=4A5D3A&color=fff&size=120" alt="\${user.username}">\`
            }
            <div class="display-name">\${user.displayName || user.username}</div>
            <div class="username">@\${user.username}</div>
            \${user.bio ? \`<div class="bio">\${user.bio}</div>\` : ''}
          </div>
          <div class="posts-section">
        \`;

        if (posts.length === 0) {
          html += \`<div class="post-card" style="text-align:center; color:#8A8578">No public posts yet.</div>\`;
        } else {
          posts.forEach(post => {
            const date = new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            html += \`
              <div class="post-card">
                <div style="font-size: 15px; line-height: 1.6; margin-bottom: 12px;">\${post.content || ''}</div>
                \${post.image ? \`<img src="\${post.image}" style="width:100%; border-radius:12px; margin-bottom:12px;" alt="Post image">\` : ''}
                <div style="font-size: 13px; color: #8A8578;">
                  <span>♥ \${post.likes.length}</span> • <span>💬 \${post.commentCount}</span> • <span>\${date}</span>
                </div>
              </div>
            \`;
          });
        }

        html += \`
          </div>
          <div class="brand">Explore more on <a href="http://localhost:5173">Haven</a></div>
        \`;

        container.innerHTML = html;
      })
      .catch(err => {
        document.getElementById('profile-container').innerHTML = 
          \`<div class="error">\${err.message}. Try adding ?u=username to the URL.</div>\`;
      });
  </script>
</body>
</html>
