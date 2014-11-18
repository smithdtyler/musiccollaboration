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

import org.hibernate.*;
import org.hibernate.cfg.Configuration;

/**
 * Use this class to get a Hibernate {@link Session}
 * 
 * @author Tyler
 * 
 */
public class SessionManager {
  private static SessionFactory sessionFactory;

  @SuppressWarnings("deprecation")
  public static synchronized SessionFactory getSessionFactory() {
    if (sessionFactory == null) {
      Configuration configuration = new Configuration().configure();
      // TODO figure out why this is deprecated
      sessionFactory = configuration.buildSessionFactory();
    }
    return sessionFactory;
  }

  public static Session getSession() {
    return getSessionFactory().openSession();
  }

}