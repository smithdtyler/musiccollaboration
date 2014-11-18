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

import com.smithdtyler.music.domain.*;

/**
 * Servlet implementation class ExampleSongServlet
 */
public class ExampleSongServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;
  public static final String EXAMPLE_SONG_KEY = "example_song";
  private static Song song1;
  private static Song song2;
  static {
    song1 = new Song();
    song2 = new Song();
    setSampleData1(song1);
    setSampleData2(song2);
  }

  /**
   * @see HttpServlet#HttpServlet()
   */
  public ExampleSongServlet() {
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
    System.out.println("Received request");
    @SuppressWarnings("rawtypes")
    Map parameters = request.getParameterMap();
    if (parameters.containsKey(EXAMPLE_SONG_KEY)) {
      // String xml = song1.toXMLString();
      // response.getWriter().println(xml);
      // return;

      String number = request.getParameter(EXAMPLE_SONG_KEY);
      int example = -1;
      if (number != null) {
        example = Integer.valueOf(number).intValue();
      }
      if (example == -1) {
        System.out.println("Error parsing parameteres");
      } else if (example == 1) {
        String xml = song1.toXMLString();
        response.getWriter().println(xml);
        return;
      } else if (example == 2) {
        String xml = song2.toXMLString();
        response.getWriter().println(xml);
        return;
      }
      return;
    }
  }

  /**
   * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
   *      response)
   */
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    // TODO Auto-generated method stub
  }

  private static void setSampleData1(Song song) {
    song.setName("Test Song");
    song.setKey(Key.A_FLAT);
    song.setTempo(100);
    TimeSignature ts = new TimeSignature();
    ts.setDenominator(4);
    ts.setNumerator(2);
    song.setTimeSignature(ts);

    Note note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(8);
    note.setIndex(0);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.WHOLE);
    note.setPitch(9);
    note.setIndex(1);
    song.addNote(note);
  }

  private static void setSampleData2(Song song) {
    song.setName("Sweet Home Alabama");
    song.setKey(Key.G);
    song.setTempo(140);
    TimeSignature ts = new TimeSignature();
    ts.setDenominator(4);
    ts.setNumerator(4);
    song.setTimeSignature(ts);

    Note note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(7);
    note.setIndex(0);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(7);
    note.setIndex(8);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(19);
    note.setIndex(16);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(14);
    note.setIndex(20);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(7);
    note.setIndex(28);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(5);
    note.setIndex(32);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(2);
    note.setIndex(36);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(5);
    note.setIndex(40);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(19);
    note.setIndex(48);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(12);
    note.setIndex(52);
    song.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(7);
    note.setIndex(60);
    song.addNote(note);
  }

}
