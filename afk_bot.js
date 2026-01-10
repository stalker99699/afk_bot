const mineflayer = require('mineflayer');
const { spawn } = require('child_process');
const path = require('path');

// Конфигурация
const config = {
  host: 'localhost',
  port: 25565,
  username: 'AFK_Bot',
  version: '1.20.1',
  auth: 'offline',
  
  // Настройки приветственного сообщения
  welcomeMessage: 'Привет, я AFK бот!',
  messageRepeatCount: 3,
  messageInterval: 2000,
  
  // Настройки переподключения
  maxReconnectAttempts: 5,
  minReconnectDelay: 1000,
  maxReconnectDelay: 10000
};

// Глобальные переменные
let reconnectAttempts = 0;
let bot = null;
let isBadState = false;

// Функция создания бота
function createBot() {
  console.log('Бот запускается...');
  
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    auth: config.auth
  });

  bot.on('login', () => {
    console.log('Подключён к серверу');
    isBadState = false;
    reconnectAttempts = 0;
    
    let messageCount = 0;
    const messageInterval = setInterval(() => {
      bot.chat(config.welcomeMessage);
      messageCount++;
      
      if (messageCount >= config.messageRepeatCount) {
        clearInterval(messageInterval);
        console.log('Приветственные сообщения отправлены');
      }
    }, config.messageInterval);
  });

  bot.on('error', (error) => {
    console.log('Ошибка:', error);
  });

  bot.on('kicked', (reason) => {
    console.log('Бот был кикнут:', reason);
    handleDisconnect();
  });

  bot.on('end', () => {
    console.log('Соединение разорвано');
    handleDisconnect();
  });

  bot.on('spawn', () => {
    console.log('Бот заспавнился в мире');
  });

  bot.on('death', () => {
    console.log('Бот умер');
  });
}

// Функция реального перезапуска кода
function restartCode() {
  console.log('='.repeat(50));
  console.log('РЕАЛЬНЫЙ ПЕРЕЗАПУСК КОДА...');
  console.log('='.repeat(50));
  
  // Получаем путь к текущему файлу
  const scriptPath = process.argv[1];
  
  // Запускаем новый процесс
  const child = spawn(process.argv[0], [scriptPath], {
    detached: true,
    stdio: 'inherit'
  });
  
  // Отсоединяем дочерний процесс
  child.unref();
  
  // Завершаем текущий процесс
  process.exit(0);
}

// Функция обработки отключения
function handleDisconnect() {
  reconnectAttempts++;
  console.log(`Попытка переподключения №${reconnectAttempts}`);
  
  if (reconnectAttempts > config.maxReconnectAttempts) {
    isBadState = true;
    console.log('СОСТОЯНИЕ: ПЛОХО - превышен лимит попыток переподключения');
    
    // Запускаем реальный перезапуск с задержкой
    setTimeout(restartCode, 2000);
    return;
  }
  
  const delay = Math.floor(Math.random() * 
    (config.maxReconnectDelay - config.minReconnectDelay + 1)) + 
    config.minReconnectDelay;
  
  console.log(`Переподключение через ${delay / 1000} секунд...`);
  
  setTimeout(() => {
    createBot();
  }, delay);
}

// Функция безопасного завершения
function gracefulShutdown() {
  console.log('Завершение работы...');
  if (bot) {
    bot.quit();
  }
  process.exit(0);
}

// Обработка сигналов
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('Необработанное исключение:', error);
  setTimeout(restartCode, 3000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Необработанный промис:', reason);
});

// Запускаем бота
console.log('='.repeat(50));
console.log('Бот только что запустился');
console.log('='.repeat(50));

createBot();
