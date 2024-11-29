$(document).ready(function () {

    // функция обработки клика на имя
    $('.user-items').on('click', '.name, .email, .dob', function() {
        const $this = $(this); // Получаем элемент, на который нажали $this переменная содержит query объетк
        const $input = $this.siblings('input'); // Находим соответствующее поле ввода

        // Показать поле ввода с анимацией
        $this.fadeOut(200, function() {
            $input.fadeIn(200).focus(); // Сначала скрываем текст, затем показываем поле ввода и переключаемся на него
        });
    });

    // Функция для обработки изменения значения в поле ввода при клике в другое место сохраняем с помощью 'blur'
    $('.user-items').on('blur', 'input', function () {
        const $input = $(this);
        const userId = $input.closest('.user-items').data('id');
        const newValue = $input.val();

        let isValid = ($input.val().match(/.+?\@.+/g) || []);

        // Устанавливаем новое значение для соответствующего span
        $input.siblings('span').text(newValue);

        const dataType = $input.attr('class') // получаем значение класса
        const updateData = {};

        if (dataType === 'edit-name') {
            updateData.name = newValue;
        } else if (dataType === 'edit-email') {
            updateData.email = newValue;
        } else if (dataType === 'edit-dob') {
            updateData.date_of_birth = newValue;
        }

        // делаем запрос на сервер
        $.ajax({
            url: `/users/updateUserData/${userId}`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(updateData),
            success: function(response) {
                alert("Данные пользователя обновлены!: " + response.message);
            },
            error: function(error) {
                alert("Ошибка при обновлении данных пользователя.: " + error.message);
            }
        });

        // Скрываем поле ввода с анимацией
        $input.fadeOut(200, function() {
            $input.siblings('span').fadeIn(200); // Показываем текст снова
        });
    });
});