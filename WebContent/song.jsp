<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Music Collaboration</title>
</head>
<body>
	<div id="home">
		<h2>
			<a href="home.jsp">Score-Smith Home</a>
		</h2>
	</div>
	<div id="controls" style="height: 200px; width: 300px; float: left">
		<br /> <br /> <br />
		<div id="songkey">
			<p></p>
		</div>
		<div id="songtempo">
			<p></p>
		</div>
		<div id="save">
			<p>
				<button type="button" onclick="saveCurrentSong()">Save</button>
				<!-- <button type="button" onclick="deleteCurrentSong()">Delete</button>  -->
			</p>
		</div>
	</div>
	<div id="play" style="height: 100px; width: 200px; float: left">
		<div id="songname" style="float: left">
			<h2>&nbsp;</h2>
		</div>
		<p>
			<a href="javascript: play();"><img id="playimage"
				src="img/play_icon.png" /></a>
		</p>
	</div>
	<div style="border: 1px solid black; padding: 10px; clear: both"
		id="canvas_section">
		<!-- Canvas on which to draw the musical notation -->
		<canvas id="canvas" width='800' height='700'> Sorry! -
		Browser does not support Graphics Canvas </canvas>
	</div>
	<script type="text/javascript">
	  document.getElementById("playimage").onmousedown=function(){document.getElementById("playimage").src="img/play_icon_unselected.png";};
	  document.getElementById("playimage").onmouseup=function(){document.getElementById("playimage").src="img/play_icon.png";};
  </script>
	<script type="text/javascript" src="common/audiolib.js"></script>
	<script type="text/javascript" src="audio/audio.js"></script>
	<script type="text/javascript" src="inheritanceutil.js"></script>
	<script type="text/javascript" src="datamodel.js"></script>
	<script type="text/javascript" src="keygraphic.js"></script>
	<script type="text/javascript" src="contentgraphic.js"></script>
	<script type="text/javascript" src="contentlayoutgraphic.js"></script>
	<script type="text/javascript" src="associationgraphic.js"></script>
	<script type="text/javascript" src="canvasmanager.js"></script>
	<script type="text/javascript" src="controller.js"></script>
	<script type="text/javascript">
		getSong(
	<%=request.getParameter("song_id")%>
		);
	</script>
</body>
</html>