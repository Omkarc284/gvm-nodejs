# Test Response:

## Section 1: General Node.js Knowledge

### 1.1. What is Node.js, and how does it differ from traditional server-side technologies like PHP or Java?

`Node.js` is a powerful, open-source JavaScript runtime environment. It's unique because it runs JavaScript code outside of the browser, using the same `V8 engine` that powers Google Chrome. This allows Node.js to be incredibly fast and efficient.

Unlike traditional server-side technologies like `PHP` or `Java`, Node.js operates in a single process, handling requests asynchronously. This means it doesn't create a new thread for every request, which can make it more scalable and efficient for handling many concurrent connections. Additionally, Node.js emphasizes non-blocking I/O operations, ensuring that JavaScript code doesn't get stuck waiting for tasks to complete.

In simple terms, Node.js enables developers to write server-side code in JavaScript, leveraging its speed and asynchronous nature to build fast and scalable applications.


### 1.2. Explain the concept of event-driven programming in Node.js and provide an example.
In Node.js, event-driven programming is a key concept where certain actions or events trigger functions to execute. These functions are registered as event handlers and are called asynchronously when the corresponding events occur. This allows Node.js to efficiently handle multiple tasks without blocking the execution of other code.

#### Example:
```
// Import the 'events' module
const EventEmitter = require('events');

// Create an instance of EventEmitter
const myEmitter = new EventEmitter();

// Register an event handler for the 'greet' event
myEmitter.on('greet', () => {
  console.log('Hello, world!');
});

// Emit the 'greet' event
myEmitter.emit('greet');

```
When the 'greet' event is emitted, the corresponding event handler function is executed, printing 'Hello, world!' to the console.

### 1.3. Describe the purpose of the package.json file in a Node.js project.
The `package.json` file in a Node.js project serves as a manifest for the project. It includes metadata about the project, such as its name, version, dependencies, scripts, and other configurations. This file is crucial for managing dependencies, running scripts, and sharing the project with others, as it provides a centralized way to define and control various aspects of the project's environment and behavior.

### 1.4. What is callback hell, and how can it be mitigated in Node.js applications?
`Callback hell` refers to the situation in Node.js where multiple nested callbacks are used, leading to code that is hard to read, understand, and maintain. This often happens when dealing with asynchronous operations, such as nested callbacks for handling asynchronous functions.

To mitigate callback hell in Node.js applications, developers can use techniques like modularization, named functions, and asynchronous control flow libraries. `Modularization ` involves breaking down complex code into smaller, reusable functions. Named functions help in making the code more readable by giving meaningful names to callback functions. Asynchronous control flow libraries like `Promises`, `async/await`, or using libraries such as `Async.js` provide cleaner and more manageable ways to handle asynchronous operations, avoiding deep nesting of callbacks and making the code more readable and maintainable.

### 1.5. What is npm, and why is it commonly used in Node.js projects?
`npm` or Node Package Manager, is a fundamental tool in the Node.js ecosystem. It serves as a central hub for managing dependencies and packages in Node.js projects. With npm, developers can easily `install`, `update`, and `remove` packages, streamlining the development process and ensuring consistency across projects. Moreover, npm fosters collaboration by providing a platform for developers to share their own packages with the community, contributing to a vibrant ecosystem of open-source libraries and tools. Overall, npm plays a crucial role in simplifying development workflows and promoting code reuse within the Node.js community.


## Project setup and access:

Clone the project 
```
git clone https://github.com/Omkarc284/gvm-nodejs
```

Cd into the project folder and install dependencies:
```
npm install
```

Run the project: 
```
npm run start
```
#### Or

Run in dev mode:
```
npm run dev
```

**Note**: `The project contains an env file for database connection URI. Using env files on pulic repository is not recommended and not safe but this is just for test purposes and the env variables will be redundant after the purpose of this repository is achieved.`

## Section 2: CRUD Operations
### 2.1. Create a simple Node.js server using Express that listens on port 3000.

Task completed: `index.js ` and  `app.js`

Require `app` as `app`, initialize port from `.env`,
since in `app.js` file I have initialized and exported the variable `app` as an instance of `express()`
the function below will instantiate an express server which will listen on the port `3000` as initialized in `.env`:
```
app.listen(port,() => {
        console.log('Server is up on port '+ port)
    })
```
index.js
```
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT

const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    app.listen(port,() => {
        console.log('Server is up on port '+ port)
    })
  } catch {
    // Ensures that the client will close when error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

```


