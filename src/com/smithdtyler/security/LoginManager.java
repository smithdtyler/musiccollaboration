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

import java.util.*;

import com.smithdtyler.music.dao.UserDao;
import com.smithdtyler.music.domain.User;

/**
 * @author Tyler
 *
 */
public class LoginManager {
  private volatile static LoginManager INSTANCE;
  private final Map<String, User> activeUsers;

  private LoginManager() {
    activeUsers = new HashMap<String, User>();
  }

  /**
   * IBM griping about this approach:
   * http://www.ibm.com/developerworks/java/library/j-dcl/index.html
   * 
   * @return
   */
  public static LoginManager getInstance() {
    // First check, since locking is expensive
    if (INSTANCE == null) {
      // Try to get the lock
      synchronized (LoginManager.class) {
        // Somebody could have already assigned it, so check again.
        if (INSTANCE == null) {
          INSTANCE = new LoginManager();
        }
      }
    }
    return INSTANCE;
  }

  public User getUser(String username, String password, String sessionId)
      throws UserNotFoundException, IncorrectPasswordException {
    // Hit the cache first
    User u = activeUsers.get(sessionId);
    if (u != null) {
      return u;
    }
    // If we haven't loaded this user yet, read them from the database.
    u = UserDao.findUser(username);
    if (u == null) {
      throw new UserNotFoundException();
    }
    String pswHash;
    pswHash = HashHelper.md5String(password);
    if (!pswHash.equals(u.getPasswordHash())) {
      throw new IncorrectPasswordException();
    }
    activeUsers.put(sessionId, u);
    return u;
  }

  public Map<String, User> getActiveUsers() {
    return activeUsers;
  }

}