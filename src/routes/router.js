import express, {json} from 'express';
import fs from 'fs';
import { fileURLToPath } from "url";
import path  from "path";
import io from "../app.js"

// путь к директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

let users = JSON.parse(fs.readFileSync(path.join(__dirname, "../storage/users.json"), "utf8"));
let messages = JSON.parse(fs.readFileSync(path.join(__dirname, "../storage/messages.json"), "utf8"));




router.get('/api/users', (req, res) => {
   res.json(users);
});

router.get('/api/news', (req, res) => {
   res.json(messages);
});

router.put('/api/users/:id', (req, res) => {
   const id = req.params.id;
   const updatedUser = req.body;
   let userIndex = users.findIndex(u => u.id === parseInt(id));
   if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      fs.writeFileSync(path.join(__dirname, "../storage/users.json"), JSON.stringify(users, null, 2), err => {
         if (err) {
            console.log(err);
         }
      });

      res.json({ message: "Данные обновлены" });
   } else {
      res.status(404).json( { message : "Пользователь не найден" });
   }
})

router.put('/api/users/:id', (req, res) => {
   const id = req.params.id;
   const user = req.body;
   let userIndex = users.findIndex(u => u.id === parseInt(id));
   if (userIndex !== -1) {
      users[userIndex] = user;
      fs.writeFileSync(path.join(__dirname, "../storage/users.json"), JSON.stringify(users, null, 2), err => {
         if (err) {
            console.log(err);
         }
      });

      res.json({ message: "Друг удален" });
   } else{
      res.status(404).json( { message : "Пользователь не найден" });
   }
});

router.post('/api/users', (req, res) => {
   const newUser = req.body;
   const lastUser = users.at(-1);
   newUser.id = lastUser.id + 1;
   newUser.role = 'user';
   newUser.status = 'active';
   users.push(newUser);

   fs.writeFileSync(path.join(__dirname, "../storage/users.json"), JSON.stringify(users, null, 2), err => {
      if (err) {
         console.log(err);
      }
   });

   res.json({ msg: "Пользователь добавлен" });
});

router.post('/api/news', (req, res) => {
   const newMessage = req.body;
   // получаем последнее сообщение для корректного id
   const lastMessage = messages.at(-1);
   newMessage.id = lastMessage.id + 1;

   messages.push(newMessage);

   fs.writeFileSync(path.join(__dirname, "../storage/messages.json"), JSON.stringify(messages, null, 2), err => {
      if (err) {
         console.log(err);
      }
   });

   io.emit("newsUpdated", messages);
   res.json({ msg: "Новость добавлена "});
});




// страница по умолчанию
router.get("/", (req, res) => {
   res.render("main");
});

// главная страница
router.get("/users", (req, res) => {
   res.render("users", {users: users})
});

// post на исменение роли
router.post("/users/updateUserRole/:id", (req, res) => {
   const userId = req.params.id;
   const { role } = req.body;
   const user = users.find(user => user.id === parseInt(userId));

   if (user) {
      user.role = role;
      fs.writeFileSync(path.join(__dirname, "../storage/users.json"), JSON.stringify(users, null, 2), err => {
         if (err) {
            console.log(err);
         }
      });

      // отправляем уведомление через webSocket
      io.emit('userUpdated', {user_id: parseInt(userId), newRole: role});

      res.status(200).send({ message: "Роль пользователя обновлена успешно." });
   } else {
      res.status(404).send({ message: "Пользователь не найден." });
   }
});

// post на изменение статуса
router.post("/users/updateUserStatus/:id", (req, res) => {
   const userId = req.params.id;
   const { status } = req.body;
   const user = users.find(user => user.id === parseInt(userId));

   if (user) {
      user.status = status;
      fs.writeFileSync(path.join(__dirname, "../storage/users.json"), JSON.stringify(users, null, 2), err => {
         if (err) {
            console.log(err);
         }
      });

      io.emit('userUpdated', {user_id: parseInt(userId), newStatus: status});

      res.status(200).send({ message: "Статус пользователя обновлен успешно."});
   } else {
      res.status(404).send({ message: "Пользователь не найден." });
   }
});

// пост на изменение данных пользователя
router.post("/users/updateUserData/:id", (req, res) => {
   const userId = req.params.id;
   const { name, email, date_of_birth } = req.body;
   const user = users.find(user => user.id === parseInt(userId));
   if (user) {
      if (name) user.name = name;
      if (email) user.email = email;
      if (date_of_birth) user.date_of_birth = date_of_birth;

      fs.writeFileSync(path.join(__dirname, "../storage/users.json"), JSON.stringify(users, null, 2), err => {
         if (err) {
            console.log(err);
         }
      });

      io.emit('userUpdated', {
         user_id: parseInt(userId),
         newName: name || user.name,
         newEmail: email || user.email,
         newDob: date_of_birth || user.date_of_birth
      });

      res.status(200).send({ message: "Данные обновлены" });
   } else {
      res.status(404).send({ message: "Пользователь не найден" });
   }
});

// get на страницу друзей
router.get("/users/friends/:id", (req, res) => {
   const userId = req.params.id;
   const user = users.find(user => user.id === parseInt(userId));
   if (user) {
      const friends = users.filter(u => user.friends.includes(u.id)); // фильтруем пользователей если id юзера есть в списке текущего юзера
      res.render("friends", { users: friends, userName: user.name });
   } else {
      res.status(404).send("Пользователь не найден");
   }
});

// новости друзей пользователя
router.get("/users/news/:id", (req, res) => {
   const userId = req.params.id;
   const user = users.find(user => user.id === parseInt(userId));
   if (user) {
      const friends = users.filter(u => user.friends.includes(u.id));
      res.render("friendNews", { users: friends, userName: user.name });
   } else {
      res.status(404).send("Пользователь не найден");
   }
});

router.get("/users/userNews/:id", (req, res) => {
   const userId = req.params.id;
   const user = users.find(user => user.id === parseInt(userId));
   const msg = messages.filter(msg => msg.user_id === parseInt(userId));

   if (user && msg.length > 0) {
      res.json({ news: msg }); // отправляем json с новостями
   } else if (user && msg.length === 0) {
      res.json({news: [], message: "Пользователь ничего не опубликовал" });
   } else {
      res.status(404).json({ error: "Пользователь не найден." });
   }
});

export default router;