<html>
 <head>
  <title>PHP Test</title>
 </head>
 <body>
 <?php $content = $_POST['name'].":"; $file = "text.txt"; $Saved_File = fopen($file, 'a'); fwrite($Saved_File, $content); fclose($Saved_File); ?> 
 </body>
</html>
