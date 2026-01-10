const mineflayer = require('mineflayer');
const bot = mineflayer.createBot({
  host: 'localhost',#ip
  port: 25565,#port
  username: 'AFK_Bot',#имя
  version: '1.20.1',#версия
  auth: 'offline' #microsoft не надо ставить
});

bot.on('login', () => console.log('Подключён'));
bot.on('error', console.log);
bot.on('end', () => console.log('Отключён'));
