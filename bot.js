require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Список запрещенных слов и ссылок
const BAD_WORDS = ["реклама", "подпишись", "скидка", "акция", "казино"];

// Список пользователей, которых не банить (админы)
const EXEMPT_USERS = [525697558]; // ID администраторов

// Обработчик входящих сообщений
bot.on("text", async (ctx) => {
    const messageText = ctx.message.text.toLowerCase();
    const userId = ctx.message.from.id;
    const chatId = ctx.chat.id;

    // Проверяем, содержит ли сообщение запрещенные слова
    if (BAD_WORDS.some((word) => messageText.includes(word))) {
        try {
            // Удаляем сообщение
            await ctx.deleteMessage();
            // await ctx.reply(`Сообщение от @${ctx.message.from.username} удалено за рекламу.`);

            // Блокируем пользователя, если он не в списке исключений
            // if (!EXEMPT_USERS.includes(userId)) {
            //     await ctx.telegram.banChatMember(chatId, userId);
            //     await ctx.reply(`Пользователь @${ctx.message.from.username} заблокирован.`);
            // }
        } catch (error) {
            console.error("Ошибка при удалении сообщения или бане:", error);
        }
    }
});

// Запуск бота
bot.launch();
console.log("🚀 Бот запущен!");
