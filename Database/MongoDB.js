const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID; // To create our own MongoDB ids in place


async function get_connection () {

    const connectionURL = process.env.MONGODB_CLUSTER_URL;

    // Connect to the cluster
    await MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {

        if (error) {
            return console.log('Unable to connect to db...');
        }

         // Create db or connect to it
        return client.db('SOEN_341');

    });

}

module.exports = {
    get_connection: get_connection
}
