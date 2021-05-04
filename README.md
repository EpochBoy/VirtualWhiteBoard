
### Foreword

I've taken a strictly backend approach to the task, since I don't feel as comfortable with the frontend. I can do frontend things, but it just ain't pretty.

The stack that we'll be using is Node.js, MongoDB+Mongoose. So you will need to have that installed to get up and running. We will be using Postman to test our API.

Grab the following:
* https://www.mongodb.com/try/download/community
* https://nodejs.org/en/download/
* https://www.postman.com/downloads/
* https://robomongo.org

### Getting Started

I'm assuming you know the below steps, posting it just in case.

1. Navigate to the root folder of the project and run "**npm install**". The entry point for the application is:
   * index.js

    Run "**nodemon ./src/index.js**" to get the server up and running.

2. For MongoDB please check via Google as the process varies depending on your OS.
3. Install "Studio 3T", if you want a GUI for the MongoDB.

#### Postman

In the root folder of the project, you'll find a postman collection file. This is what you'll use to makes requests to the server. It comes prepackaged with all routes and automatically maintains session tokens for you. There is only one little thing that you'll have to do manually, which is setting up an environment in Postman so that the server url works.

1. Create a new environment, call it "Virtual Whiteboard Dev"
2. IN the "VARIABLE" column add, "url". Without the "".
3. Give it an initial value of "localhost:8181". Again without the "".

To get started with the WebServer, you'll need to populate the Database, so start by clicking "Create user..." for both Bertha & Sam, it automatically&dynamically maintains the session for you now. So if you need to switch users to test logic, you can just alternate users by clicking "Login user Bertha/Sam".

### Tasks that weren't completed

#### Login
Self service password wasn't implemented, due to time constraints. If there had been more time I would definitely have looked at how it's done here (https://github.com/ezesundayeze/forgotpassword) and attempted to implement something along those lines into this project.

#### Virtual Board
Berthas anonymous Lunch post. Could've been implemented by having a "showPost: bool", stored on each post which then in the frontend could be used to toggle hide/show when creating a post.

Berthas media rendering . Definitely a frontend task, since i focused on the backend, I didn't spent time on this.

Berthas liking a post. I had a bit of a struggle implementing the comments, so never made it to the likes. Likes would be implemented, much in the same manner though.

#### Role management

Sam being a mod. Didn't have time to implement this, sorry Sam.

Sam wants to add Jennifer. I didn't do this part, but I decided to opt. for self sign-up, so now anyone in the office can sign-up and post to their hearts content. Might actually need a mod now.......

PS: 

I tried to deploy the API to my own server. Argus tunnel wasn't playing nice with nginx, so I to put that on hold and focus on getting things done.

Brgds
Fredrik