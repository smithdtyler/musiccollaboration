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
package com.smithdtyler.security;

import java.security.MessageDigest;

/**
 * @author Tyler
 *
 */
public class HashHelper {
  public static String md5String(String input) {
    try {
    MessageDigest algorithm = MessageDigest.getInstance("MD5");
    byte[] outputBytes = null;
    // Not clear exactly how 'getInstance' works, let's not trust that it's
    // thread safe.
    synchronized (algorithm) {
      algorithm.reset();
      outputBytes = algorithm.digest(input.getBytes());
    }
    StringBuilder sb = new StringBuilder();
    for (byte b : outputBytes) {
      sb.append(String.format("%x", b));
    }
    return sb.toString();
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }
}