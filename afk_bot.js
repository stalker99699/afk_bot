const mineflayer = require('mineflayer');
const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'AFK_Bot',
  version: '1.20.1',
  auth: 'offline' #microsoft не надо ставить
});

bot.on('login', () => console.log('Подключён'));
bot.on('error', console.log);
bot.on('end', () => console.log('Отключён'));
