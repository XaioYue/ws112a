// app.js

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

// 建立與設定資料庫
const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, title TEXT,value TEXT, contan TEXT, body TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");

// 建立路由
const router = new Router();

// 定義路由的處理函式
router
  .get('/', list)
  .get('/signup', signupUi)
  .post('/signup', signup)
  .get('/login', loginUi)
  .post('/login', login)
  .get('/logout', logout)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create);

// 建立應用程式
const app = new Application();
app.use(Session.initMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());

// SQL 命令執行函式
function sqlcmd(sql, arg1) {
  console.log('sql:', sql);
  try {
    var results = db.query(sql, arg1);
    console.log('sqlcmd: results=', results);
    return results;
  } catch (error) {
    console.log('sqlcmd error: ', error);
    throw error;
  }
}

// SQL 查詢結果轉換為物件陣列的函式
function postQuery(sql) {
  let list = [];
  for (const [id, username, title, value, contan, body] of sqlcmd(sql)) {
    list.push({ id, username, title, value, contan, body });
  }
  console.log('postQuery: list=', list);
  return list;
}

// SQL 查詢結果轉換為用戶物件陣列的函式
function userQuery(sql) {
  let list = [];
  for (const [id, username, password, email] of sqlcmd(sql)) {
    list.push({ id, username, password, email });
  }
  console.log('userQuery: list=', list);
  return list;
}

// 解析表單 body 的異步函式
async function parseFormBody(body) {
  const pairs = await body.value;
  const obj = {};
  for (const [key, value] of pairs) {
    obj[key] = value;
  }
  return obj;
}

// 顯示註冊頁面
async function signupUi(ctx) {
  ctx.response.body = await render.signupUi();
}

// 處理註冊請求
async function signup(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    var user = await parseFormBody(body);
    var dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`);
    if (dbUsers.length === 0) {
      sqlcmd("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
      ctx.response.body = render.success();
    } else {
      ctx.response.body = render.fail();
    }
  }
}

// 顯示登入頁面
async function loginUi(ctx) {
  ctx.response.body = await render.loginUi();
}

// 處理登入請求
async function login(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    var user = await parseFormBody(body);
    var dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`);
    var dbUser = dbUsers[0];
    if (dbUser.password === user.password) {
      ctx.state.session.set('user', user);
      console.log('session.user=', await ctx.state.session.get('user'));
      ctx.response.redirect('/');
    } else {
      ctx.response.body = render.fail();
    }
  }
}

// 處理登出請求
async function logout(ctx) {
  ctx.state.session.set('user', null);
  ctx.response.redirect('/');
}

// 顯示所有文章列表
async function list(ctx) {
  let posts = postQuery("SELECT id, username, title,  value, contan, body FROM posts");
  console.log('list:posts=', posts);
  ctx.response.body = await render.list(posts, await ctx.state.session.get('user'));
}

// 顯示新增文章頁面
async function add(ctx) {
  var user = await ctx.state.session.get('user');
  if (user != null) {
    ctx.response.body = await render.newPost();
  } else {
    ctx.response.body = render.fail();
  }
}

// 顯示單一文章頁面
async function show(ctx) {
  const pid = ctx.params.id;
  let posts = postQuery(`SELECT id, username, title,  value, contan, body FROM posts WHERE id=${pid}`);
  let post = posts[0];
  console.log('show:post=', post);
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}

// 處理新增文章請求
async function create(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var post = await parseFormBody(body)
    console.log('create:post=', post)
    // 取得使用者資訊
    var user = await ctx.state.session.get('user')
    if (user != null) {
      console.log('user=', user)

       // 將新增的文章資料寫入資料庫，包括 value 欄位
       sqlcmd("INSERT INTO posts (username, title, value, contan, body) VALUES (?, ?, ?, ?, ?)", [user.username, post.title, post.value, post.contan, post.body]);    
    } else {
      ctx.throw(404, 'not login yet!');
    }
    ctx.response.redirect('/');
  }
}

// 啟動應用程式監聽指定的端口
console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });

