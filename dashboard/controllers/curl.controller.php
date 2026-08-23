<?php 

class CurlController{

	/*=============================================
	Peticiones a la API
	=============================================*/	

	static public function request($url,$method,$fields){

		$curl = curl_init();

		curl_setopt_array($curl, array(
			CURLOPT_URL => $_ENV["API_URL"].$url,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => '',
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_CONNECTTIMEOUT => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => $method,
			CURLOPT_POSTFIELDS => $fields,
			CURLOPT_HTTPHEADER => array(
				'Authorization: '.$_ENV["API_KEY"]
			),
		));

		$response = curl_exec($curl);

            if ($response === false) {

                $error = curl_error($curl);
                curl_close($curl);

                return (object)[
                    "status" => 500,
                    "results" => $error
                ];
            }

            curl_close($curl);

            return json_decode($response);
    }

	/*=============================================
	Peticiones a la API de CHATGPT
	=============================================*/	

		static public function chatGPT($content,$token,$org){

		$curl = curl_init();


		$data = array(

			"model" => "gpt-4o-mini",

			"messages" => array(

				array(
					"role"=>"user",
					"content"=>$content
				)

			)

		);


		curl_setopt_array($curl, array(

			CURLOPT_URL => 'https://api.openai.com/v1/chat/completions',

			CURLOPT_RETURNTRANSFER => true,

			CURLOPT_CUSTOMREQUEST => 'POST',
			CURLOPT_CONNECTTIMEOUT => 10,
			CURLOPT_TIMEOUT => 60,

			CURLOPT_POSTFIELDS => json_encode($data),

			CURLOPT_HTTPHEADER => array(

				'Authorization: Bearer '.$token,

				'OpenAI-Organization: '.$org,

				'Content-Type: application/json'

			),

		));


		$response = curl_exec($curl);


		curl_close($curl);


		$response = json_decode($response);


		if(isset($response->choices[0]->message->content)){

			return $response->choices[0]->message->content;

		}


		if(isset($response->error)){

			return "Error OpenAI: ".$response->error->message;

		}


		return "Respuesta inesperada de OpenAI";


	}
}