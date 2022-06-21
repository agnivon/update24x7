$(document).ready(function() {
    let responseToast = new bootstrap.Toast(document.getElementById('responseToast'));

    function displayToast(message, success = false) {
        let toast = $('#responseToast');
        toast.find('.toast-body').text(message);
        if(success) {
            toast.removeClass('bg-danger');
            toast.addClass('bg-success');
        } else {
            toast.addClass('bg-danger');
            toast.removeClass('bg-success');
        }
        responseToast.show();
    }

    $('#contactForm').submit(function(e) {
        e.preventDefault();
        $(this).find('button[type=submit]').prop('disabled', true);
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            dataType: 'json',
            method: 'POST'
        }).done((response) => {
            if(response.success) {
                displayToast(response.message, true);
            } else {
                displayToast(response.message, false);
            }
            $(this).find('button[type=submit]').prop('disabled', false);
        }).fail(() => {
            displayToast('Submission failed', false);
            // $(this).find('button[type=submit]').prop('disabled', false);
        })
    })
});