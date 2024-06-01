const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

// Sequelize setup
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './linkedin-database.sqlite'
});

const User = sequelize.define('User', {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    followerCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    connectionCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Sync Sequelize models
(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Sequelize database & tables created!');
    } catch (err) {
        console.error('Error syncing Sequelize database:', err.message);
    }
})();

// Express Setup
app.get('/', (req, res) => {
    res.send({ 'message': 'Ok' });
});

// Post API
app.post('/api/user', async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { url, name, bio, about, location, followerCount, connectionCount } = req.body;

        if (!url || !name || followerCount === undefined || connectionCount === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await User.create({ url, name, bio, about, location, followerCount, connectionCount });
        res.json({ message: 'success', data: user });
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