app.js
```
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const tasksRouter = require('./routers/tasks')
const uploadRouter = require('./routers/uploads')
const registrationRouter = require('./routers/registrationRoutes');
const loginRouter = require('./routers/loginRoutes')
const passport = require('passport')
require('./controllers/authController')(passport);
const app = express();
const session = require('express-session');
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: "50mb",extended:true, parameterLimit:50000}));
app.use((req, res, next) => {
    // Set CORS headers so that the React SPA is able to communicate with this server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    next();
});
app.use(session({
    secret: process.env.SECRET, // Change this to a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
  }));
app.use(passport.initialize());
app.use('/tasks', tasksRouter);
app.use('/upload', uploadRouter);
app.use('/auth', registrationRouter);
app.use('/auth', loginRouter);


module.exports = app;
```

### 2.2. Set up routes for creating, reading, updating, and deleting resources (CRUD) for a hypothetical &quot;Task&quot; entity.

In `routers/tasks.js` I have created routes for CRUD for a hypothetical `Task` entity
```
const Router = require('express').Router;
const router = Router();
const { isAuthorized }= require('../middleware/isAuthenticated');

let tasks = [];


router.post('/new',isAuthorized(['admin', 'user']), (req, res) => {
    const { title, description } = req.body;
    const newTask = { id: tasks.length + 1, title, description };
    tasks.push(newTask);
    res.status(201).json(newTask);
});


router.get('/all', (req, res) => {
    res.json(tasks);
});


router.get('/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});


router.put('/:id', isAuthorized(['admin', 'user']),(req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { id: taskId, title, description };
        res.status(200).json(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});


router.delete('/:id', isAuthorized(['admin']), (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.status(204).send('Task deleted!');
    } else {
        res.status(404).send('Task not found');
    }
});

module.exports = router;

```

### 2.3. Implement in-memory storage for tasks and handle the CRUD operations using routes.
For the in-memory storage I have declared an empty array `let tasks = [];`  this in-memory storage will last until the `memory is refreshed` or `Server is restarted`.

## Section 3: Multiple File Uploading
### 3.1. Create an API endpoint to handle file uploads. The endpoint should accept multiple files in a single request.

To handle file uploads the most popular library is `multer`. To install the package: 

```
npm i multer
```

File System library `fs` is a built in nodejs library and will be required to access and create the directory where the files will be uploaded.
I will create an `uploads` directory in the root of the project, this is where the files will be store when uploaded.

The implementation can be seen in `routers/uploads.js`:
```
const Router = require('express').Router;
const router = Router();
const multer = require('multer');
const path = require('path');

const fs = require('fs').promises;
try {
    fs.mkdir('./uploads/', { recursive: true }); // Create uploads dir if it doesn't exist
  } catch (err) {
    console.error('Error creating uploads directory:', err);
    // Handle directory creation error appropriately (e.g., return an error response)
  }
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
router.post('/new', upload.array('files'), async(req, res) => {
    const files = req.files.map(file => ({
        filename: file.filename,
        size: file.size
    }));
    res.status(201).json({ files });
});

module.exports = router
```

for multiple uploads, `upload.array('files')` acts as a `middleware` to catch multiple files in `request`.

### 3.2. Explain how you would handle file storage and organization on the server.
files are stored in the `./uploads/` directory in th root of the project files on the server.
We can change the destination folder in the server by editing `fs.mkdir()` argument and `destination` function in `multer.diskStorage` function. 

### 3.3. Provide an example of a request using a tool like curl to upload multiple files to your API.

```
curl -X POST http://localhost:3000/upload/new -F "files=@/home/tannerb/Downloads/Resume.pdf" -F "files=@/home/tannerb/Downloads/Logo_Colour.png"

```
An example on how to test it out using `curl`. The value `files=@{file_path}` is important else you'll be running into curl error stating misuse of flag `-F`.
The url endpoint: `http://localhost:3000/upload/new` should be used to make the request. 

```
curl -X POST http://localhost:3000/upload/new -F "files=@<path_to_file>" -F "files=@<path_to_file>" -F "files=@<path_to_file>" -F "files=@<path_to_file>" ...

```

## Section 4: Authentication
### 4.1. Implement user authentication using a library of your choice (e.g., Passport.js, jsonwebtoken).

