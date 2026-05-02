require('dotenv').config();

module.exports = {
    TOKEN: process.env.TOKEN,
    APP_ID: process.env.APP_ID,
    MONGOURL: process.env.MONGOURL,
    GUILD_ID: process.env.GUILD_ID,
    PREFIX: process.env.PREFIX || "-"
};