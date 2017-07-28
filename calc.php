<?php

$inputs = [
	'currency1',
	'currency2',
	'user_country_ppp',
	'interest_country_ppp',
	'amount',
];

foreach($inputs as $item) {
	if (!isset($_POST[$item]) || empty($_POST[$item])) {
		echo json_encode(['status' => 0]);
		return;
	}
	$$item = $_POST[$item];
}


$filename = "./_ppp_data";
$handle = fopen($filename, "r");
$contents = fread($handle, filesize($filename));

$pppData = unserialize($contents);
$user_country_ppp = $pppData[$user_country_ppp];
$interest_country_ppp = $pppData[$interest_country_ppp];

if ($interest_country_ppp == 0) {
		echo json_encode([
            'status' => '0',
            'result' => 'You have chosen the same country.'
        ]);
return;
	}



require_once "yahooClass/ApiClient.php";
require_once "yahooClass/HttpClient.php";
require_once "yahooClass/Exception/HttpException.php";
require_once "yahooClass/Exception/ApiException.php";

$client = new \Scheb\YahooFinanceApi\ApiClient();

//Get currency exchange rates
$dataFinance = $client->getCurrenciesExchangeRate($currency1 . $currency2); //Single rate

if (isset($dataFinance['query']['results']['rate']['Rate'])) {
    $koef_currency = $dataFinance['query']['results']['rate']['Rate'];

    $data['koef'] = $koef_currency;
    $data['interest_country_ppp'] = $interest_country_ppp;
    $data['user_country_ppp'] = $user_country_ppp;

    $res_1 = $amount * $koef_currency;
    $res_2 = $res_1 / $interest_country_ppp;
    $res_3 = $res_2 * $user_country_ppp;

    if ($res_3 == 0) {
        echo json_encode([
            'status' => '0',
            'result' => 'You have chosen the same country.'
        ]);
        return;
    } else {
        echo json_encode([
            'status' => '1',
            'result' => number_format( round($res_3, 2), 2, '.', '' ),
            'data' => $data
        ]);
    }
}
