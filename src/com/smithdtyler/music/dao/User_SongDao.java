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
import org.hibernate.criterion.Restrictions;

import com.smithdtyler.music.domain.*;

/**
 * @author Tyler
 *
 */
public class User_SongDao {
  public static final Logger logger = Logger.getLogger(User_SongDao.class);

  /**
   * @param song The User_Song to save.
   */
  public static void save(User_Song user_song) {
    if (logger.isDebugEnabled()) {
      logger.debug("Saving user_song: " + user_song);
    }
    Session session = SessionManager.getSession();
    Transaction tx = session.beginTransaction();
    session.saveOrUpdate(user_song);
    tx.commit();
    session.close();
  }

  public static User_Song findUser_Song(Long user_songId) {
    if (logger.isDebugEnabled()) {
      logger.debug("Looking for a user with id " + user_songId);
    }
    Session session = SessionManager.getSession();
    User_Song user_song = (User_Song) session.get(User_Song.class, user_songId);
    if (user_song == null) {
      session.close();
      return null;
    }
    session.close();
    return user_song;
  }

  public static List<User_Song> findAllUser_SongsForUser(User user) {
    Session session = SessionManager.getSession();
    if (logger.isDebugEnabled()) {
      logger.debug("Retrieving all songs for user " + user);
    }
    Criteria crit = session.createCriteria(User_Song.class);
    crit.setMaxResults(50);
    crit.add(Restrictions.eq("user", user));
    crit.list();
    @SuppressWarnings("unchecked")
    List<User_Song> list = crit.list();
    session.close();
    return list;
  }
}
