import { assert } from 'chai';
import { allure } from 'allure-mocha/runtime';
import CoreApi from '../src/http/CoreApi';
import LikeApi from "../src/http/LikeApi";

const likes = 4;
const dislikes = 3;
const getRandomInt = (max: number) => Math.floor(Math.random() * max);

describe('Проверка функционала лайков/дизлайков', async() => {

    let response;
    let random_cat;
    let cat_likes, cat_dislikes;

    beforeEach('Поиск случайного кота из библиотеки имён', async () => {
        await allure.step('Выбор кота', async() => {
            const all_cats = await CoreApi.getAllCats();
            assert.ok(all_cats.status === 200, 'Невозможно обратиться к библиотеке котов!');
            console.info('Нашли всех котов');
            const random_group = getRandomInt(all_cats.data.groups.length);
            const random_cats = getRandomInt(all_cats.data.groups[random_group].cats.length);
            random_cat = all_cats.data.groups[random_group].cats[random_cats];
            allure.attachment('Случайный кот', JSON.stringify(random_cat, null, 2), 'application/json');
            console.info(`Выбрали случайным образом кота по имени ${random_cat.name} (id: ${random_cat.id})`);
        });
    });

    describe('Проверка функционала лайков', async() => {
         it('Добавление лайков',  async() => {
          await  allure.step(`Добавление ${likes} лайков`, async() => {
                //console.log(random_cat);
                cat_likes = random_cat.likes;
                console.info(`Исходное кол-во лайков - ${cat_likes}`);
                console.info(`Кол-во лайков для добавления - ${likes}`);
                for (let i = 1; i<=likes; i++) {
                    response = await LikeApi.likes(random_cat.id, {like: true, dislike: false});
                }
                assert.equal(response.data.likes, cat_likes+likes, 'Кол-во лайков не совпадает!');
                allure.attachment('Кол-во лайков изначальное', JSON.stringify(random_cat.likes, null, 2), 'application/json');
                allure.attachment('Кол-во лайков после добавления', JSON.stringify(response.data.likes, null, 2), 'application/json');
                console.info(`Вызвали метод POST /cats/{catid}/likes с id: ${random_cat.id}, {like:true, dislike:false} ${likes}раз`);
                console.info(`Кол-во лайков после добавления - ${response.data.likes}`);
            });
        });
        after('Возвращение исходного количества лайков', async() => {
            await allure.step('Возвращение исходного количества лайков', async() => {
                for (let i = 1; i<=likes; i++) {
                    response = await LikeApi.likes(random_cat.id, {like: false, dislike: true});
                }
                //console.log(response.data);
                assert.equal(response.data.likes, cat_likes, 'Исходное кол-во лайков не восстановилось!');
                //allure.attachment('Кол-во лайков изначальное', JSON.stringify(random_cat.likes, null, 2), 'application/json');
                allure.attachment('Кол-во лайков после восстановления', JSON.stringify(response.data.likes, null, 2), 'application/json');
                console.info(`Восстановили исходное кол-во лайков - вызвали метод POST /.../likes c id: ${random_cat.id}, {like:false, dislike:true} ${likes}раз`);
                console.info(`Кол-во лайков после восстановления - ${response.data.likes}`);
            });
        });
    });

    describe('Проверка функционала дизлайков', async() => {
         it('Добавление дизлайков', async() => {
            cat_dislikes = random_cat.dislikes;
            console.info(`Исходное кол-во дизлайков -  ${cat_dislikes}`);
            console.info(`Кол-во дизлайков для добавления - ${dislikes}`);

           await allure.step(`Добавление ${dislikes} дизлайков`, async() => {
                for (let i = 1; i<=dislikes; i++) {
                    response = await LikeApi.likes(random_cat.id, {like: false, dislike: true});
                }
                assert.equal(response.data.dislikes, cat_dislikes+dislikes, 'Кол-во дизлайков не совпадает!');
                allure.attachment('Кол-во дизлайков изначальное', JSON.stringify(random_cat.dislikes, null, 2), 'application/json');
                allure.attachment('Кол-во дизлайков после добавления', JSON.stringify(response.data.dislikes, null, 2), 'application/json');
                console.info(`Вызвали метод POST /cats/{catid}/likes с id: ${random_cat.id}, {like:false, dislike:true} ${dislikes}раз`);
                console.info(`Кол-во дизлайков после добавления - ${response.data.dislikes}`);
            });
        });
        after('Возвращение исходного количества дизлайков', async() => {
            await allure.step('Возвращение исходного количества дизлайков', async() => {
                for (let i = 1; i<=dislikes; i++) {
                    response = await LikeApi.likes(random_cat.id, {like: true, dislike: false});
                }
                assert.equal(response.data.dislikes, cat_dislikes, 'Исходное кол-во дизлайков не восстановилось!');
                //allure.attachment('Кол-во дизлайков изначальное', JSON.stringify(random_cat.dislikes, null, 2), 'application/json');
                allure.attachment('Кол-во дизлайков после восстановления', JSON.stringify(response.data.dislikes, null, 2), 'application/json');
                console.info(`Восстановили исходное кол-во дизлайков - вызвали метод POST /.../likes c id: ${random_cat.id}, {like:true, dislike:false} ${dislikes}раз`);
                console.info(`Кол-во дизлайков после восстановления ${response.data.dislikes}`);
            });
        });
    });
});