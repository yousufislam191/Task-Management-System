<h1 align="center">Task Management System</h1>
<p align="center">
<strong>"Task Management System"</strong> is a simple full-stack web application. Inside this app, the admin has more control than the user. The user will be able to just read their assigned task, update their task status and profile, and delete their account. On the other hand, admin will be able to do everything.
</p>

#### Visit website: <a href="https://task-management-system-flax.vercel.app" target="_blank">https://task-management-system-flax.vercel.app</a>

#### For Admin login---> Email: `tms-admin@gmail.com` | Password: `1qasw2!@Q`

<h3>Features that have been implemented</h3>

- Login, Logout, and Registration authentication
- Access token, and Refresh token based authentication
- Role-based authorization
- Account activated through token email verification
- Reset password through token email verification
- Update user profile
- Manage users by admin
- Task management
- Task status management
- Search and filter tasks
- Delete tasks
- Update tasks
- Automatically send reminder emails to users 15 minutes before the deadline for an assigned task
- Automatically move failed task data to the failed task table from the main table in the database
<h3>Technology that have been used</h3>

[React.js](https://react.dev/learn),
[Material UI](https://mui.com/material-ui/getting-started/installation/),
[Tailwind CSS](https://tailwindcss.com/docs/installation),
[Node.js](https://nodejs.org/en),
[Express.js](https://expressjs.com/en/starter/installing.html),
[MySQL](https://dev.mysql.com/doc/mysql-getting-started/en/),
[Sequelize ORM](https://sequelize.org/docs/v6/getting-started/)

<h1 align="center">Run this web application on your local server</h1>
<p align="center">Here is the step-by-step guideline that will help you run this project on your local server.</p>

1. **Open your terminal and clone the repository using this command**

```terminal
git clone https://github.com/yousufislam191/Task-Management-System.git
```

2. **After cloning, you will see a folder which name is `Task-Management-System`. Open this foler using vs code. After opening, you will see there are two folders which will be `client` and `server`.**

---

3. **For running front-end site, open your terminal in your vs code and run this three command**

```terminal
cd client
npm install
npm run dev
```

4. **You will get to show a URL where the front-end site is running, then open this link in your browser.**

---

5. _Now it's time to run the backend site, and there are some steps for running the backend site, and you have to follow these steps **strictly**; otherwise, you will face some errors._
6. **Open a new terminal in your vs code then run this two command.**

```terminal
cd server
npm install
```

7. **Go to your email to create `SMTP App Password` or by clicking [here][1], or you can watch this [video][2] to understand the better way. After creating the password, you have to save this password in your notepad for later uses because you will never get it after closing the window.**

[1]: https://security.google.com/settings/security/apppasswords "SMTP App Password"
[2]: https://youtu.be/qpAI5qZR9ms?si=mlC-cNmT4gs5riMf "Youtube Video"

8. **After that, create a new file in your root folder of the `server` folder which name will be `.env`, or you will be able to see a `.env.example` file, where you can set the environment variable by removin `.example` from the `.env.example`.**
9. **Inside the `.env` file, you have to store some of your environment variables. Your environment variables must be exactly the same format. For example, `APP_NAME= Task Management System`. All environment variables are named below:**

| Environment Variable Name           | Value                                                                                                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SERVER_PORT                         | Your server port number, you can use any number, like `5100`                                                                                               |
| DB_PORT                             | Your database port number like `3306`                                                                                                                      |
| DB_HOST                             | Your database host name like `localhost`                                                                                                                   |
| DB_USER_NAME                        | Your database username. By default your local mysql server username will be `root`                                                                         |
| DB_PASS                             | Your database password                                                                                                                                     |
| DB_NAME                             | Your database name                                                                                                                                         |
| APP_NAME                            | You can be use any name such as `Task Management System`                                                                                                   |
| CLIENT_URL                          | Your client site url which you are already running for front-end                                                                                           |
| CORS_ORIGIN                         | Your client site url which you are already running for front-end                                                                                           |
| USER_ACCOUNT_ACTIVATE_KEY           | You can be use any some word like uppercase, lowercase, number                                                                                             |
| USER_ACCOUNT_JWT_EXPIRE_TIME        | You can be use any number like `10m` (ten minutes)                                                                                                         |
| USER_LOGIN_KEY                      | You can be use any some word like uppercase, lowercase, number                                                                                             |
| USER_ACCESS_TOKEN_EXPIRE_TIME       | You can be use any number like `5m` (five minutes)                                                                                                         |
| REFRESH_TOKEN_KEY                   | You can be use any some word like uppercase, lowercase, number                                                                                             |
| USER_REFRESH_TOKEN_EXPIRE_TIME      | You can be use any number but it must be a day like `7d` (seven days). And of course its duration must be greater than the `USER_ACCESS_TOKEN_EXPIRE_TIME` |
| USER_PASSWORD_RESET_KEY             | You can be use any some word like uppercase, lowercase, number                                                                                             |
| USER_PASSWORD_RESET_JWT_EXPIRE_TIME | You can be use any number like `10m` (ten minutes)                                                                                                         |
| SMTP_USERNAME                       | This will be your email and the email you used to create the `SMTP App Password` in step 7 will be here                                                    |
| SMTP_PASSWORD                       | This will be your password which you created in step 7 and saved in notepad                                                                                |

10. **Then save changes and run this command.**

```terminal
npm run dev
```

<h4 align="center">Ok now enjoy everything ✌️</h4>

---

<h1 align="center">API Endpoints</h1>

Here are all the API endpoints for this project. And you can also [**visit**][10] the Postman API documentation for these projects.

<h2 align="left">User API</h2>

- `GET /api/user` : Get all users with task status activities. _[for admin only]_
- `GET /api/user/:id` : Get user by id.
- `POST /api/user/register` : Create user account.
- `POST /api/user/verify-account` : Verify user account.
- `POST /api/user/forgot-password` : Forget user password.
- `PUT /api/user/reset-password` : Reset user password.
- `PUT /api/user/:id` : Update user account by id.
- `PUT /api/user/update-password/:id` : Update user password.
- `DELETE /api/user/:id` : Delete user by id.

<h2 align="left">Auth API</h2>

- `POST /api/auth/login` : User login.
- `POST /api/auth/logout` : User logout.
- `GET /api/auth/refresh-token` : Generate refresh token.
- `GET /api/auth/protected` : Check protected access.

<h2 align="left">Task API</h2>

- `POST /api/task` : Get all tasks. _[for admin only]_
- `GET /api/task/single-task/:id` : Get task by id.
- `POST /api/task/user-tasks` : Get all task for a particular user.
- `POST /api/task/create-task` : Create new task. _[for admin only]_
- `PUT /api/task/:id` : Update task by id. _[for admin only]_
- `PUT /api/task/status/:id` : Update task status. _[for user only]_
- `DELETE /api/task/:id` : Delete task by id. _[for admin only]_

<h2 align="left">Seed API</h2>

Seed API has been used for enhancing development purposes. For the production grade, it has been disabled. You will be able to use it for your local server by removing the `//` from the `app.js` file.

- `GET /api/seed/users` : Seed user.
- `GET /api/seed/tasks` : Seed task.

<h1>About Developer</h1>

**[Facebook][3]** |
**[Linkedin][4]** |
**[Instagram][5]** |
**[Twittwer][6]** |
**[Github][7]** |
**[Kaggle][8]** |
**[Website][9]**

[3]: https://facebook.com/yousufislam191
[4]: https://linkedin.com/in/yousufislam191
[5]: https://instagram.com/yousufislam191
[6]: https://twitter.com/yousufislam_191
[7]: https://github.com/yousufislam191
[8]: https://kaggle.com/yousufislam191
[9]: https://yousufislam191.github.io
[10]: https://documenter.getpostman.com/view/27853638/2s9YCBsoy2
