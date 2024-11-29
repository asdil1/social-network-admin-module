import {afterAll, describe, expect, it} from '@jest/globals';
import request from 'supertest'
import {app, server} from '../src/app.js';

describe('POST /users/updateUserRole/:id', () => {
    afterAll(() => {
        server.close();
    });

    it('должен обновить пользователя', async () => {
        const res = await request(app).post('/users/updateUserRole/1').send({ role: 'admin' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Роль пользователя обновлена успешно." })
    });

    it('должен вернуть ошибку, если пользователь не найден', async () => {
        const res = await request(app).post('/users/updateUserRole/999').send({ role: 'admin' });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Пользователь не найден." })
    })
});

describe('POST /users/updateUserStatus/:id', () => {
    afterAll(() => {
        server.close();
    });

    it('должен обновить статус', async () => {
        const res = await request(app).post('/users/updateUserStatus/1').send({ status: 'active' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Статус пользователя обновлен успешно."})
    });

    it('должен вернуть ошибку, если пользователь не найден', async () => {
        const res = await request(app).post('/users/updateUserStatus/999').send({ status: 'admin' });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Пользователь не найден." })
    });
});

describe('POST /users/updateUserData/:id', () => {
    afterAll(() => {
        server.close();
    });

    it('должен обновить имя', async () => {
        const res = await request(app).post('/users/updateUserData/1').send({ name: 'john' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Данные обновлены" });
    });

    it('должен обновить имя', async () => {
        const res = await request(app).post('/users/updateUserData/1').send({ name: 'John Doe' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Данные обновлены" });
    });

    it('должен вернуть ошибку, если пользователь не найден', async () => {
        const res = await request(app).post('/users/updateUserData/999').send({ name: 'admin' });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Пользователь не найден" })
    });
});

describe('GET /api/users', () => {
    afterAll(() => {
        server.close();
    });

    it('должен вернуть всех пользователей, проверка на первом', async () => {
        const res = await request(app).get('/api/users');

        expect(res.status).toBe(200);
        expect(res.body[0]).toEqual({
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "date_of_birth": "1990-05-12",
            "role": "admin",
            "status": "active",
            "friends": [
                2,
                3,
                7
            ]
        });
    });
});