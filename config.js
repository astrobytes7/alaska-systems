require('dotenv').config();

module.exports = {
    TOKEN: process.env.TOKEN,
    APP_ID: process.env.APP_ID,
    MONGOURL: "mongodb+srv://notastrobytes_db_user:king@alaska.lyqfdw2.mongodb.net/",
    DOCK_API: "hCD0GAZoJD8v.96d2Es.YOEFN7BbYui2VGzJj7clD5LmarIm",
    GROK_API: process.env.GROK_API,
    GUILD_ID: process.env.GUILD_ID,
    PREFIX: process.env.PREFIX || "-",
    DOMAIN: process.env.DOMAIN || "https://alaska.noteshan.xyz",
    DISABLE_AI: process.env.DISABLE_AI === 'true'
};