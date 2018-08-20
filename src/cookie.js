/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

window.onload = table(getCookies());

function getCookies() {
    return document.cookie
        .split('; ')
        .filter(Boolean)
        .map(cookie => cookie.match(/^([^=]+)=(.+)/))
        .reduce((obj, [, name, value]) => {
            obj[name] = value;

            return obj;
        }, {});
}

function table(allCookies = {}) {
    listTable.innerHTML='';
    for (var cookie in allCookies) {
        if (cookie) {
            var chunk = filterNameInput.value;

            if (isMatching(allCookies[cookie], chunk) || isMatching(cookie, chunk)) {
                var tableRow = document.createElement('tr');

                tableRow.className='row';
                listTable.appendChild(tableRow);

                var nameCell = document.createElement('td');

                nameCell.textContent = cookie;
                tableRow.appendChild(nameCell);

                var valueCell = document.createElement('td');

                valueCell.textContent = allCookies[cookie];
                tableRow.appendChild(valueCell);

                var deleteCell = document.createElement('td');
                var deleteButton = document.createElement('button');

                deleteButton.textContent = 'Удалить';
                deleteCell.appendChild(deleteButton);
                tableRow.appendChild(deleteCell);
            }
        }
    }
}

function isMatching(full, chunk) {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0) {
        return true;
    }

    return false;
}

listTable.addEventListener('click', (e)=> {
    var del = e.target;

    if (del.tagName === 'BUTTON') {
        var cookieName = del.closest('.row').firstElementChild.innerText;

        listTable.removeChild(del.closest('.row'));
        deleteCookie(cookieName);
    }
})

function deleteCookie(cookieName) {
    document.cookie = cookieName + '=' + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

filterNameInput.addEventListener('keyup', function() {
    var input = filterNameInput.value;

    if (!input) {
        table(getCookies());
    } else {
        var resultCookies = {};

        for (var cookie in getCookies()) {
            if (cookie) {
                if (isMatching(cookie, input) || isMatching(getCookies()[cookie], input)) {
                    resultCookies[cookie] = getCookies()[cookie];
                }
            }
        }
        table(resultCookies);
    }
});

addButton.addEventListener('click', () => {

    if (getCookies()[addNameInput.value]) {
        deleteCookie(addNameInput.value);
    }

    document.cookie = `${addNameInput.value} = ${addValueInput.value}`; 
    table(getCookies());
});
