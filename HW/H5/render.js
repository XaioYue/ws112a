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
    
        input[type=text],
        [type=tel] {
          border: 1px solid #eee;
          border-top-color: #ddd;
          border-left-color: #ddd;
          border-radius: 2px;
          padding: 15px;
          font-size: .8em;
        }
    
        input[type=text] {
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
    `
  }
  
  export function list(posts) {
    let list = []
    for (let post of posts) {
      list.push(`
      <li>
        <h2>${ post.title }</h2>
        <p><a href="/post/${post.id}">詳細資訊</a></p>
      </li>
      `)
    }
    let content = `
    <h1>通訊錄</h1>
    <p>你有<strong>${posts.length}</strong>位聯絡人!</p>
    <p><a href="/post/search">查詢聯絡人</p>
    <p><a href="/post/new">新增聯絡人</a></p>
    <ul id="posts">
      ${list.join('\n')}
    </ul>
    `
    return layout('通訊錄', content)
  }
  
  export function newPost() {
    return layout('新增聯絡人', `
    <h1>新增聯絡人</h1>
    <p>聯絡人資訊</p>
    <form action="/post" method="post">
      <p><input type="text" placeholder="姓名" name="title" required></p>
      <p><input type="tel" placeholder="電話號碼" pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}" name="body" required></p>
      <p><input type="submit" value="新增"></p>
    </form>
    `)
  }
  
  export function show(post) {
    return layout(post.title, `
      <h1>${post.title}</h1>
      <pre>${post.body}</pre>
    `)
  }
  
  export function search() {
    return layout('查詢聯絡人', `
    <h1>查詢聯絡人</h1>
    <form action="/search" method="post">
      <p><input type="text" placeholder="姓名" name="name" required></p>
      <p><input type="submit" value="查詢"></p>
    </form>
    `)
  }
  
  export function notfound() {
    return layout('查詢聯絡人', `
    <h1>查詢聯絡人</h1>
    <form action="/search" method="post">
      <p><input type="text" placeholder="姓名" name="name" required></p>
      <p><input type="submit" value="查詢"></p>
    </form>
    <h1>查無此人</h1>
    `)
  }