<?php

	function mt_random($rng_limit = array(), $base = 0){
		// @desc Generates RNG from a defined base int to limit int
		// @param arr $rng_limit - RNG Limit per Reel
		// @return arr $rng
		$rng = array();
		foreach($rng_limit as $limit) {
			$rand = mt_rand($base, $limit);
			array_push($rng, $rand);
		}
		return $rng;
	}

	function get_rnglimit($reelComposition = array()) {
		// @desc Counts total number of symbols each strip of reel composition
		// @param arr $reelComposition
		// @return arr $value
		$value = array();
		foreach($reelComposition as $reel) {
			$rnd_limit = count($reel) - 1;
			array_push($value, $rnd_limit);
		}
		return $value;
	}

	function parse_gameconfig($config = '', $explode_char_a = '|', $explode_char_b = ';') {
		// @desc Parse reel composition string values separated by special characters
		// @param str $config
		// @param str $explode_char_a 
		// @param str $explode_char_b
		// @return arr $value
		$value = array();
		$get_chunk = explode($explode_char_a, $config);
		array_pop($get_chunk);
		foreach($get_chunk as $chunks) {
			$chunk = explode($explode_char_b, $chunks);
			array_pop($chunk);
			array_push($value, $chunk);
		}
		return $value;
	}

?>