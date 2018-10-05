function setup() {
    let button = select('#addRecipe');
    button.mousePressed(submitWord);
}

function submitWord() {

    let ingredients = [], co = 1;
    while ($('#rIngredients' + co).length) {
        ingredients.push({
            name: $('#rIngredients' + co).val(),
            units: parseInt($('#rUnits' + co).val()),
            measuringUnit: $('#rMeasurements' + co).val(),
            EqGrams: parseInt($('#rEqGrams' + co).val())
        });
        co++;
    }

    let firstIngredient = [];
    {
        firstIngredient.push({
            name: select('#sAutoIngred').value(),
            units: parseInt(select('#rUnits').value()),
            measuringUnit: select('#rMeasurements').value(),
            eqGrams: parseInt(select('#rEqGrams').value())
        });
    }

    $.ajax({
        method: "POST",
        url: "/add/recipe",
        dataType: "json",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify({
            name: select('#rName').value(),
            categories: select('#rCategories').value(),
            persons: parseInt(select('#rPersons').value()),
            description: select('#rDescription').value(),
            firstIngredient: firstIngredient,
            ingredients: ingredients,
            instructions: select('#rInstructions').value(),
            image: select('#rImage').value()
        })
    });

    window.alert('Recipe Successfully Added');
}

/*function measureSelect(items,appendTo = 'body'){
    let sel = $('<select/>');
    for(let item of items){
        let option = $('<option value="' + item + '">' + item + '</option>');
        sel.append(option);
    }
    $(appendTo).append(sel);
}*/

function addFields() {

    let number = document.getElementById("ingredientCounter").value;
    let container = document.getElementById("container");

    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

    for (let i = 1; i < number; i++) {
        let ingred = document.createElement("input");
        //let ingredList = document.createElement("data-list");
        let unit = document.createElement("input");
        let measuringUnit = document.createElement("input");
        let eqGrams = document.createElement("input");
        ingred.type = "ingredientField";
        ingred.setAttribute("id", "rIngredients" + i);
        ingred.setAttribute("placeholder", "Ingredient");
        container.appendChild(ingred);

        /*ingredList.type = "text";
        ingredList.setAttribute("id","rAutoIngred");
        ingredList.setAttribute("class","ingredientAutoList");
        container.appendChild(ingredList);*/

        unit.type = "number";
        unit.setAttribute("id", "rUnits" + i);
        unit.setAttribute("placeholder", "Amount");
        unit.setAttribute("class", "unit");
        container.appendChild(unit);
        //measureSelect(["st", "g", "kg", "ml", "dl", "L"], container);
        measuringUnit.type = "measureField";
        measuringUnit.setAttribute("id", "rMeasurements" + i);
        measuringUnit.setAttribute("placeholder", "Measurement");
        container.appendChild(measuringUnit);
        eqGrams.type = "number";
        eqGrams.setAttribute("id", "rEqGrams" + i);
        eqGrams.setAttribute("placeholder", "Eq. in Grams");
        eqGrams.setAttribute("class", "eqGrams");
        container.appendChild(eqGrams);
        container.appendChild(document.createElement("br"));
    }
}

$(document).on('click', 'a', function (e) {
    let link = $(this).attr('href');
    if (link && link.indexOf('/') === 0) {
        e.preventDefault();
        history.pushState(null, null, link);
        handleRoute(link);
    }
});

window.addEventListener("popstate", (e) => {
    handleRoute(location.pathname);
});

handleRoute(location.pathname)

function handleRoute(path) {
    let recipe = path.split('/recipe/')[1];
    if (recipe) {
        showRecipe(decodeURIComponent(recipe));
    }
}

function showRecipe() {

    $("#ingredCalculator").on('click', function () {
        let serving = parseInt($("#ingredCalculator").val());
        $("#ingredResult").val(serving);
        userServing = serving;
        displayRecipe();
        //displayLivsmedel();
    });

    let userServing = $("#ingredResult").val();
    let calcIngred = 0;
    //let calcNaring = 0;
    let currentRecipe;

    function displayRecipe(value) {
        if (!value) {
            value = currentRecipe;
        }
        if (!value) {
            return;
        }
        $('#jsonImage').html('');
        $('#jsonRecipe').html('');
        currentRecipe = value;
        $('#jsonImage').append('<img src="' + value.image + '" height="400" width="400" class="dish"/>');
        $('#jsonRecipe').append('<ul class="recipeClass">' + value.name + ' | ' + value.categories + '<br>' + 'Servings: ' + userServing + '<br>' + 'Description: ' + value.description + '<br>' + '<br>' + '<font size="5">Ingredients: </font>' + '<br></ul>');

        for (let i = 0; i < value.firstIngredient.length; i++) {
            calcIngred = userServing * (value.firstIngredient[i].units) / 4;
            $('#jsonRecipe').append('<ul class="recipeClass">' + value.firstIngredient[i].name + ' : ' + calcIngred + '  ' + value.firstIngredient[i].measuringUnit + '<br></ul>');
        }

        for (let j = 0; j < value.ingredients.length; j++) {
            calcIngred = userServing * (value.ingredients[j].units) / 4;
            $('#jsonRecipe').append('<ul class="recipeClass">' + value.ingredients[j].name + ' : ' + calcIngred + '  ' + value.ingredients[j].measuringUnit + '<br></ul>');
        }
        $('#jsonRecipe').append('<ul class="recipeClass">' + '<br>' + '<font size="5">Instructions: </font>' + value.instructions + '<br></ul>');
    }

    $(document).ready(function () {
        $.ajax({cache: false});
        $('#search').keyup(function () {
            $('#jsonImage').html('');
            $('#jsonRecipe').html('');
            $('#state').val('');
            let searchField = $('#search').val();
            let expression = new RegExp(searchField, "i");
            $.getJSON('./JSON/recipes.json', function (recipe) {
                $.each(recipe, function (key, value) {
                    if (value.name.search(expression) !== -1) {
                        displayRecipe(value);
                    }
                })
            })
        })
    })

    /*let currentLisvmedel;

    function displayLivsmedel(data) {
        if (!data) {
            data = currentLisvmedel;
        }
        if (!data) {
            return;
        }
        $('#jsonNutritional').html('');
        currentLisvmedel = data;
        if (value.firstIngredient[0].name === data.Namn) {
            for (let j = 0; j < data.Naringsvarden.length; j++) {
                for (let k = 0; k < data.Naringsvarde.length; k++) {
                    if (data.Naringsvarde[k].Namn === ['Energi', 'Protein', 'Kolhydrater', 'Socker totalt', 'Summa mättade fettsyror', 'Summa enkelomättade fettsyror', 'Summa fleromättade fettsyror', 'Salt']) {
                        calcNaring = userServing * (data.Naringsvarde[k].Varde) / 4;
                        $('#jsonNutritional').append('<ul class="recipeClass">' + '<font size="5">Nutrient Values: </font>' + '<br>' + data.Naringsvarde[k].Namn + ' : ' + calcNaring + '  ' + data.Naringsvarde[k].Enhet + '<br></ul>');
                    }
                }
            }
        }

    }

    $(document).ready(function () {
        $.ajax({cache: false});
        $('#sAutoIngred').keyup(function () {
            $('#jsonNutritional').html('');
            $('#state').val('');
            let searchField = $('#sAutoIngred').val();
            let expression = new RegExp(searchField, "i");
            $.getJSON('../livsmedelsdata.json', function (data) {
                $.each(data, function (key, data) {
                    if (data.Namn.search(expression) !== -1) {
                        displayLivsmedel(data);
                    }
                })
            })
        })
    })*/
}