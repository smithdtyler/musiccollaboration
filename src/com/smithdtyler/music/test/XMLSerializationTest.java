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

import java.util.Iterator;

import org.junit.Test;

import com.smithdtyler.music.domain.*;

/**
 * This class has tests for serializing and deserializing domain objects with
 * XML
 * 
 * @author Tyler
 */
public class XMLSerializationTest {
  @Test
  public void testSongSerialization() {
    Song song = new Song();
    song.setId(Long.valueOf(1L));
    song.setName("test");
    song.setKey(Key.A_FLAT);
    song.setTempo(100);
    TimeSignature ts = new TimeSignature();
    ts.setId(4L);
    ts.setDenominator(4);
    ts.setNumerator(2);
    song.setTimeSignature(ts);

    Note note = new Note();
    note.setId(5L);
    note.setDuration(Duration.EIGHTH);
    note.setPitch(44);
    note.setIndex(0);
    song.addNote(note);

    note = new Note();
    note.setId(6L);
    note.setDuration(Duration.WHOLE);
    note.setPitch(34);
    note.setIndex(1);
    song.addNote(note);

    String output = song.toXMLString();
    System.out.println(output);

    Song dSong = new Song();
    dSong.readFromXMLString(output);
    // System.out.println(dSong);
    assertEquals(dSong.getId(), song.getId());
    assertEquals(dSong.getName(), song.getName());
    assertEquals(dSong.getKey(), song.getKey());
    assertEquals(dSong.getTempo(), song.getTempo());
    assertEquals(dSong.getTimeSignature().getId(), song.getTimeSignature()
        .getId());
    assertEquals(dSong.getTimeSignature().getNumerator(), song
        .getTimeSignature().getNumerator());
    assertEquals(dSong.getTimeSignature().getDenominator(), song
        .getTimeSignature().getDenominator());
    Iterator<Note> iter = song.getNotes().iterator();
    Iterator<Note> dIter = dSong.getNotes().iterator();
    while (iter.hasNext() || dIter.hasNext()) {
      Note dNote = iter.next();
      Note sNote = dIter.next();
      assertEquals(dNote.getId(), sNote.getId());
      assertEquals(dNote.getDuration(), sNote.getDuration());
      assertEquals(dNote.getPitch(), sNote.getPitch());
      assertEquals(dNote.getIndex(), sNote.getIndex());
    }
  }
}
