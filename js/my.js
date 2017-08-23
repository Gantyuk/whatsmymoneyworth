$.ajaxSetup({
    async: false
});

var country, currencies, city, countries, countries_curency;

$.getJSON("Contry.json", function (data) {
    country = data;
});

$.getJSON("currencies.json", function (data) {
    currencies = data;
});
$.getJSON("countries.json", function (data) {
    countries = data;
});
$.getJSON("countries_curency.json", function (data) {
    countries_curency = data;
});

$.getJSON("City.json", function (data) {
    city = data;
});
var pp_rezult;
var res_am = 0;
$(document).ready(function () {

    var user_coutries_data = {};

    var items = {};
    var data = countries_curency;
    $.each(countries_curency, function (key, val) {

        if (val in currencies) {
            var s = countries[key] + ' - ' + currencies[val]["name"];
            s = s + ' (' + currencies[val]["symbol"] + ')';
        } else {
            var s = countries[key] + ' (' + val + ')';
        }
        items[key] = s;

    });
    user_coutries_data = items;

    var country1, contry_city1;

    $('#user_countries_option').flagStrap({
        countries: user_coutries_data,
        buttonSize: "btn-sm",
        buttonType: "btn-primary",
        labelMargin: "10px",
        scrollable: true,
        scrollableHeight: "350px",
        placeholder: {
            value: "",
            text: "Please select a country"
        },
        onSelect: function (value, element) {
            country1 = $(element).children("option[selected=selected]").val(); //This is the correct value

            console.log("This is the selected country code: " + country1);

            contry_city1 = countries[country1];

            $("#select1").html(" <option>No city, use national average</option>");
            $.each(city, function (key, val) {
                if (val['Country'] == contry_city1) {
                    $("#select1").append("<option>" + key + "</option>");
                }
            });
            $('#contry_1').html(contry_city1);
        }
    });

    country1 = $("#user_countries_option > select").children("option[selected=selected]").val();

    contry_city1 = countries[country1];

    $.each(city, function (key, val) {
        if (val['Country'] == contry_city1) {
            $("#select1").append("<option>" + key + "</option>");
        }
    });
    $('#contry_1').html(contry_city1);


    var country2, contry_city2;
    $('#interest_countries_option').flagStrap({
        countries: user_coutries_data,
        buttonSize: "btn-sm",
        buttonType: "btn-primary",
        labelMargin: "10px",
        scrollable: true,
        scrollableHeight: "350px",
        placeholder: {
            value: "",
            text: "Please select a country"
        },
        onSelect: function (value, element) {
            country2 = $(element).children("option[selected=selected]").val();
            console.log("This is the selected country code: " + country2);
            contry_city2 = countries[country2];

            $("#select2").html(" <option>No city, use national average</option>");
            $.each(city, function (key, val) {
                if (val['Country'] == contry_city2) {
                    $("#select2").append("<option>" + key + "</option>");
                }
            });
            $('#contry_2').html(contry_city2);
        }
    });
    $('#result').click(function () {
        $('#spesifay').removeClass("hidden");
        $('#text_after').addClass('hidden');
        $('#text_result').addClass('hidden');
        $('#select1').val('No city, use national average');
        $('#select2').val('No city, use national average');
        $("#Rent").prop("checked", false);
        $("#Recreation").prop("checked", false);
        $("#Property").prop("checked", false);
        $("#Groceries").prop("checked", false);
        $("#Technology").prop("checked", false);

    })
    country2 = $("#interest_countries_option > select").children("option[selected=selected]").val();
    contry_city2 = countries[country2];

    $.each(city, function (key, val) {
        if (val['Country'] == contry_city1) {
            $("#select2").append("<option>" + key + "</option>");
        }
    });
    $('#contry_2').html(contry_city2);

    $('form').submit(function (e) {
        e.preventDefault();
        var currency_symbol = '';
        $('#text_result').addClass('hidden');
        $('#text_after').addClass('hidden');
        $('#select1').val('No city, use national average');
        $('#select2').val('No city, use national average');
        $('#result').addClass("hidden");
        $('#spesifay').addClass("hidden");
        $("#Rent").prop("checked", false);
        $("#Recreation").prop("checked", false);
        $("#Property").prop("checked", false);
        $("#Groceries").prop("checked", false);
        $("#Technology").prop("checked", false);

        var cur1 = countries_curency[country1];
        //var coutry_name1 = coutries_select_2[country1];

        var cur2 = countries_curency[country2];
        //var coutry_name2 = coutries_select_2[country2];

        var amount = $(this).find('input[name="amount"]').val();

        $('#resultMessage').html('');
        $.ajax({
            url: 'calc.php',
            data: {
                currency1: cur1,
                user_country_ppp: country1,
                currency2: cur2,
                interest_country_ppp: country2,
                amount: amount
            },
            type: 'POST',
            success: function (json) {

                var response = jQuery.parseJSON(json);
                if (response.status == '1') {

                    var currency1_name = cur1,
                        currency2_name = cur2;

                    if (currencies[cur1]) {
                        currency_symbol = currencies[cur1]["symbol"];
                        currency1_name = currencies[cur1]["name"];
                    }
                    if (currencies[cur2]) {
                        currency2_name = currencies[cur2]["name"];
                    }

                    var the = '';
                    if (country1 == 'US' || country1 == 'NL') {
                        the = 'the ';
                    }
                    var message = "At this moment you can buy with <b>" + amount + " " + currency1_name + "</b> " + "about as much in " + countries[country2] + " as you could buy with about <div class='text-center'> <span class='koef-ppp'>" + response.result + "  " + currency_symbol + '<a href="#" data-toggle="tooltip" data-html="true" data-placement="right" title="Explained: We convert the amount to local currency and divide by the so-called „PPP-Factor“ (Purchasing Power Parity), issued by the International Monetary Fund. This returns an amount in Dollars that has the same purchasing power in the USA as the originally entered amount would have in the foreign country’s currency; we then finally multiply this amount with the PPP of your country, which returns the amount in your currency that equals the purchasing power of the calculatory Dollar amount"><b>?</b></a></span></div><br> in ' + the + countries[country1] + ".";
                    $('#resultMessage').html(message);
                    pp_rezult = response.result;
                    $('#result').removeClass("hidden");
                    $('#text_after').removeClass('hidden');
                }
                else {
                    $('#resultMessage').html(response.result);
                    console.log(response.result);
                }
                var optim_iac_moj;
                var select0 = $('#select1');


                select0.change(function () {
                    var a = country[contry_city1]['Cost of Living Plus Rent Index'] / city[select0.val()]['Cost of Living Plus Rent Index'] * amount;
                    $.ajax({
                        url: 'calc.php',
                        data: {
                            currency1: cur1,
                            user_country_ppp: country1,
                            currency2: cur2,
                            interest_country_ppp: country2,
                            amount: a.toFixed(2)
                        },
                        type: 'POST',
                        success: function (json) {
                            var response1 = jQuery.parseJSON(json);
                            if (response1.status == '1') {
                                optim_iac_moj = parseFloat(response1.result);
                            }
                        }
                    });
                });

                var result, mes_cur;

                $('#go').click(function () {
                    var select1 = select0.val(),
                        select2 = $('#select2').val(),
                        rent_select = $("#Rent").prop("checked"),
                        groceries_select = $("#Groceries").prop("checked"),
                        recreation_select = $("#Recreation").prop("checked");

                    if (select1 == 'No city, use national average') {
                        if (select2 != 'No city, use national average') {
                            result = country[contry_city2]['Cost of Living Plus Rent Index'] / city[select2]['Cost of Living Plus Rent Index'] * pp_rezult;
                            mes_cur = select2;
                        }
                    }
                    else {
                        if (select2 == 'No city, use national average') {
                            mes_cur = select1;
                            result = optim_iac_moj;
                        } else {
                            result = country[contry_city2]['Cost of Living Plus Rent Index'] / city[select2]['Cost of Living Plus Rent Index'] * optim_iac_moj;
                            mes_cur = select1 + " and " + select2;
                        }
                    }
                    var rent, recreation, groceries;
                    if (rent_select == true) {
                        if (select2 == 'No city, use national average') {
                            rent = country[contry_city2]['Rent Index'] / country[contry_city2]['Cost of Living Plus Rent Index'] * pp_rezult;
                        } else {
                            rent = city[select2]['Rent Index'] / city[select2]['Cost of Living Plus Rent Index'] * result;
                        }
                    }
                    if (recreation_select == true) {
                        if (select2 == 'No city, use national average') {
                            recreation = country[contry_city2]['Restaurant Price Index'] / country[contry_city2]['Cost of Living Plus Rent Index'] * pp_rezult;
                        } else {
                            recreation = city[select2]['Restaurant Price Index'] / city[select2]['Cost of Living Plus Rent Index'] * result;
                        }
                    }
                    if (groceries_select == true) {
                        if (select2 == 'No city, use national average') {
                            groceries = country[contry_city2]['Groceries Index'] / country[contry_city2]['Cost of Living Plus Rent Index'] * pp_rezult;
                        } else {
                            groceries = city[select2]['Groceries Index'] / city[select2]['Cost of Living Plus Rent Index'] * result;
                        }
                    }

                    var cked_res = 0, type_mes, index = 0;
                    if (groceries != undefined) {
                        cked_res += groceries;
                        index++;
                        type_mes = " Groceries";
                    }
                    if (recreation != undefined) {
                        cked_res += recreation;
                        index++;
                        if (type_mes == undefined) {
                            type_mes = " Gastro/Recreation ";
                        } else if (rent == undefined) {
                            type_mes = " Groceries and Gastro/Recreation";
                        }
                    }
                    if (rent != undefined) {
                        cked_res += rent;
                        index++;
                        if (type_mes == undefined) {
                            type_mes = " Rent ";
                        } else if (groceries != undefined && recreation != undefined) {
                            type_mes += ", Gastro/Recreation and Rent ";
                        } else {
                            type_mes += " and Rent ";
                        }
                    }
                    if (index > 1) {
                        cked_res /= index;
                    }
                    if (rent_select == true || groceries_select == true || recreation_select == true) {
                        $('.koef-ppp').html(cked_res.toFixed(2) + "  " + currency_symbol + "<a href=\"#\" data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"right\" title=\"We use the Cost of Living Index of <br> numbeo.com to weigh the result by <br>expensetypesand cityes \"><b>?</b></a>");
                    }
                    else {
                        $('.koef-ppp').html(result.toFixed(2) + "  " + currency_symbol + "<a href=\"#\" data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"right\" title=\"We use the Cost of Living Index of <br> numbeo.com to weigh the result by <br>expensetypesand cityes \"><b>?</b></a>");
                    }
                    $("[data-toggle=tooltip]").tooltip();
                    var last_mesag = "";
                    if (type_mes != undefined) {
                        if (select2 != 'No city, use national average' || select1 != 'No city, use national average') {
                            last_mesag = "<p><b>This is a weighed result, taking into account the expense types " + type_mes + " as well as the </b></p>";
                        } else {
                            last_mesag = "<p><b>This is a weighed result, taking into account the expense types " + type_mes + "</b> </p>";
                        }
                    }
                    if (mes_cur != undefined) {
                        last_mesag += "<p><b>local price indices of " + mes_cur + ".<br> </b></p><p><b>For more info, please slide over the question mark in the result box.</b></p>"
                    }
                    else {
                        last_mesag += "<p><b>For more info, please slide over the question mark in the result box.</b></p>"
                    }
                    $('#text_result').html(last_mesag).removeClass('hidden');
                    mes_cur = undefined;
                    res_am++;
                    if (res_am == 2) {
                        $('#am_rez').removeClass("hidden");
                    }
                });
                $("[data-toggle=tooltip]").tooltip();
            }
        });
    });
});