Passport js is used for Authentication 
```
npm i passport passport-local
```
Mongoose is installed using `npm i mongoose`
Create a mongoose model of user:
```
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: { type: String, required: true},
    role: { type: String, required: true},
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
});
const user = mongoose.model('users', userSchema);


module.exports = user;
```

I set up a free tier MongoDB Atlas database cluster, created users to access and whitelisted IP's so I can connect to Database from anywhere (only server IP is recommended).

Connected the backend using the Mongoose Driver code in `index.js`:
```
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    app.listen(port,() => {
        console.log('Server is up on port '+ port)
    })
  } catch {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

```

The Passport config is set in `controllers/authController.js`

### 4.2. Create a registration endpoint that allows users to sign up with a username and password.

Endpoints are set in `routers/registrationRoutes.js` and `routers/loginRoutes.js` for `sign-up` and `log-in` respectively. Which will allow the user to login and sign-up using `username`, `password` and `role`.

The specifics of Endpoints are explained later below

### 4.3. Implement login functionality using JSON Web Tokens (JWT).
In `controllers/loginController.js`, the use of JWT is implemented. 
Installed JWT using `npm i jsonwebtoken`.

### 4.4. Describe how you would securely store user passwords in a database.
To store passwords securely in a database,I will ecrypt the pasword using the library `bcryptjs`.
Installed using `npm i bcryptjs`
In `controllers/registrationController.js`, I have demonstrated how I encrypted password before storing a new user in the database.

### 4.5. Provide a sample API request that demonstrates the user registration and login process.

User registration:
```
curl -X POST -H "Content-Type: application/json" -d '{"username":"user2", "password":"password123","role": "user"}' http://localhost:3000/auth/register

```

The endpoint is the same as mentioned above, I have included `role` parameter in the body of request for Authorization purpose.

User Login:
```
curl -X POST -H "Content-Type: application/json" -d '{"username":"user2", "password":"password123"}' http://localhost:3000/auth/login

```

A token is received on a successful request for login:
```
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYzMDFkOTMyNzcwNzk4NzA4NzE5NTciLCJpYXQiOjE3MTA0Mzg3OTUsImV4cCI6MTcxMDQ0MjM5NX0.yR5pUHP6SiVWvCq4HjPZxE-84JTnIVIZhCHJJCmz4bI"}
```

## Section 5: Authorization
### 5.1. Define the concept of authorization in the context of a Node.js application.
Authorization in the context of a Node.js application refers to the process of determining whether a user or a client has the necessary permissions to access certain resources or perform specific actions within the application. It involves verifying the identity of the user (authentication) and then determining what actions they are allowed to perform (authorization) based on their role, privileges, or other attributes.

### 5.2. Implement role-based authorization for your &quot;Task&quot; entity, allowing only authenticated users to create and update tasks while restricting the deletion of tasks to administrators.
For this, I have created `middleware/isAuthenticated.js` 

```
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');

const isAuthorized = (roles) => async (req, res, next) => {
  try {
    // ExtractJWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.SECRET);
    
    // Find the user in the database based on the decoded user ID
    const user = await User.findById(decoded.userId);

    // Check if the user exists and has one of the specified roles
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // If user is authorized, set user in request object and proceed
    req.user = user;
    next();
  } catch (error) {
    // If token is invalid or not provided, return 401 Unauthorized
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { isAuthorized };

```
This middleware function accepts an Argument `roles` which is an array of `role` in `string`. I can now apply this middleware on the routes required with required `role` value. 

In `routers/tasks.js`, I have implemented the same, for `delete tasks` router there is only one parameter to the middleware function that is `admin`. Which allow only admin to delete and similarly a user and admin can create and update the tasks

### 5.3. Provide an example of how you would check and enforce authorization in your routes.

Create a task:
```
curl --location 'http://localhost:3000/tasks/new' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYzMDFkOTMyNzcwNzk4NzA4NzE5NTciLCJpYXQiOjE3MTA0MjQ2NTgsImV4cCI6MTcxMDQyODI1OH0.RkLMygrVTwAOfpHVPAVi6hyvI0orXZYtkKkoh11TMLk' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Test0003",
    "description": "test description 0003"
}'
```

Delete a task:
Only user with role: `admin` can delete else a `Forbidden` message will be returned
```
curl --location --request DELETE 'http://localhost:3000/tasks/1' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYzMDFkOTMyNzcwNzk4NzA4NzE5NTciLCJpYXQiOjE3MTA0MjQ2NTgsImV4cCI6MTcxMDQyODI1OH0.RkLMygrVTwAOfpHVPAVi6hyvI0orXZYtkKkoh11TMLk'
```

