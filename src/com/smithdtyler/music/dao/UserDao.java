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

package com.smithdtyler.music.dao;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.*;

import com.smithdtyler.music.domain.User;

public class UserDao {
  public static final Logger logger = Logger.getLogger(UserDao.class);

  /**
   * @param song The User to save.
   */
  public static void save(User user) {
    if (logger.isDebugEnabled()) {
      logger.debug("Saving user: " + user);
    }
    Session session = SessionManager.getSession();
    Transaction tx = session.beginTransaction();
    session.saveOrUpdate(user);
    tx.commit();
    session.close();
  }

  public static User findUser(Long userId) {
    if (logger.isDebugEnabled()) {
      logger.debug("Looking for a user with id " + userId);
    }
    Session session = SessionManager.getSession();
    User user = (User) session.get(User.class, userId);
    if (user == null) {
      session.close();
      return null;
    }
    Hibernate.initialize(user.getUser_Songs());
    session.close();
    return user;
  }

  public static User findUser(String username) {
    if (logger.isDebugEnabled()) {
      logger.debug("Looking for a user with username " + username);
    }
    Session session = SessionManager.getSession();
    Query query = session.createQuery("from User where username = :username");
    query.setParameter("username", username);
    @SuppressWarnings("unchecked")
    List<User> list = query.list();
    if (list == null || list.size() < 1) {
      session.close();
      return null;
    }
    User user = list.get(0);
    Hibernate.initialize(user.getUser_Songs());
    session.close();
    return user;
  }

}
