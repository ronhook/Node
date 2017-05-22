<!DOCTYPE html>
<html>
	<head>
		<title>Test of node</title>
	</head>
	<body>

		<center>
			<h2>
			Your Node.JS server is working.
			</h2>
		</center>

		<center>
			<p>
			The below button is technically dynamic. You are now using Javascript on both the client-side and the server-side.
			</p>
		</center>
		<br>

		<center>
			<button type="button"
				onclick="document.getElementById('sample').innerHTML = Date()">
				Display the date and time.
			</button>
			<p id="sample"></p>
		</center>

	</body>
</html>