const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3000;
const url = 'mongodb://localhost:27017/messageBoard';

// const dbName = 'messageBoard';

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('we"re connected!'));

const messageSchema = new mongoose.Schema({
    userName: String,
    msg: String
});

const Message = mongoose.model('Message', messageSchema);

const User = mongoose.model('User', {
    name: String,
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

app.get('/', (req, res) => {
    res.send('hello');
});

app.post('/api/message', async (req, res) => {
    const message = new Message(req.body);
    //console.log(req.body);
    message.save();

    let user = await User.findOne({ name: message.userName })
    if (!user)
        user = new User({ name: message.userName });
    user.messages.push(message);
    user.save();

    // console.log(req.body);
    // db.collection('messages').insertOne(message);
    // const foundUser = await db.collection('users').findOne({name:message.userName});
    // //console.log(foundUser);
    // if(!foundUser) db.collection('users').insertOne({name:message.userName});
    res.status(200).send();
    // res.end();
});

app.get('/api/message', async (req, res) => {
    //const docs = await db.collection('messages').find({}).toArray();

    const docs = await Message.find()

    if (!docs) return res.json({ error: "could not find messages" });

    res.json(docs);
});

app.get('/api/user/:name', async (req, res) => {
    const name = req.params.name;

    const aggregate = await User.aggregate([
        {
            $project: {
                messages: 1, name: 1, isGold: {
                    $gte: [{ $size: "$messages" }, 5]
                }
            }
        }
    ]);

    await User.populate(aggregate, { path: "messages" });
    res.json(aggregate);
    //return res.json(await User.findOne({ name }).populate('messages'));
});


// MongoClient.connect(url, function(err, client) {
//     if(err) return console.log('mongodb error',err);

//     console.log("Connected successfully to server");

//     db = client.db(dbName);


//   });

mongoose.connect(url, { useNewUrlParser: false });

app.listen(port, () => console.log('listnening at port', port));