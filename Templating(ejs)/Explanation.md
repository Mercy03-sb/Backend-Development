# Using Ejs

#### Example:

```js
const express = require("express");
const app = express();
const port = 8080;

app.set("view engine", "ejs");
```

`app.set()` has to be used for using ejs and rendering ejs pages. _Caution_ the created ejs tempelates should be stored in a folder named `views` as express will automatically search for ejs files in views folder when rendered.

## Rendering page on request

#### Example:

```js
const express = require("express");
const app = express();
const path = require("path");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); // Setting path of views to dirname

// Render karne waali file 'views' naam ke folder mein hi hona chahiye
// As express views naam ke folder mein file dhundega

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(port, () => {
  console.log(`Setting up server at ${port}`);
});
```

- For sending files as a response we will use `res.render()` with file name which is in views folder.
- `path` is used to set the path of views folder to its correct path, it is useful when server is started from a folder in which views folder does not exist. This allows us to do that as well.

## Passing data to Ejs:

Used when data is fetched from the `database` and has to be displayed in ejs as normally data is fetched to our index.js which has to rendered on the page.

#### Example:

```js
app.get("/rolldice", (req, res) => {
  let diceValue = Math.floor(Math.random() * 6) + 1;
  res.render("rolldice.ejs", { num: diceValue });
});
```

value can be accessed by using `key` passed and `tags` of ejs.

```ejs
<h1>Dice gave value : <%= num %></h1>
```

## Interpolation Syntax

Similar to tempelate literals for strings. It has some tags which are used for different purpose.

- `<%=   %>` - Evaluates the value of the text written in it and converts it into a string.
- `<%  %>` - Used in the case of conditional statements(if-else, loops). It shows no output.

#### Example:

```ejs
<!-- if-else -->
<% if (user) { %>
    <h2>Hello, <%= user.name %>!</h2>
<% } else { %>
    <h2>Welcome, Guest!</h2>
<% } %>

<!-- loops -->
<% for(let name of followers) { %>
<li> <%= name %> <li>
<!-- have to create name a variable using tags -->
<% } %>
```

- `<%-  %>` - outputs the code in html format. Used in `include process`

## Includes

Including a particular part of an html code in ejs. Part(ejs file) should be in a folder named `includes`.

```ejs
<%- include("includes/head.ejs") %>
  <body>
    <h1>No such account exists</h1>
    </body>
</html>
```

includes folder contains the head.ejs file which contains the code. Used in the case of repitition of code.

## Serving Static Files

```js
app.use(express.static(path.join(__dirname, "public")));
```

With this command files in the folder named `public` are served directly to the ejs files. No need to specify public in path. Commonly we have two folders in public- css & js which have files to be included in the ejs.

#### Example: public file containing css and js folders containing respective files.

```js
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
```

```html
<link rel="stylesheet" href="/style.css" />
<script src="/app.js"></script>
```

Just add a `/` in href or src. It is very helpful as we can integrate DOM js file and node js or backend.
