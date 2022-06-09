const express = require("express");
const fs = require("fs");
const app = express();
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

async function getDBConnection(){
    const db = await sqlite.open({
        filename: "test.db",
        driver: sqlite3.Database
    });
    return db;
}

/* app.get('/', async function(req, res){

    let db = await getDBConnection();
    await db.run(`insert into images(image_name, image_path) values ('js_1.jpg', './images/')`);
    let rows = await db.all('select * from images');
    await db.close();
    myimage_info = '';
    for (var i=0; i < rows.length; i++) {
        myimage_info += 'image_id: '+rows[i]['image_id']+', image_name: '+rows[i]['image_name'] + ', image_path: '+rows[i]['image_path'] + '<br>';
    }

    console.log(myimage_info)
    var output =
    `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
        </head>
        <body>
            ${myimage_info}
        </body>
    </html>
    `;
    res.send(output)
}); */



app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


var port = 3000;

app.listen(port, function(){
    console.log("Server Initialized.");
    console.log(`Server address: http://localhost:${port}`);
})

app.post("/write-file", function (req, res) {
    console.log(req.body);

    if (!req.body?.content) {
        res.status(400).send("Error 400!");
        return;
    }

    fs.writeFile("test.txt", req.body.content, function (error, data) {
        if (error) {
            res.status(500).send("500 Server Error!");
        } else {
            res.status(201).send("File is created successfuly!");
        }
    });
});

app.get("/read-file", function (req, res) {
    console.log(req.query);

    if (!req.query?.file) {
        res.status(400).send("Error 400!");
        return;
    }

    fs.readFile(req.query.file, "utf-8", async function (error, data)  {
        if (error) {
            if (error.code === "ENOENT") {
                res.status(404).send(`${req.query.file} is absent`);
            } else {
                res.status(500).send("Error 500!");
            }
        } else {
            res.status(200).send(data.toString());
        }
    });
});




