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

import java.io.IOException;

import javax.xml.parsers.*;
import javax.xml.transform.TransformerException;

import org.w3c.dom.*;
import org.xml.sax.SAXException;

import com.smithdtyler.util.XMLUtils;

/**
 * Classes extending XMLSerializable can be written to and read from XML Strings
 * and Documents.
 * 
 * @author Tyler
 * 
 */
public abstract class XMLSerializable {

  /**
   * When implementing this method, the <code>doc</code> parameter should be
   * used to create a new Element. The new Element should <i>not</i> be added to
   * the Document within the scope of this method, but simply returned (this is
   * because the new Element is not necessarily a root Element in the Document).
   * 
   * @param doc Document to use for creating a new Element.
   * @return
   */
  public abstract Element toXMLElement(Document doc);

  /**
   * Populate the fields of this XMLSerializable from an XML Element.
   * 
   * @param elm
   */
  public abstract void readFromElement(Element elm);

  /**
   * Populate the fields of this XMLSerializable from an XML Document.
   * 
   * @param doc
   */
  public abstract void readFromDocument(Document doc);

  /**
   * Populate the fields of this XMLSerializable by parsing the provided String.
   * 
   * @param xml String to parse
   */
  public void readFromXMLString(String xml) {
    try {
      Document doc = XMLUtils.getDocumentFromXMLString(xml);
      readFromDocument(doc);
    } catch (IOException e) {
      e.printStackTrace();
    } catch (SAXException e) {
      e.printStackTrace();
    } catch (ParserConfigurationException e) {
      e.printStackTrace();
    }
  }

  /**
   * Create an XML Document from this XMLSerializable
   * 
   * @return
   */
  public Document toXMLDocument() {
    try {
      DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
      Document doc = factory.newDocumentBuilder().newDocument();
      doc.appendChild(toXMLElement(doc));
      return doc;
    } catch (ParserConfigurationException e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * Serialize this XMLSerializable to an XML String
   * 
   * @return
   */
  public String toXMLString() {
    try {
      return XMLUtils.getXMLString(toXMLDocument());
    } catch (TransformerException e) {
      e.printStackTrace();
    }
    return null;
  }
}
