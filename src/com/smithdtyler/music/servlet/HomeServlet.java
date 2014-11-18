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
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.*;

import com.smithdtyler.music.dao.SongDao;
import com.smithdtyler.music.domain.Song;
import com.smithdtyler.security.LoginManager;

/**
 * Servlet implementation class HomeServlet
 */
public class HomeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public HomeServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    if (!LoginManager.getInstance().getActiveUsers()
        .containsKey(request.getSession().getId())) {
      // TODO this still doesn't load correctly - the content is still doubled...
      StringBuilder sb = new StringBuilder();
      sb.append("<p>You need to log in to do that! <a href=\"index.jsp\">login</a></p>");
      response.getWriter().println(sb.toString());
//      response.sendRedirect("index.jsp"); // This has a weird effect - it sort of doubles the page instead of redirecting.
      return;
    }
    List<Song> songs = SongDao.findAllSongs();
    if (songs != null && songs.size() > 0) {
      StringBuilder sb = new StringBuilder();
      sb.append("<html><body><p><ul>");
      for (Song s : songs) {
        sb.append("<li><a href=song.jsp?song_id=" + s.getId() + ">"
            + s.getId() + ": " + s.getName() + "</a></li>");
      }
      sb.append("</ul></p></body></html>");
      response.getWriter().println(sb.toString());
      return;
    } else {
      response.getWriter().println("<p>No songs available</p>");
      return;
    }
  }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
