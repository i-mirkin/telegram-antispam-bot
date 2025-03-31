require("dotenv").config();
const express = require("express");
const { Telegraf } = require("telegraf");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Создаем бота
const bot = new Telegraf(process.env.BOT_TOKEN);

// Антиспам-фильтр
// const BAD_WORDS = ["реклама", "подпишись", "скидка", "акция", "казино", "каз1но", "к@зино", "ka3ino", "kазино", "k@zino"];
const BAD_WORDS = fs.readFileSync("bad_words.txt", "utf-8").split("\n").map(word => word.trim());
const EXEMPT_USERS = [525697558, 1931616, 2830900]; // ID администраторов
const ALLOWED_USERS = ["denkangin", "medic_yt"];

bot.on("text", async (ctx) => {
    const messageText = ctx.message.text.toLowerCase();
    const userId = ctx.message.from.id;
    const chatId = ctx.chat.id;
    const username = ctx.message.from.username ? ctx.message.from.username.toLowerCase() : "";

    // Если пользователь админ, он может писать что угодно
    // const chatAdmins = await ctx.getChatAdministrators();
    // const adminIds = chatAdmins.map(admin => admin.user.id.toString());
    // if (adminIds.includes(userId.toString()) || EXEMPT_USERS.includes(userId.toString())) {
    //     return;
    // }

    if (ALLOWED_USERS.includes(username)) {
        return;
    }

    if (EXEMPT_USERS.includes(userId)) { // from file add .toString
        return;
    }



    if (BAD_WORDS.some((word) => messageText.includes(word))) {
        try {
            await ctx.deleteMessage();
            // await ctx.reply(`Сообщение от @${ctx.message.from.username} удалено за рекламу.`);

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

// Создаем простой HTTP-сервер для Timeweb
app.get("/", (req, res) => {
    res.send("🚀 Telegram бот работает!");
});

// Добавляем эндпоинт для проверки работоспособности
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`🌍 Сервер запущен на порту ${PORT}`);
});