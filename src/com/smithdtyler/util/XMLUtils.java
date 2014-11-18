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
package com.smithdtyler.util;

import java.io.*;

import javax.xml.parsers.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.xml.sax.*;

/**
 * @author Tyler
 * 
 */
public class XMLUtils {
  /**
   * Get the String representation of the provided Document.
   * 
   * @param doc Document to convert to a String.
   * @return The document in String form.
   * @throws TransformerException
   */
  public static String getXMLString(Document doc) throws TransformerException {
    TransformerFactory transformerfactory = TransformerFactory.newInstance();
    Transformer transformer = transformerfactory.newTransformer();

    Source source = new DOMSource(doc);
    StringWriter stringWriter = new StringWriter();
    Result result = new StreamResult(stringWriter);
    transformer.transform(source, result);
    return stringWriter.getBuffer().toString();
  }

  /**
   * Get the document represented by the provided XML String.
   * 
   * @param xml
   * @return
   * @throws SAXException
   * @throws IOException
   * @throws ParserConfigurationException
   */
  public static Document getDocumentFromXMLString(String xml)
      throws SAXException, IOException, ParserConfigurationException {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    DocumentBuilder builder = factory.newDocumentBuilder();
    InputSource source = new InputSource();
    source.setCharacterStream(new StringReader(xml));
    Document doc = builder.parse(source);
    return doc;
  }
}
