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

import static org.junit.Assert.assertEquals;

import java.security.NoSuchAlgorithmException;

import org.junit.BeforeClass;

import com.smithdtyler.music.dao.*;
import com.smithdtyler.music.domain.*;
import com.smithdtyler.security.HashHelper;

/**
 * @author Tyler
 * 
 */
public class DatabaseAccessTest {

  private static Song songOne = null;
  private static Song songTwo = null;

  private static void setupSongOne() {
    songOne = new Song();
    songOne.setName("Test Song");
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

    note = new Note();
    note.setDuration(Duration.WHOLE);
    note.setPitch(9);
    note.setIndex(128);
    songOne.addNote(note);

    note = new Note();
    note.setDuration(Duration.QUARTER);
    note.setPitch(9);
    note.setIndex(192);
    songOne.addNote(note);

    note = new Note();
    note.setDuration(Duration.HALF);
    note.setPitch(9);
    note.setIndex(208);
    songOne.addNote(note);
  }

  private static void setupSongTwo() {
    songTwo = new Song();
    songTwo.setName("Sweet Home Alabama");
    songTwo.setKey(Key.G);
    songTwo.setTempo(140);

    TimeSignature ts = new TimeSignature();
    ts.setDenominator(4);
    ts.setNumerator(4);
    songTwo.setTimeSignature(ts);

    Note note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(7);
    note.setIndex(0);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(7);
    note.setIndex(8);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(19);
    note.setIndex(16);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(14);
    note.setIndex(20);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(7);
    note.setIndex(28);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(5);
    note.setIndex(32);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(2);
    note.setIndex(36);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(5);
    note.setIndex(40);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(19);
    note.setIndex(48);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.EIGHTH);
    note.setPitch(12);
    note.setIndex(52);
    songTwo.addNote(note);

    note = new Note();
    note.setDuration(Duration.SIXTEENTH);
    note.setPitch(7);
    note.setIndex(60);
    songTwo.addNote(note);
  }

  /**
   * @throws java.lang.Exception
   */
  @BeforeClass
  public static void setUpBeforeClass() throws Exception {
    setupSongOne();
    setupSongTwo();

  }

  // @Test
  public void testSongLoad() {
    SongDao.save(songOne);
    Song s2 = SongDao.findSong(songOne.getId());
    assertEquals(songOne.getName(), s2.getName());
    assertEquals(songOne.getKey(), s2.getKey());
    assertEquals(songOne.getTempo(), s2.getTempo());
    SongDao.save(songTwo);
  }

  // @Test
  public void testUserSave() throws NoSuchAlgorithmException {
    User user = new User();
    user.setEmail("Bill@Test");
    user.setUsername("bill");
    user.setPasswordHash(HashHelper.md5String("test"));
    user.setIsAdmin(false);
    UserDao.save(user);
  }

  // @Test
  public void testUserWithSongs() {
    User tyler = UserDao.findUser(Long.valueOf(2));
    Song song = SongDao.findSong(Long.valueOf(2));
    User_Song us = new User_Song();
    us.setUser(tyler);
    us.setSong(song);
    tyler.getUser_Songs().add(us);
    song.getUser_Songs().add(us);
    User_SongDao.save(us);
  }

  // @Test
  public void testFindUser() {
    User tyler = UserDao.findUser("tyler");
    System.out.println(tyler);
  }

}
