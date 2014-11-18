<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
<link href="css/style.css" type="text/css" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Create a New User</title>
</head>
<body>
  <div id="page_wrapper">
    <div class="spacer"></div>
    <div id="page_header">
      <h1>Score Smith</h1>
    </div>
    <div class="spacer"></div>
    <div id="left_side">
      <div id="userinfo">
      <form action="CreateUser" method="post">
        Username <input type="text" name="username" />
        <br>
        Email <input type="text" name="email"/>
        <br>
        Password <input type="password" name="password" />
        <br>
        RePassword <input type="password" name="retypepassword" />
        <br>
        <input type="submit" value="submit" />
      </form>
      </div>
      <div id="result">
      </div>
    </div>
    <div id="right_side">
      <p>Not logged in</p>
    </div>
    <div class="spacer"></div>
    <div class="spacer"></div>
    <div class="spacer"></div>
    <div id="page_footer">
    </div>
    <!--  skippping the content wrapper and spacer for now -->
    <div class="spacer"></div>
  </div>
</body>
</html>