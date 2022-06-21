$(document).ready(function () {
    
    $('#userTable').DataTable({
        columnDefs: [
            {   
                target: "_all",
                className: 'dt-head-center'
            }
        ]
    });
    
    let userModal = new bootstrap.Modal(document.getElementById('userModal'));
    let responseToast = new bootstrap.Toast(document.getElementById('responseToast'));

    function displayToast(message, success = false) {
        let $toast = $('#responseToast');
        $toast.find('.toast-body').text(message);
        if(success) {
            $toast.removeClass('bg-danger');
            $toast.addClass('bg-success');
        } else {
            $toast.addClass('bg-danger');
            $toast.removeClass('bg-success');
        }
        responseToast.show();
    }

    $('.add-user').click(function () {
        const $userModal = $('#userModal');
        const $userForm = $userModal.find('#userForm');
        // Reset Form Fields
        $userForm.find("input, textarea").val("");
        $userForm.find("option").attr('selected', false);
        
        $userModal.find('.modal-title').text('Add User');
        //Modify Form Attributes
        $userForm.attr('action', '/admin/add/user/');
        $userForm.attr('method', 'post');
        userModal.show();
    });

    $('.update-user').click(function () {
        const $userModal = $('#userModal');
        const $userForm = $userModal.find('#userForm');
        $userModal.find('.modal-title').text('Update User');

        const username = $(this).parent().siblings('.user-username').text().trim();
        const email = $(this).parent().siblings('.user-email').text().trim();
        const role = $(this).parent().siblings('.user-role').text().trim();
        $userForm.find('#user-username').val(username);
        $userForm.find('#user-email').val(email);
        $userForm.find('#user-role').find(`option`).attr('selected', false);
        $userForm.find('#user-role').find(`option`).filter(function () {
            return $(this).text() === role;
        }).attr('selected', true);

        $userForm.attr('action', '/admin/update/user/' + $(this).attr('id'));
        $userForm.attr('method', 'put');
        userModal.show();
    });

    $('.delete-user').click(function () {
        $.ajax({
            url: '/admin/delete/user/' + $(this).attr('id'),
            method: 'DELETE',
            dataType: 'json'
        }).done((response) => {
            if (response.success) {
                displayToast('Success. Reloading...', true);
                setTimeout(() => location.reload(), 2000);
            } else {
                displayToast('Failure', false);
            }
        }).fail(() => {
            displayToast('Failure', false);
        });
    });

    $('#userForm').submit(function (e) {
        e.preventDefault();
        userModal.hide();
        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),
            dataType: 'json',
            data: $(this).serialize()
        }).done((response) => {
            if (response.success) {
                displayToast('Success. Reloading...', true);
                setTimeout(() => location.reload(), 2000);
            } else {
                displayToast(response.message, false);
            }
        }).fail(() => {
            displayToast('Failure', false);
        });
    });
});