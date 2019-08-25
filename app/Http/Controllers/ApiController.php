<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class ApiController extends Controller
{
    public function shrimpPrice(Request $req)
    {
        $search = $req->search;
        $with = $req->with;
        $sort = $req->sort;
        $region_id = $req->region_id;
        $client = new \GuzzleHttp\Client();
        $res = $client
            ->request('GET', 'https://app.jala.tech/api/shrimp_prices?
            search='.$search.'&with='.$with.'&sort='.$sort.'&region_id='.$region_id)
            ->getBody();
        $data = json_decode($res);
        return response()->json($data, 200);
    }

    public function shrimpPriceDetail($id)
    {
        $client = new \GuzzleHttp\Client();
        $res = $client
            ->request('GET', 'https://app.jala.tech/api/shrimp_prices/'.$id)
            ->getBody();
        $data = json_decode($res);
        return response()->json($data, 200);
    }
}
