import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import {allure} from "allure-mocha/runtime";

describe('Удаление случайного кота', async() => {

    const allcats = await CoreApi.getAllCats();
    allure.logStep('Выполнен запрос GET / cats/all');

    before('Проверка, что коты есть', async() => {
        assert.ok(allcats.status === 200);
    });

    const randomcat = allcats.data.groups[0].cats[0];
    allure.logStep(`Случайным образом выбрали кота с id: ${randomcat.id}`)
    /* before('Поиск случайного кота', async() => {
         const allcats = await CoreApi.getAllCats();
         //assert.fail
         assert.ok(allcats.status === 200);
         const randomcat = allcats.data.groups[0].cats[0];
     });
     */


    it('Удаление найденного кота', async() => {
        const catremove_response = await CoreApi.removeCat(randomcat.id);
        allure.logStep(`Выполнен запрос DELETE / cats/{catid}/remove с параметром catid: ${randomcat.id}`)
        assert.ok(catremove_response.status === 200);
        console.log(catremove_response);
    });

    after('Проверка, что найденного кота больше нет', async() => {
        const assert_removal = await CoreApi.getCatById(randomcat.id)
        allure.logStep(`Выполнен запрос GET / get-by-id с параметром id: ${randomcat.id}`);
        assert.ok(assert_removal.status === 404)
        console.log(assert_removal);
    });

});