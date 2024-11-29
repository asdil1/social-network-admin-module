// документ подгружен
$(document).ready(function() {

    // Обработчик изменения роли
    $('select[name="role"]').change(function() {
        const userId = $(this).closest('.user-items').data('id'); // Получаем ID пользователя
        const newRole = $(this).val(); // новое значение роли

        // отправляем на сервер
        $.ajax({
            url : `/users/updateUserRole/${userId}`,
            method: "POST",
            contentType: "application/json", // указываем что формат данных json
            data: JSON.stringify( { role: newRole }),
            success: function(response) {
                // Если запрос выполнен успешно, выводим сообщение
                alert("Роль обновлена: " + response.message);
            },
            error: function(error) {
                // В случае ошибки выводим сообщение
                alert("Ошибка при обновлении роли: " + error.message);
            }
        });
    });

    // Обработчик изменения статуса
    $('select[name="status"]').change(function() {
       const userId = $(this).closest('.user-items').data('id');
       const newStatus = $(this).val();

       $.ajax({
           url : `/users/updateUserStatus/${userId}`,
           method: "POST",
           contentType: "application/json",
           data: JSON.stringify({ status: newStatus }),
           success: function(response) {
               alert("Статус обновлен: " + response.message);
           },
           error: function(error) {
               alert("Ошибка при обновлении статуса: " + error.message);
           }
       });
    });
});