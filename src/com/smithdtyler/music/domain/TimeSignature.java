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
 * @author Tyler
 * 
 */
public class TimeSignature extends XMLSerializable {
  public static final String TIME_SIGNATURE_ID_XML = "id";
  public static final String TIME_SIGNATURE_XML = "time_signature";
  public static final String NUMERATOR_XML = "numerator";
  public static final String DENOMINATOR_XML = "denominator";

  private Long id;
  private int numerator;
  private int denominator;
  private Set<Song> songs = new HashSet<Song>();

  @Override
  public void readFromDocument(Document doc) {
    // TODO implement
  }

  @Override
  public void readFromElement(Element elm) {
    String idString = elm.getAttribute(TIME_SIGNATURE_ID_XML);
    if (idString != null && !idString.equals("")) {
      this.id = Long.valueOf(idString);
    } else {
      this.id = null;
    }
    String numeratorString = elm.getAttribute(NUMERATOR_XML);
    if (numeratorString != null) {
      this.numerator = Integer.valueOf(numeratorString).intValue();
    }
    String denominatorString = elm.getAttribute(DENOMINATOR_XML);
    if (denominatorString != null) {
      this.denominator = Integer.valueOf(denominatorString).intValue();
    }
  }

  @Override
  public Element toXMLElement(Document doc) {
    Element ts = doc.createElement(TIME_SIGNATURE_XML);
    // Before the Time Signature has been saved to the database, its id will
    // be null.
    if (id != null) {
      ts.setAttribute(TIME_SIGNATURE_ID_XML, id.toString());
    }
    ts.setAttribute(NUMERATOR_XML, String.valueOf(numerator));
    ts.setAttribute(DENOMINATOR_XML, String.valueOf(denominator));
    return ts;
  }

  public int getNumerator() {
    return numerator;
  }

  public void setNumerator(int numerator) {
    this.numerator = numerator;
  }

  public int getDenominator() {
    return denominator;
  }

  public void setDenominator(int denominator) {
    this.denominator = denominator;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Set<Song> getSongs() {
    return songs;
  }

  public void setSongs(Set<Song> songs) {
    this.songs = songs;
  }

  @Override
  public String toString() {
    return new String(numerator + "/"
        + denominator);
  }

}
