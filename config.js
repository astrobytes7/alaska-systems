require('dotenv').config();

module.exports = {
    TOKEN: process.env.TOKEN,
    APP_ID: process.env.APP_ID,
    MONGOURL: "mongodb+srv://notastrobytes_db_user:king@alaska.cmwj2aw.mongodb.net/",
    GUILD_ID: process.env.GUILD_ID,
    PREFIX: process.env.PREFIX || "-"
};