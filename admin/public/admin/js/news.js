$(document).ready(function () {
    
    $('#newsTable').DataTable({
        columnDefs: [
            {   
                target: "_all",
                className: 'dt-head-center'
            }
        ]
    });
    
    let newsModal = new bootstrap.Modal(document.getElementById('newsModal'));
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

    $('.add-news').click(function () {
        const $newsModal = $('#newsModal');
        const $newsForm = $newsModal.find('#newsForm');
        // Reset Form Fields
        $newsForm.find("input, textarea").val("");
        // Change Modal Title
        $newsModal.find('.modal-title').text('Add News');
        //Modify Form Attributes
        $newsForm.attr('action', '/admin/add/news/');
        $newsForm.attr('method', 'post');
        newsModal.show();
    });

    $('.update-news').click(function () {
        const $newsModal = $('#newsModal');
        const $newsForm = $newsModal.find('#newsForm');
        $newsModal.find('.modal-title').text('Update News');

        const title = $(this).parent().siblings('.news-title').text().trim();
        const image = $(this).parent().siblings('.news-img').text().trim();
        const story = $(this).parent().siblings('.news-story').text().trim();
        const date = $(this).parent().siblings('.news-date').text().trim();
        $newsForm.find('#news-title').val(title);
        $newsForm.find('#news-img').val(image);
        $newsForm.find('#news-story').val(story);
        $newsForm.find('#news-date').val((new Date(Date.parse(date))).toISOString().slice(0, 10));

        $newsForm.attr('action', '/admin/update/news/' + $(this).attr('id'));
        $newsForm.attr('method', 'put');
        newsModal.show();
    });

    $('.delete-news').click(function () {
        $.ajax({
            url: '/admin/delete/news/' + $(this).attr('id'),
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

    $('#newsForm').submit(function (e) {
        e.preventDefault();
        newsModal.hide();
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
                displayToast('Failure', false);
            }
        }).fail(() => {
            displayToast('Failure', false);
        });
    });

});