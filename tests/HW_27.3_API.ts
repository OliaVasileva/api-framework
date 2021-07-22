import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

describe('Проверка удаления котов', async() => {

    it('Удаление любого случайного кота', async() => {
        const allcats = await CoreApi.getAllCats();

        allure.step('Выполнен запрос GET / cats/all (Нашли всех котов)',  () => {
            assert.ok(allcats.status === 200);
            console.info('Нашли всех котов');
        });

        const random_group = getRandomInt(allcats.data.groups.length);
        const random_cats = getRandomInt(allcats.data.groups[random_group].cats.length);
        const randomcat = allcats.data.groups[random_group].cats[random_cats];

        allure.step('Случайным образом выбрали кота из общего списка', async() => {
            allure.attachment('Случайный кот', JSON.stringify(randomcat, null, 2), 'application/json');
            console.info(`Выбрали из них кота ${randomcat.name} (id: ${randomcat.id})`);
        });

        const catremove_response = await CoreApi.removeCat(randomcat.id);

        allure.step(`Выполнен запрос DELETE / cats/{catid}/remove с параметром catid: ${randomcat.id} (Удалили кота)`, async() => {
            allure.attachment('Удаленный кот', JSON.stringify(catremove_response.data, null, 2), 'application/json');
            assert.ok(catremove_response.status === 200);
            assert.equal(catremove_response.data.name, randomcat.name, 'Имена не совпадают!');
            console.info(`Удалили кота с id ${randomcat.id}`);
        });

        const check_removal = await CoreApi.getCatById(randomcat.id);

        allure.step(`Выполнен запрос GET / get-by-id с параметром id: ${randomcat.id} (Проверили, что кота нет)`, async() => {
            assert.ok(check_removal.status === 404);
            allure.attachment('Ответ сервера', JSON.stringify(check_removal.data, null, 2), 'application/json');
            console.info(`Проверили, что найденного кота больше нет - запрос /get-by-id с id ${randomcat.id} вернул ответ: ${check_removal.status} ${check_removal.statusText}`);
        });
    });
});