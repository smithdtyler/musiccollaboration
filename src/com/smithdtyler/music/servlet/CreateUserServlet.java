/**
   Music Collaboration
   Copyright (C) 2014  Tyler Smith
 
   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.smithdtyler.music.servlet;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.smithdtyler.music.dao.UserDao;
import com.smithdtyler.music.domain.User;
import com.smithdtyler.security.HashHelper;
import com.smithdtyler.security.IncorrectPasswordException;
import com.smithdtyler.security.LoginManager;
import com.smithdtyler.security.UserNotFoundException;

/**
 * Servlet implementation class CreateUserServlet
 */
public class CreateUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(CreateUserServlet.class);
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateUserServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	  logger.info("Received create user GET");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	  logger.info("Received create user POST");
    Map<?, ?> parameters = request.getParameterMap();
    String username = null;
    String password = null;
    String repassword = null;
    String email = null;
    for(Object o : parameters.keySet()){
      String key = (String)o;
      logger.info("param : " + key + " value " + request.getParameter((String)key));
      if(key.equals("username")){
        username = request.getParameter(key);
      } else if(key.equals("password")){
        password = request.getParameter(key);
      } else if(key.equals("retypepassword")){
        repassword = request.getParameter(key);
      } else if(key.equals("email")){
        email = request.getParameter(key);
      }
    }
    if(username == null || password == null || repassword == null || email == null){
      logger.error("Missing parameter!");
      // TODO redirect to error page
      response.sendRedirect("");
      return;
    }
    if(!password.equals(repassword)){
      logger.error("Passwords do not match");
      // TODO redirect to error page
      response.sendRedirect("");
      return;
    }
    User user = UserDao.findUser(username);
    if(user != null){
      logger.error("A user with this username already exists!");
      // TODO redirect to error page
      response.sendRedirect("");
      return;
    }
    user = new User();
    user.setUsername(username);
    user.setPasswordHash(HashHelper.md5String(password));
    user.setEmail(email);
    UserDao.save(user);
    
    HttpSession session = request.getSession();
    try {
      synchronized (session) {
        session.setAttribute("username", username);
      }
      user = LoginManager.getInstance().getUser(username, password,
          session.getId());
      logger.info("User " + user + " logged in successfully");
      response.sendRedirect("home.jsp");
    } catch (UserNotFoundException e) {
      e.printStackTrace();
      response.sendRedirect("index.jsp");
    } catch (IncorrectPasswordException e) {
      e.printStackTrace();
      response.sendRedirect("index.jsp");
    }
    
	}

}
