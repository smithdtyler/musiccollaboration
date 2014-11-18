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
 
package com.smithdtyler.music.domain;

import org.w3c.dom.*;

/**
 * @author Tyler
 * 
 */
public class Note extends XMLSerializable implements Comparable<Note> {
  public static final String NOTE_ID_XML = "id";
  public static final String NOTE_XML = "note";
  public static final String PITCH_XML = "pitch";
  public static final String INDEX_XML = "index";
  public static final String DURATION_XML = "duration";

  private Long id;

  /**
   * A representation of the pitch, with 0 being middle C, 1 being C sharp, and
   * so on.
   */
  private int pitch;

  /**
   * Where in the song does this note fall?
   */
  private int index;

  private int duration;

  private Song song;

  @Override
  public void readFromDocument(Document doc) {
    // TODO implement.
  }

  @Override
  public void readFromElement(Element elm) {
    String idString = elm.getAttribute(NOTE_ID_XML);
    if (idString != null && !idString.equals("")) {
      this.id = Long.valueOf(idString);
    } else {
      this.id = null;
    }
    String pitchString = elm.getAttribute(PITCH_XML);
    if (pitchString != null) {
      pitch = Integer.valueOf(pitchString).intValue();
    } else {
      pitch = 0;
    }
    String indexString = elm.getAttribute(INDEX_XML);
    if (indexString != null) {
      index = Integer.valueOf(indexString).intValue();
    } else {
      index = 0;
    }
    String durationString = elm.getAttribute(DURATION_XML);
    if (durationString != null) {
      duration = Integer.valueOf(durationString).intValue();
    } else {
      duration = Duration.QUARTER;
    }

  }

  @Override
  public Element toXMLElement(Document doc) {
    Element note = doc.createElement(NOTE_XML);
    // Before the note has been saved to the database, its id will be null.
    if (id != null) {
      note.setAttribute(NOTE_ID_XML, id.toString());
    }
    note.setAttribute(PITCH_XML, String.valueOf(pitch));
    note.setAttribute(INDEX_XML, String.valueOf(index));
    note.setAttribute(DURATION_XML, String.valueOf(duration));
    return note;
  }

  public int getPitch() {
    return pitch;
  }

  public void setPitch(int pitch) {
    this.pitch = pitch;
  }

  public int getIndex() {
    return index;
  }

  public void setIndex(int index) {
    this.index = index;
  }

  public int getDuration() {
    return duration;
  }

  public void setDuration(int duration) {
    this.duration = duration;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Song getSong() {
    return song;
  }

  public void setSong(Song song) {
    this.song = song;
  }

  @Override
  public String toString() {
    return "Note [pitch=" + pitch + ", index=" + index + ", duration="
        + duration + "]";
  }

  // TODO override equals to act in accordance with compareto.
  // TODO handle collisions better.

  @Override
  public int compareTo(Note other) {
    int oIndex = other.getIndex();
    if (oIndex > index) {
      return -1;
    } else if (oIndex < index) {
      return 1;
    } else if (oIndex == index && pitch > other.getPitch()) {
      return -1;
    } else if (oIndex == index && pitch < other.getPitch()) {
      return 1;
    }
    return 0;
  }

}
