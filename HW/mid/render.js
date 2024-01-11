// render.js

// 產生 HTML 頁面的框架
export function layout(title, content) {
  return `
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          padding: 80px;
          font: 16px Helvetica, Arial;
        }
    
        h1 {
          font-size: 2em;
        }
    
        h2 {
          font-size: 1.2em;
        }
    
        #posts {
          margin: 0;
          padding: 0;
        }
    
        #posts li {
          margin: 40px 0;
          padding: 0;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
          list-style: none;
        }
    
        #posts li:last-child {
          border-bottom: none;
        }
    
        textarea {
          width: 500px;
          height: 300px;
        }
    
        input[type=text],input[type=password],
        textarea {
          border: 1px solid #eee;
          border-top-color: #ddd;
          border-left-color: #ddd;
          border-radius: 2px;
          padding: 15px;
          font-size: .8em;
        }
    
        input[type=text],input[type=password] {
          width: 500px;
        }
      </style>
    </head>
    <body>
      <section id="content">
        ${content}
      </section>
    </body>
    </html>
    `;
}

// 產生登入頁面的 HTML
export function loginUi() {
  return layout('Login', `
    <h1>Login</h1>
    <form action="/login" method="post">
      <p><input type="text" placeholder="username" name="username"></p>
      <p><input type="password" placeholder="password" name="password"></p>
      <p><input type="submit" value="Login"></p>
      <p>New user? <a href="/signup">Create an account</p>
    </form>
    `);
}

// 產生註冊頁面的 HTML
export function signupUi() {
  return layout('Signup', `
    <h1>Signup</h1>
    <form action="/signup" method="post">
      <p><input type="text" placeholder="username" name="username"></p>
      <p><input type="password" placeholder="password" name="password"></p>
      <p><input type="text" placeholder="email" name="email"></p>
      <p><input type="submit" value="Signup"></p>
    </form> as Listener;Read post
    `);
}

// 產生成功頁面的 HTML
export function success() {
  return layout('Success', `
    <h1>Success!</h1>
    You may <a href="/">read all Post</a> / <a href="/login">login</a> again !
    `);
}

// 產生失敗頁面的 HTML
export function fail() {
  return layout('Fail', `
    <h1>Fail!</h1>
    You may <a href="/">read all Post</a> or <a href="JavaScript:window.history.back()">go back</a> !
    `);
}

// 產生文章列表頁面的 HTML
export function list(posts, user) {
  console.log('list: user=', user);
  let list = [];
  for (let post of posts) {
    list.push(`
      <li>
        <h2>${ post.title } -- $ ${post.value} NTD</h2>
        <p><a href="/post/${post.id}">Read more</a></p>
      </li>
    `);
  }
  let content = `
    <h1>inventory</h1>
    <p>${(user==null)?'<a href="/login">Login</a> to Create a Post!':'Welcome '+user.username+', You may <a href="/post/new">Create a Post</a> or <a href="/logout">Logout</a> !'}</p>
    <p>There are <strong>${posts.length}</strong> product!</p>
    <ul id="posts">
      ${list.join('\n')}
    </ul>
    `;
  return layout('Posts', content);
}

// 產生新增文章頁面的 HTML
export function newPost() {
  return layout('New Post', `
    <h1>New List</h1>
    
    <form action="/post" method="post">
      <p><input type="text" placeholder="Product" name="title"></p>
      <p><input type="text" placeholder="$(NTD)" name="value"></p>
      <p><input type="text" placeholder="Number of Products" name="contan"></p>
      <p><textarea placeholder="Contents" name="body"></textarea></p>
      <p><input type="submit" value="Create"></p>
    </form>
    `);
}

// 產生顯示單一文章頁
export function show(post) {
  return layout(post.title, `
    <h1>product name:  ${post.title}  -- renew by ${post.username}</h1>
    <h2>Number of Products:  ${post.contan} NTD <h2>
    <h3>price:  ${post.value} NTD <h3>
    <p>description: ${post.body}</p>
    
  `)
}