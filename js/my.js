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
var flag_reset = 0;
var pp_rezult;
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

            if (flag_reset == 1) {
                $('#submiting').trigger('click');
                flag_reset = 0;
            }

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

            if (flag_reset == 1) {
                $('#submiting').trigger('click');
                flag_reset = 0;
            }

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

                    var currency_symbol = '',
                        currency1_name = cur1,
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
                }
                else {
                    $('#resultMessage').html(response.result);
                    console.log(response.result);
                }

                var result;
                $('#go').click(function () {
                    if ($('#select1').val() == 'No city, use national average') {
                        if ($('#select2').val() == 'No city, use national average') {
                            if ($("#Rent").prop("checked") != true && $("#Groceries").prop("checked") != true && $("#Property").prop("checked") != true && $("#Recreation").prop("checked") != true && $("#Technology").prop("checked") != true) {
                                alert("No city, use national average!!!");
                            }
                        }
                        else {
                            result = country[contry_city2]['Cost of Living Plus Rent Index'] / city[$('#select2').val()]['Cost of Living Plus Rent Index'] * pp_rezult;
                        }
                    }
                    else {
                        if ($('#select2').val() == 'No city, use national average') {
                            var a = country[contry_city1]['Cost of Living Plus Rent Index'] / city[$('#select1').val()]['Cost of Living Plus Rent Index'] * amount;

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
                                        result = response1.result * 1.00000000000001;
                                    }
                                }
                            });

                        } else {
                            var a = country[contry_city1]['Cost of Living Plus Rent Index'] / city[$('#select1').val()]['Cost of Living Plus Rent Index'] * amount;
                            var b;
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
                                    var response2 = jQuery.parseJSON(json);
                                    if (response2.status == '1') {
                                        b = response2.result;
                                        result = country[contry_city2]['Cost of Living Plus Rent Index'] / city[$('#select2').val()]['Cost of Living Plus Rent Index'] * b;
                                    }
                                }
                            });
                        }

                    }
                    var rent, recreation, groceries, rent_flag = 0, recreation_flag = 0, groceries_flag = 0;
                    if ($("#Rent").prop("checked") == true) {
                        if ($('#select2').val() == 'No city, use national average') {
                            rent = country[contry_city2]['Rent Index'] / country[contry_city2]['Cost of Living Plus Rent Index'] * pp_rezult;
                        } else {
                            rent = city[$('#select2').val()]['Rent Index'] / city[$('#select2').val()]['Cost of Living Plus Rent Index'] * result;
                        }
                        rent_flag = 1;
                    }
                    if ($("#Recreation").prop("checked") == true) {
                        if ($('#select2').val() == 'No city, use national average') {
                            recreation = country[contry_city2]['Restaurant Price Index'] / country[contry_city2]['Cost of Living Plus Rent Index'] * pp_rezult;
                        } else {
                            recreation = city[$('#select2').val()]['Restaurant Price Index'] / city[$('#select2').val()]['Cost of Living Plus Rent Index'] * result;
                        }
                        recreation_flag = 1;
                    }
                    if ($("#Groceries").prop("checked") == true) {
                        if ($('#select2').val() == 'No city, use national average') {
                            groceries = country[contry_city2]['Groceries Index'] / country[contry_city2]['Cost of Living Plus Rent Index'] * pp_rezult;
                        } else {
                            groceries = city[$('#select2').val()]['Groceries Index'] / city[$('#select2').val()]['Cost of Living Plus Rent Index'] * result;
                        }
                        groceries_flag = 1;
                    }

                    var cked_res;
                    if (groceries_flag == 1 && recreation_flag == 1 && rent_flag == 1) {
                        cked_res = (groceries + recreation + rent) / 3;
                    } else if (groceries_flag == 1 && recreation_flag == 1 && rent_flag == 0) {
                        cked_res = (groceries + recreation) / 2;
                    } else if (groceries_flag == 1 && recreation_flag == 0 && rent_flag == 1) {
                        cked_res = (groceries + rent) / 2;
                    } else if (groceries_flag == 0 && recreation_flag == 1 && rent_flag == 1) {
                        cked_res = (recreation + rent) / 2;
                    } else if (groceries_flag == 0 && recreation_flag == 0 && rent_flag == 1) {
                        cked_res = rent;
                    } else if (groceries_flag == 0 && recreation_flag == 1 && rent_flag == 0) {
                        cked_res = recreation;
                    } else if (groceries_flag == 1 && recreation_flag == 0 && rent_flag == 0) {
                        cked_res = groceries;
                    }

                    if ($("#Rent").prop("checked") == true || $("#Groceries").prop("checked") == true || $("#Property").prop("checked") == true || $("#Recreation").prop("checked") == true || $("#Technology").prop("checked") == true) {
                        $('.koef-ppp').html(cked_res.toFixed(2) + "  " + currency_symbol + "<a href=\"#\" data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"right\" title=\"We use the Cost of Living Index of <br> numbeo.com to weigh the result by <br>expensetypesand cityes \"><b>?</b></a>");
                    }
                    else {
                        $('.koef-ppp').html(result.toFixed(2) + "  " + currency_symbol + "<a href=\"#\" data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"right\" title=\"We use the Cost of Living Index of <br> numbeo.com to weigh the result by <br>expensetypesand cityes \"><b>?</b></a>");
                    }
                    $("[data-toggle=tooltip]").tooltip();
                    flag_reset = 1;
                });
                $("[data-toggle=tooltip]").tooltip();

            }
        });
    });

    $('.amount-money').on('keyup', function () {
        if (flag_reset == 1) {
            $('#submiting').trigger('click');
            flag_reset = 0;
        }
    });
    $("#Rent").click(function () {
        if (flag_reset == 1) {
            $('#submiting').trigger('click');
            flag_reset = 0;
        }
    });
    $("#Groceries").click(function () {
        if (flag_reset == 1) {
            $('#submiting').trigger('click');
            flag_reset = 0;
        }
    });
    $("#Property").click(function () {
        if (flag_reset == 1) {
            $('#submiting').trigger('click');
            flag_reset = 0;
        }
    });
    $("#Recreation").click(function () {
        if (flag_reset == 1) {
            $('#submiting').trigger('click');
            flag_reset = 0;
        }
    });
    $("#Technology").click(function () {
        if (flag_reset == 1) {
            $('#submiting').trigger('click');
            flag_reset = 0;
        }
    });
    $("#user_countries_option").change(function () {
        if (flag_reset == 1) {
            $('#submiting').trigger('click');
            flag_reset = 0;
        }
    });
    $('#select2').change(function () {
        if (flag_reset == 1) {
            $('#submiting').trigger('click');
            flag_reset = 0;
        }
    });
    $('#select1').change(function () {
        if (flag_reset == 1) {
            $('#submiting').trigger('click');
            flag_reset = 0;
        }
    });
});
