</head>
	<body>
		<?php  
			$dir = "text.txt";
			$line = $_POST['name'].":";
			$contents = file_get_contents($dir);
			$contents = str_replace($line, '', $contents);
			file_put_contents($dir, $contents);
		?>
	</body>
</html>