Update a task:
```
curl --location --request PUT 'http://localhost:3000/tasks/1' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYzMDFkOTMyNzcwNzk4NzA4NzE5NTciLCJpYXQiOjE3MTA0MjQ2NTgsImV4cCI6MTcxMDQyODI1OH0.RkLMygrVTwAOfpHVPAVi6hyvI0orXZYtkKkoh11TMLk' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Test0001",
    "description": "test description 0001"
}'
```

## Section 6: Bonus Task
### 6.1. Implement user authentication using a different library or method than the one you used in Section 4. Compare and contrast the two approaches, highlighting their advantages and disadvantages.

Visit [here](https://github.com/Omkarc284/dermiaBackend/blob/main/src/router/adminauth.js)

A test project where i havent used any library but just jwt and bcrypt and manually did login and logout.

I had to write the function of authenication and token handling and did all the hassles which `Passport js` took care of. I had to create a token field in the User Schema to store and retrieve the tokens.

#### Pros of Passport js:
- Passport.js provides a comprehensive authentication middleware system with support for various authentication strategies (local, OAuth, etc.).
- JWT tokens are stateless and can be easily transmitted over HTTP headers, making them suitable for RESTful APIs.
- Passport.js offers a large ecosystem of plugins and strategies for handling authentication needs.

#### Cons:
- Passport.js can be complex to set up and configure for beginners, especially when using multiple strategies.
- JWT tokens, if not handled properly, can lead to security vulnerabilities such as token theft and unauthorized access.

#### Pros of bcrypt and jwt:

- bcrypt provides a simple and secure method for hashing passwords, ensuring that passwords are securely stored in the database.
- Password hashing with bcrypt is computationally expensive, making it resistant to brute-force attacks.
#### Cons of not using libraries like Passport:
 
- bcrypt only handles password hashing and authentication; additional libraries or mechanisms are needed for other authentication requirements such as session management and token-based authentication.
- Compared to JWT, bcrypt does not provide built-in support for stateless authentication or token-based authentication, which may be more suitable for certain use cases such as single-page applications (SPAs) or microservices architectures.

Passport.js with JWT is suitable for applications requiring a comprehensive authentication system with support for various authentication strategies, while bcrypt is a simple and effective choice for password hashing and authentication in traditional web applications.

## Section 7: Conclusion
### 7.1. Summarize the key takeaways and challenges you encountered while completing this technical test paper.
#### Key Takeaways:
- `Understanding of Node.js Fundamentals`: This technical test provided an opportunity to delve into fundamental concepts of Node.js, including asynchronous programming, middleware usage, and authentication mechanisms.
- `Hands-on Experience with Libraries`: Implementing features like CRUD operations, authentication, and authorization allowed for practical exploration of various libraries such as Express, Passport.js, and JWT.
- `Problem-solving and Debugging Skills`: Addressing issues like callback hell and ensuring secure password storage enhanced problem-solving and debugging abilities.

#### Challenges:
- `Authentication Integration`: Integrating user authentication with Passport.js and JWT, while effective, required meticulous configuration to ensure seamless functionality.
- `Error Handling and Validation`: Implementing robust error handling and input validation mechanisms posed challenges to ensure application reliability and security.
- `Middleware Management`: Organizing middleware functions and understanding their execution order was crucial for proper request handling, presenting a challenge in maintaining code clarity.

### 7.2. Provide any additional comments or suggestions for improving the Node.js application you&#39;ve developed during this test.

- Enhanced Error Handling: Implement more robust error handling mechanisms throughout the application to provide informative error messages and improve overall user experience.
- Security Audits: Conduct security audits periodically to identify and address potential vulnerabilities and ensure compliance with industry security standards.
- Tasks can be moved to Database
- Logging and Monitoring: Integrate logging and monitoring tools to track application activities, monitor performance, and identify potential issues or security threats.
- Authentication can be improved
- Proper Schema can be designed as per the real life use case basis
- Can be more use-case specific.
-Input Validation: Augment input validation by utilizing validation libraries like express-validator to ensure data integrity and prevent security vulnerabilities.

## Conclusion:
Completing this technical test provided valuable insights into building robust and secure Node.js applications. It highlighted the importance of understanding core concepts, selecting appropriate libraries, and implementing best practices to develop efficient and maintainable software solutions.
