<?php

	#Get the data and make a new file out of it
	file_put_contents('../../packets/'.$_POST['title'].'.json',$_POST['json']);

?>