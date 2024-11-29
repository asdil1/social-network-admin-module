$(document).ready(function () {
    // Обработчик клика по кнопке "Новости пользователя"
    $('.view-news').on('click', function () {
        const userId = $(this).closest('.user-items').data('id'); // Получаем ID пользователя

        $.ajax({
            url: `/users/userNews/${userId}`,
            method: 'GET',
            dataType: 'json', // Ожидаем, что сервер вернет JSON
            success: function (response) {
                // Очищаем контейнер перед вставкой новых данных
                $('.news-container').html('');

                // Если новости найдены
                if (response.news && response.news.length > 0) {

                    response.news.forEach(function (newsItem) {
                        // Создаем HTML для каждой новости
                        const newsHtml = `
                            <div class="user-news-item">
                                <p>Тема: ${newsItem.title}</p>
                                <p>Новость: ${newsItem.message}</p>
                                <p>Дата публикации: ${newsItem.timestamp}</p>
                            </div>
                        `;
                        // Добавляем новость в контейнер
                        $('.news-container').append(newsHtml);
                    });

                } else if (response.news.length === 0) {
                    // Если нет новостей, отображаем сообщение
                    $('.news-container').append(`<p>${response.message}</p>`);
                }
                // Открываем модальное окно
                $('.modal-overlay').fadeIn(200);
            },
            error: function (error) {
                alert("Ошибка при загрузке новостей" + error.error);
            }
        });
    });

    // Обработчик для закрытия модального окна
    $('.close-modal').on('click', function () {
        $('.modal-overlay').fadeOut(200);
    });
});