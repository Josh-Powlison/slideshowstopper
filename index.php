<!DOCTYPE html>
<html>
	<head>
		<title>Slideshowstopper v0.0.4</title>
		<meta charset="utf-8">
		<link rel="stylesheet" href="code/www/styles.css">
	</head>

	<body onload="start()" lang="en">
		<header>
			<h2 id="packetName" contenteditable>Slides</h2>
			<button onclick="addSlide()">Add Slide</button>
			<input type="range" min="0.05" max="1" step="any" value="0.20" oninput="updateSampleSlides(this.value)">
		</header>
	
		<style id="sample-styles">
			#slides{
				font-size:10px;
			}
			.sample{
				/*100% of normal size*/
				width:1200px;
				height:800px;
			}
		</style>
		
		<main class="gallery" id="slides"></main>

		<!--Backgrounds-->
		<div id="editBackgrounds" class="gallery-container">
			<div class="gallery">
				<button onclick="editorHide()">X</button>
				<input type="color" id="pick-color" onchange="editBackground(this.value)">
				<?
				
					#Look through the backgrounds in the background folder (ignoring the current and parent folder notes)
					$backgrounds=array_diff(scandir('backgrounds'), array('.', '..'));
					
					#Show the backgrounds
					forEach($backgrounds as $background){
						#Save the extension in a variable
						$ext=pathInfo($background,PATHINFO_EXTENSION);
						
						switch($ext){
							#Convert MP4s
							/*
						case 'mp4':
							$ffmpeg= "ffmpeg"; //This is the path of ffmpeg that we got from terminal

							//The following line executes shell script
							exec("$ffmpeg -i \"input.avi\" -r 25 -c:v libx264  -s \"1920x1080\" \"output.mp4\" 2>&1", $output, $convert);

							}   
							if ($convert!=0) {
								echo 'fail to convert video to mp4 format';
							}
							else {
								echo 'success to convert video to mp4 format';
							}*/
						case 'ogg':
						case 'webm':
						?>
							<video onclick="editBackground('<?=$background?>')" autoplay loop muted preload>
								<source src="backgrounds/<?=$background?>" type="video/<?=$ext?>">
							</video>
						<?
							break;
						#Images
						default:
						?>
							<img title="<?=$background?>" src="backgrounds/<?=$background?>" onclick="editBackground('<?=$background?>')">
						<?
						}
					}
				?>
			</div>
		</div>
		
		<script src="code/www/script.js"></script>
	</body>
</html>