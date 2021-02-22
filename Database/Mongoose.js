let mongoose = require('mongoose');
const chalk = require('chalk');
require("dotenv").config({ path: "frontend/.env" })


// This file contains the connection method to connect and save objects to the db
console.log(process.env.MONGODB_CLUSTER_URL);
mongoose.connect(process.env.MONGODB_CLUSTER_URL, { useNewUrlParser: true})
    .then(() => {
      console.log(chalk.green('Successfully connected to cluster...'))
    })
    .catch((error) => {
      console.log(chalk.red('Unable to connect to cluster...'));
    });

