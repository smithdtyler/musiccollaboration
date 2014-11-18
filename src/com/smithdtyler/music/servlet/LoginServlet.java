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
import javax.servlet.http.*;

import org.apache.log4j.Logger;

import com.smithdtyler.music.domain.User;
import com.smithdtyler.security.*;

/**
 * Servlet implementation class LoginServlet
 */
public class LoginServlet extends HttpServlet {
  private static final Logger logger = Logger.getLogger(LoginServlet.class);
  private static final long serialVersionUID = 1L;
  private static final String LOGOUT_KEY = "logout";

  /**
   * @see HttpServlet#HttpServlet()
   */
  public LoginServlet() {
    super();
    // TODO Auto-generated constructor stub
  }

  /**
   * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
   *      response)
   */
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    Map<?, ?> parameters = request.getParameterMap();
    if (parameters.containsKey(LOGOUT_KEY)) {
      try {
        LoginManager.getInstance().getActiveUsers()
            .remove(request.getSession().getId());
        request.getSession().removeAttribute("username");
      } catch (Exception e) {
        logger.warn("unable to log out user");
      }
    }
    response.sendRedirect("index.jsp");
    return;
  }

  /**
   * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
   *      response)
   */
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    logger.info("Received login request");
    Map<?, ?> parameters = request.getParameterMap();
    String username = null;
    String password = null;
    for (Object key : parameters.keySet()) {
      String sKey = (String) key;
      if (sKey.equals("username")) {
        username = request.getParameter(sKey);
      }
      if (sKey.equals("password")) {
        password = request.getParameter(sKey);
      }
    }

    if (username == null || password == null) {
      response.getWriter().println(
          "<p>Sorry, you must be logged in to do that"
              + "</p><p><a href=\"index.jsp\">login</a></p>");
      return;
    }

    HttpSession session = request.getSession();
    try {
      synchronized (session) {
        session.setAttribute("username", username);
      }
      User user = LoginManager.getInstance().getUser(username, password,
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
