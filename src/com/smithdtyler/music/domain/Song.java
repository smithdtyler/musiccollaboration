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

import java.util.*;

import org.w3c.dom.*;

/**
 * <p>
 * Class representing a song.
 * </p>
 * <p>
 * <b>Example XML Serialization of a Song</b>
 * </p>
 * 
 * <pre>
 * &lt;?xml version="1.0" encoding="UTF-8" standalone="no"?&gt;
 * &lt;song id="1" key="A_FLAT" name="test" tempo="100"&gt;
 *  &lt;time_signature denominator="4" id="4" numerator="2"/&gt;
 *  &lt;note duration="EIGHTH" pitch="14" id="5" index="0"/&gt;
 *  &lt;note duration="WHOLE" pitch="16" id="6" index="1"/&gt;
 * &lt;/song&gt;
 * </pre>
 * 
 * @author Tyler
 * 
 */
public class Song extends XMLSerializable {
  public static final String SONG_ID_XML = "id";
  public static final String SONG_XML = "song";
  public static final String NAME_XML = "name";
  public static final String KEY_XML = "key";
  public static final String TEMPO_XML = "tempo";

  private Long id;
  private SortedSet<Note> notes = new TreeSet<Note>();
  private String name;
  private TimeSignature timeSignature;
  private Key key;
  private Set<User_Song> user_Songs;

  /**
   * Beats per minute
   */
  private int tempo;

  @Override
  public void readFromDocument(Document doc) {
    NodeList songNodes = doc.getElementsByTagName(SONG_XML);
    Element song = (Element) songNodes.item(0);
    if (song != null) {
      readFromElement(song);
    }
  }

  @Override
  public void readFromElement(Element elm) {
    this.name = elm.getAttribute(NAME_XML);
    String idString = elm.getAttribute(SONG_ID_XML);
    if (idString != null && !idString.equals("")) {
      this.id = Long.valueOf(idString);
    } else {
      this.id = null;
    }
    String keyString = elm.getAttribute(KEY_XML);
    if (keyString != null) {
      this.key = Key.valueOf(keyString);
    } else {
      this.key = Key.C;
    }
    String tempoString = elm.getAttribute(TEMPO_XML);
    if (tempoString != null) {
      this.tempo = Integer.valueOf(tempoString).intValue();
    } else {
      this.tempo = 0;
    }
    this.timeSignature = null;
    TimeSignature ts = new TimeSignature();
    NodeList ts_nodes = elm
        .getElementsByTagName(TimeSignature.TIME_SIGNATURE_XML);
    Node ts_node = ts_nodes.item(0);
    if (ts_node != null) {
      ts.readFromElement((Element) ts_node);
      this.timeSignature = ts;
    }
    this.notes.clear();
    NodeList note_nodes = elm.getElementsByTagName(Note.NOTE_XML);
    for (int i = 0; i < note_nodes.getLength(); i++) {
      Note note = new Note();
      note.readFromElement((Element) note_nodes.item(i));
      addNote(note);
    }
  }

  @Override
  public Element toXMLElement(Document doc) {
    Element song = doc.createElement(SONG_XML);
    song.setAttribute(NAME_XML, name);
    // Before the Song has been saved to the database, its id will be null.
    if (id != null) {
      song.setAttribute(SONG_ID_XML, id.toString());
    }
    song.setAttribute(KEY_XML, key.toString());
    song.setAttribute(TEMPO_XML, String.valueOf(tempo));
    if (timeSignature != null) {
      song.appendChild(timeSignature.toXMLElement(doc));
    }
    for (Note note : notes) {
      if (note != null) {
        song.appendChild(note.toXMLElement(doc));
      }
    }
    return song;
  }

  public SortedSet<Note> getNotes() {
    return notes;
  }

  public void addNote(Note note) {
    this.notes.add(note);
    note.setSong(this);
  }

  public void setNotes(SortedSet<Note> notes) {
    this.notes = notes;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public TimeSignature getTimeSignature() {
    return timeSignature;
  }

  public void setTimeSignature(TimeSignature timeSignature) {
    this.timeSignature = timeSignature;
  }

  public Key getKey() {
    return key;
  }

  public void setKey(Key key) {
    this.key = key;
  }

  public int getTempo() {
    return tempo;
  }

  public void setTempo(int tempo) {
    this.tempo = tempo;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Override
  public String toString() {
    return "Song [name=" + name + ", timeSignature=" + timeSignature + ", key="
        + key + ", tempo=" + tempo + "]";
  }

  public void setUser_Songs(Set<User_Song> user_Songs) {
    this.user_Songs = user_Songs;
  }

  public Set<User_Song> getUser_Songs() {
    return user_Songs;
  }

}
