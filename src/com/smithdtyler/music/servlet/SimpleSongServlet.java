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
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.*;

import org.apache.log4j.Logger;

import com.smithdtyler.music.dao.*;
import com.smithdtyler.music.domain.*;
import com.smithdtyler.security.LoginManager;

/**
 * Servlet implementation class SimpleSongServlet
 * Provides basic functionality for saving, reading, and updating songs.
 * Data is sent via HTML and XML.
 */
public class SimpleSongServlet extends HttpServlet {
  private static final Logger logger = Logger.getLogger(SimpleSongServlet.class);
  private static final long serialVersionUID = 1L;
  private static final String SONG_ID_KEY = "song_id";
  private static final String SONG_SAVE_KEY = "save";
  private static final String SONG_DELETE_KEY = "delete_song_id";
  private static final String ALL_SONGS_KEY = "get_all_songs";
  private static final String NEW_SONG_KEY = "new";

  /**
   * @see HttpServlet#HttpServlet()
   */
  public SimpleSongServlet() {
    super();
    // TODO Auto-generated constructor stub
  }

  /**
   * Handle GET requests. Such requests do not modify persistent data.
   * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
   *      response)
   */
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    logger.debug("Received get request");

    // Check if the user is signed in
    User user = LoginManager.getInstance().getActiveUsers()
        .get(request.getSession().getId());
    if (user == null) {
      response.sendRedirect("index.jsp");
      return;
    }

    // TODO check access to this song
    Map<?, ?> parameters = request.getParameterMap();
    if (parameters.containsKey(NEW_SONG_KEY)) {
      TimeSignature ts = new TimeSignature();
      ts.setDenominator(4);
      ts.setNumerator(4);
      // TODO find the time signature - don't create one every time.
      Song s = new Song();
      s.setName("New Song");
      s.setKey(Key.C);
      s.setTimeSignature(ts);
      SongDao.save(s);
      Long songId = s.getId();
      User_Song us = new User_Song();
      us.setUser(user);
      us.setSong(s);
      User_SongDao.save(us);
      response.sendRedirect("song.jsp?song_id=" + songId);
      return;
    } else if (parameters.containsKey(SONG_ID_KEY)) {
      String number = request.getParameter(SONG_ID_KEY);
      Long songId = -1L;
      if (number != null) {
        songId = Long.valueOf(number);
      }
      if (songId == -1L) {
        logger.warn("Error parsing parameters, song not found");
      } else {
        Song song = SongDao.findSong(songId);
        if(song != null){
          String xmlString = song.toXMLString();
          if(logger.isTraceEnabled()){
            logger.trace("Returning song XML: " + xmlString);   
          }
          response.getWriter().println(xmlString);
          return;          
        } else {
          logger.warn("Song " + songId + " not found");
          // TODO return 500 error.
          return;
        }
      }
    } else if (parameters.containsKey(ALL_SONGS_KEY)) {
      List<User_Song> user_songs = User_SongDao.findAllUser_SongsForUser(user);
      if (user_songs != null && user_songs.size() > 0) {
        StringBuilder sb = new StringBuilder();
        sb.append("<table border=\"1\">");
        sb.append("<tr>");
        sb.append("<td>Name</td>");
        sb.append("<td>Key</td>");
        sb.append("<td>Tempo</td>");
        sb.append("<td>Time Signature</td>");
        sb.append("<td>Options</td>");
        sb.append("</tr>");
        for (User_Song us : user_songs) {
          sb.append("<tr>");
          sb.append("<td><a href=song.jsp?song_id=" + us.getSong().getId()
              + " target=\"_blank\">" + us.getSong().getName()
              + "</a></td>");
          sb.append("<td>" + us.getSong().getKey() + "</td>");
          sb.append("<td>" + us.getSong().getTempo() + "</td>");
          sb.append("<td>" + us.getSong().getTimeSignature() + "</td>");
          sb.append("<td><a href=SimpleSongServlet?delete_song_id=" + us.getSong().getId() +"> delete </a></td>");
          sb.append("</tr>");
        }
        sb.append("</table>");
        sb.append("<p><a href=SimpleSongServlet?new>New Song</a></p>");
        response.getWriter().println(sb.toString());

        return;
      } else {
        response.getWriter().println("<p>No songs available</p>");
        response.getWriter().println(
            "<p><a href=\"SimpleSongServlet?new\" target=\"_blank\">New Song</a></p>");
        return;
      }
    } else if (parameters.containsKey(SONG_DELETE_KEY)) {
      String number = request.getParameter(SONG_DELETE_KEY);
      Long songId = -1L;
      if (number != null) {
        songId = Long.valueOf(number);
      }
      if (songId == -1L) {
        logger.warn("Error parsing parameters, song not found");
        return;
      }
      if (logger.isInfoEnabled()) {
        logger.info("Deleting song " + songId);
      }
      SongDao.deleteSong(songId);
      response.sendRedirect("home.jsp");
      return;
    }
  }

  /**
   * Handle a POST request. POST requests may modify persistent data.
   * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
   *      response)
   */
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    logger.debug("Received post request");
    if (!LoginManager.getInstance().getActiveUsers()
        .containsKey(request.getSession().getId())) {
      response.sendRedirect("index.jsp");
      return;
    }
    @SuppressWarnings("rawtypes")
    Map parameters = request.getParameterMap();
    if (parameters.containsKey(SONG_SAVE_KEY)) {
      String xml = request.getParameter(SONG_SAVE_KEY);
      Song song = new Song();
      if(logger.isTraceEnabled()){
        logger.trace("Saving song with XML: " + xml);
      }
      song.readFromXMLString(xml);
      if (song.getId() != null && song.getId() >= 0) {
        SongDao.save(song);
        // Sending the song back here is a little unnecessary, but the "save" request
        // expects a response, and we will likely want to update information
        // on the server side.
        String xmlString = song.toXMLString();
        if(logger.isTraceEnabled()){
          logger.trace("Returning song XML: " + xmlString);   
        }
        response.getWriter().println(xmlString);
        return;
      } else {
        // right now the web client assigns new songs an id of -1
        song.setId(null);
        SongDao.save(song);
        // Now that we have an id, send it back to the server
        String xmlString = song.toXMLString();
        if(logger.isTraceEnabled()){
          logger.trace("Returning song XML: " + xmlString);   
        }
        response.getWriter().println(xmlString);
        return;
      }
    }
  }

}
