const { Telegraf, Markup } = require('telegraf');
const { runScraping } = require('./scraping/scraping');
const { addNewProduct } = require('./addNewProduct');
require('dotenv').config()

const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) => ctx.reply(`Welcome, ${ctx.update.message.from.first_name}! \nI can send notifications about discounts just send me the link to some product in the online shop 😉`),
    Markup.keyboard([
            ['➕ Добавить новый товар'],
            ['☸ Setting', '📞 Feedback'],
            ['⭐️Rate us', '👥 Share']
        ])
        .oneTime()
        .resize()

    )
bot.help((ctx) => ctx.reply('Just send me a link for some products from site https://www.6pm.com/'))

const sendMessage = (chatId, message) => bot.telegram.sendMessage(chatId, message);

runScraping(sendMessage);

const regexLink = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm)
bot.hears(regexLink, (ctx) => {
    const link = ctx.update.message.text;
    const userId = ctx.update.message.from.id;
    addNewProduct({link, userId} , sendMessage);
});
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log('bot running...')