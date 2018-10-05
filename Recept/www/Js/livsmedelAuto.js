function autoLivs() {
    $(document).ready(function () {
        $.ajaxSetup({cache: false});
        $('#sAutoIngred').keyup(function () {
            $('#rAutoIngred').html('');
            $('#state').val('');
            let searchField = $('#sAutoIngred').val();
            let expression = new RegExp(searchField, "i");
            $.getJSON('./livsmedelsdata.json', function (data) {
                $.each(data, function (key, value) {
                    if (value.Namn.search(expression) !== -1) {
                        $('#rAutoIngred').append('<datalist class="list-group-item link-class">' + value.Namn + '</datalist>');
                    }
                });
            });
        });

        $('#rAutoIngred').on('click', 'datalist', function () {
            let click_text = $(this).text().split('|');
            $('#sAutoIngred').val($.trim(click_text[0]));
            $("#rAutoIngred").html('');
        });
    });
};