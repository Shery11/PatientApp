
require("./config");

const express = require('express');
const cors = require('cors');

const app = express();

const error = require("./common/error");

require("./common/db");
require("./common/cache");

app.use(cors());


require("./routes/routes")(app);

app.use(error.errorHandler);

//
// response transformer
app.use((req, res) => {
    if (res.statusCode == 200 ) {
        res.send({
            success: true,
            data: res.result
        });
    } else if (res.statusCode >= 400 && res.statusCode <= 499) {
        res.send({
            success: false,
            data: res.result
        });
    }
});

app.listen(__config.port, function () {
    console.log(`platform app listening on port ${__config.port}!`);
});

//
// signal watcher
['SIGINT', 'SIGTERM'].forEach(function(signal){
    process.on(signal, function() {
        console.log(signal);
        process.exit();
    });
});
