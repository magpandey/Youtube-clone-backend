import { connectDataBase } from "./db/index.js";

import { app } from "./app.js";
connectDataBase()
.then(() => {
    app.listen(process.env.PORT||8000,() => {
        console.log("server connected to database successfully")
    })
})
.catch((error) => {
    console.log("Connection to the database failed")
})