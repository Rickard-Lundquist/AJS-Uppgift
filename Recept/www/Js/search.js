function userSearch() {
    $(document).ready(function () {
        $.ajax({cache: false});
        $('#search').keyup(function () {
            $('#result').html('');
            $('#state').val('');
            let searchField = $('#search').val();
            let expression = new RegExp(searchField, "i");
            $.getJSON('./JSON/recipes.json', function (data) {
                $.each(data, function (key, value) {
                    if (value.name.search(expression) !== -1 || value.categories.search(expression) !== -1 || value.description.search(expression) !== -1) {
                        $('#result').append('<li class="link-class"><img src="' + value.image + '" height="40" width="40" class="img-thumbnail" /> ' + value.name + ' | <span class="text-muted">' + value.categories + '</span></a></li>');
                    } else
                        $.each(value.ingredients, function (k, v) {
                            if (v.name.search(expression) !== -1) {
                                $('#result').append('<li class="link-class"><img src="' + value.image + '" height="40" width="40" class="img-thumbnail" /> ' + value.name + ' | <span class="text-muted">' + value.categories + '</span></a></li>');
                            } //<a class="userView" href="/recipe/' + encodeURIComponent(value.name) + '">
                        });
                });
            });
        });

        $('#result').on('click', 'li', 'a', function () {
            let click_text = $(this).text().split('|');
            $('#search').val($.trim(click_text[0]));
            $("#result").html('');
        });

    });

};