<?php
	function onyx_give_card($param) {	
		$is_shuffle = $param['is_shuffle'];
		if($is_shuffle) {
			$shoe = $param['shoe'];
			$shoe2 = $param['shoe'];
			$shuffle = array();
			for($i = 0; $i < count($shoe); $i++) {
				$random = mt_rand(0, count($shoe2) - 1); // generate random number
				$card = array_splice($shoe2, $random, 1);
				array_push($shuffle, $card[0]);
			}
			return $shuffle;
		} else {
			$min = $param['min'];
			$max = $param['max'];
			return mt_rand($min, $max); // generate random number
		}
	}
?>