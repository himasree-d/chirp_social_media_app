<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.net.HttpURLConnection, java.net.URL, java.io.InputStreamReader, java.io.BufferedReader" %>
<%@ page import="com.google.gson.JsonObject, com.google.gson.JsonParser" %>
<%
    // Server-side fetching of profile data from Node.js API
    String username = request.getParameter("username");
    if (username == null || username.isEmpty()) {
        response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Username is required");
        return;
    }

    String apiUrl = "http://localhost:5001/api/users/" + username;
    String postsUrl = "http://localhost:5001/api/users/" + username + "/posts";
    
    JsonObject profileData = null;
    com.google.gson.JsonArray posts = null;

    try {
        // Fetch Profile
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        if (conn.getResponseCode() == 200) {
            BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) sb.append(line);
            rd.close();
            profileData = JsonParser.parseString(sb.toString()).getAsJsonObject().getAsJsonObject("data");
        }

        // Fetch Posts
        URL pUrl = new URL(postsUrl);
        HttpURLConnection pConn = (HttpURLConnection) pUrl.openConnection();
        pConn.setRequestMethod("GET");
        if (pConn.getResponseCode() == 200) {
            BufferedReader rd = new BufferedReader(new InputStreamReader(pConn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) sb.append(line);
            rd.close();
            posts = JsonParser.parseString(sb.toString()).getAsJsonObject().getAsJsonArray("data");
        }
    } catch (Exception e) {
        // Handle error, maybe fallback to client-side fetch or show generic error
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= profileData != null ? profileData.get("displayName").getAsString() : username %> | Haven</title>
    
    <!-- Importing Haven Design System Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --cream: #FAF7F2;
            --sand: #EDE8DF;
            --charcoal: #3A3530;
            --warm-taupe: #B8A99A;
            --terracotta: #D4846A;
            --font-display: 'Cormorant Garamond', serif;
            --font-body: 'DM Sans', sans-serif;
            --radius-organic: 16px 24px 12px 20px;
        }

        body {
            margin: 0;
            font-family: var(--font-body);
            background-color: var(--cream);
            color: var(--charcoal);
            text-align: center;
        }

        .profile-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .avatar {
            width: 150px;
            height: 150px;
            border-radius: var(--radius-organic);
            object-fit: cover;
            border: 4px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        h1 {
            font-family: var(--font-display);
            color: var(--terracotta);
            margin: 10px 0 0 0;
            font-size: 2.5rem;
        }

        p.bio {
            color: var(--charcoal);
            font-size: 1.1rem;
            max-width: 500px;
            margin: 10px auto;
        }

        .follow-cta {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background-color: var(--terracotta);
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            transition: opacity 0.3s;
        }
        
        .follow-cta:hover {
            opacity: 0.9;
        }

        /* Post Grid */
        .post-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 40px;
        }

        .post-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <% if (profileData != null) { %>
        <div class="profile-container">
            <img class="avatar" src="<%= profileData.get("avatarUrl").getAsString() %>" alt="Avatar">
            <h1><%= profileData.get("displayName").getAsString() %></h1>
            <p>@<%= profileData.get("username").getAsString() %></p>
            <p class="bio"><%= profileData.get("bio") != null && !profileData.get("bio").isJsonNull() ? profileData.get("bio").getAsString() : "" %></p>
            
            <a href="havenapp://profile/<%= username %>" class="follow-cta">Follow on Haven</a>
            
            <div class="post-grid">
                <% if (posts != null) { 
                    for (int i = 0; i < posts.size(); i++) {
                        JsonObject post = posts.get(i).getAsJsonObject();
                %>
                    <div class="post-item">
                        <img src="<%= post.get("imageUrl").getAsString() %>" alt="Post">
                    </div>
                <%      } 
                   } else { %>
                    <p>No moments shared yet.</p>
                <% } %>
            </div>
        </div>
    <% } else { %>
        <div class="profile-container">
            <h1>Profile Not Found</h1>
            <p>We couldn't find the requested profile.</p>
        </div>
    <% } %>
</body>
</html>
