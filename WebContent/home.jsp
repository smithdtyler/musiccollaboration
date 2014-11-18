<!-- Copyright Tyler Smith 2012 -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<title>Score Smith</title>

<!-- link to style sheet -->
<link href="css/style.css" type="text/css" rel="stylesheet" />

<body>

  <%
    String user = (String)session.getAttribute("username");
    if(user == null || user.equals(null)){
      String redirectURL = "index.jsp";
      response.sendRedirect(redirectURL);
    }
  %>

	<div id="page_wrapper">
		<div class="spacer"></div>
		<div id="page_header">
			<h1>Score Smith</h1>
		</div>
		<div class="spacer"></div>
		<div id="left_side">
			<div id="songs"></div>
			<script type="text/javascript" src="controller.js"></script>
			<script type="text/javascript">
        getAllSongsForUser();
      </script>
		</div>
		<div id="right_side">
		<p>
			Logged In As
			<%=session.getAttribute("username")%>
			<a href="Login?logout">Logout</a>
			</p>
		</div>
		<div class="spacer"></div>
		<div id="page_footer">
			<h1>score-smith.com</h1>
		</div>
		<!--  skippping the content wrapper and spacer for now -->
		<div class="spacer"></div>
	</div>
</body>
</html>
