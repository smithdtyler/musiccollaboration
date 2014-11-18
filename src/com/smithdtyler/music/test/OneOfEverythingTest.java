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
package com.smithdtyler.music.test;

import org.junit.*;

import com.smithdtyler.music.dao.SongDao;
import com.smithdtyler.music.domain.*;


/**
 * @author Tyler
 *
 */
public class OneOfEverythingTest {
  private static Song songOne = null;
  private static Song songTwo = null;

  /**
   * @throws java.lang.Exception
   */
  @BeforeClass
  public static void setUpBeforeClass() throws Exception {
    createSongOne();
    createSongTwo();
  }

  @Test
  public void testSongLoad() {
    SongDao.save(songOne);
    SongDao.save(songTwo);
  }

  private static void createSongOne() {
    songOne = new Song();
    songOne.setName("One of everything song");
    songOne.setKey(Key.A_FLAT);
    songOne.setTempo(100);
    TimeSignature ts = new TimeSignature();
    ts.setDenominator(4);
    ts.setNumerator(2);
    songOne.setTimeSignature(ts);

    Note note = new Note();
    note.setDuration(Duration.WHOLE);
    note.setPitch(8);
    note.setIndex(0);
    songOne.addNote(note);

    // implied whole rest

    note = new Note();
    note.setDuration(Duration.HALF);
    note.setPitch(9);
    note.setIndex(128);
    songOne.addNote(note);

    // implied half rest

    note = new Note();
    note.setDuration(Duration.QUARTER);
    note.setPitch(10);
    note.setIndex(192);
    songOne.addNote(note);

    // implied quarter rest

    note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(10);
    note.setIndex(224);
    songOne.addNote(note);

    // implied eighth rest

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(10);
    note.setIndex(240);
    songOne.addNote(note);

    // implied sixteenth rest

    note = new Note();
    note.setDuration(Duration.THIRYSECOND);
    note.setPitch(10);
    note.setIndex(248);
    songOne.addNote(note);

    // implied ThirtySecond rest

    note = new Note();
    note.setDuration(Duration.THIRYSECOND);
    note.setPitch(10);
    note.setIndex(252);
    songOne.addNote(note);
  }

  private static void createSongTwo() {
    songTwo = new Song();
    songTwo.setName("Chromatic Scale");
    songTwo.setKey(Key.C);
    songTwo.setTempo(100);
    TimeSignature ts = new TimeSignature();
    ts.setDenominator(4);
    ts.setNumerator(4);
    songTwo.setTimeSignature(ts);

    int currentIndex = 0;

    for (int i = 0; i < 13; i++) {
      Note note = new Note();
      note.setDuration(Duration.QUARTER);
      note.setPitch(i);
      note.setIndex(currentIndex);
      songTwo.addNote(note);
      currentIndex += Duration.QUARTER;
    }
  }
}
