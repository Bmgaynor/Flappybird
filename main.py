#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import os
import operator
import webapp2
import jinja2
import json
from google.appengine.ext import ndb
from webapp2_extras import sessions

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    autoescape=True)


#Interigate the session to extract the user except the pass
def buildUser(session):
    user = {
        "username": session["username"],
        "coopscore": session["coopscore"],
        "score": session["score"]
    }
    return user


def addUser(username, password):
    player = Player()
    player.username = username
    player.password = password
    player.coopscore = 0
    player.score = 0
    player.put()
    return player


def updateUser(username, score, coopscore):
    user = getUser(username)
    user.coopscore = coopscore
    user.score = score
    user.put()
    return user


def getUser(username):
    return Player.query().filter(Player.username == username).get()


class Player(ndb.Model):
    username = ndb.StringProperty(indexed=True)
    score = ndb.IntegerProperty(indexed=True)
    coopscore = ndb.IntegerProperty(indexed=True)
    password = ndb.StringProperty(indexed=False)


class BaseHandler(webapp2.RequestHandler):
    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)
        # todo may need to check what page you are going to before sending them to login
        if not (self.request.path_info == "/login" or self.request.path_info == "/"):
            self.checkLogin()
        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
                self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session()

    def checkLogin(self):
        if "username" not in self.session:
            self.redirect("/login")
        else:
            cookieUser = self.session["username"]
            if not cookieUser:
                self.redirect("/login")


class Game(BaseHandler):
    def get(self):
        if "username" not in self.session:
            self.redirect('/login')
        else:
            user = buildUser(self.session)
            username = user['username']
            out = {
                "title": "Duel Flapping",
                "login": username,
                "person": username,
                "user": user,
                "twoplayervs": True
            }
            template = JINJA_ENVIRONMENT.get_template('Game.html')
            self.response.write(template.render(out))


class Homepage(BaseHandler):
    def get(self):
        login = ""
        user = ""
        if "username" not in self.session:
            login = "Login"
        else:
            login = self.session['username']
            user = buildUser(self.session)
        template = JINJA_ENVIRONMENT.get_template('Homepage.html')
        self.response.write(template.render({
            "title": "Flappy Birdy Homepage",
            "login": login,
            "user": user,
            "home": True
        }))


class SingleBird(BaseHandler):
    def get(self):
        if "username" not in self.session:
            self.redirect('/login')
        else:
            user = buildUser(self.session)
            username = user['username']
            out = {
                "title": "Single Player Flapping",
                "login": username,
                "user": user,
                "singlebird": True
            }
            template = JINJA_ENVIRONMENT.get_template('SinglePlayer.html')
            self.response.write(template.render(out))


class Player2Coop(BaseHandler):
    def get(self):
        if "username" not in self.session:
            self.redirect('/login')
        else:
            user = buildUser(self.session)
            username = user['username']
            out = {
                "title": "Coop Flapping",
                "login": username,
                "user": user,
                "coopbird": True
            }
            template = JINJA_ENVIRONMENT.get_template('Player2Coop.html')
            self.response.write(template.render(out))


class ScoreBoard(BaseHandler):
    def get(self):
        if "username" not in self.session:
            self.redirect('/login')
        else:
            user = buildUser(self.session)
            username = user['username']
            template = JINJA_ENVIRONMENT.get_template('ScoreBoard.html')
            #players1 = Player.query().order(-Player.score).fetch(20)
            #players2 = Player.query().order(-Player.coopscore).fetch(20)
            players1 = Player.query().fetch(20)
            players2 = Player.query().fetch(20)

            #players1.sort(key=operator.itemgetter('score'))
            #players2.sort(key=operator.itemgetter('coopscore'))

            template_values = {
                "user": user,
                "login": username,
                'players1': players1,
                'players2': players2,
                'title': "Flappy Birddy Scores",
                'scoreboard': True
            }
            # todo create dictionary of all the scores
            self.response.write(template.render(template_values))


class HandleUpdate(BaseHandler):
    def post(self):
        jsonobject = json.loads(self.request.body)
        self.session['coopscore'] = int(jsonobject['coopscore'])
        self.session['score'] = int(jsonobject['score'])

        updateUser(self.session["username"], self.session['score'], self.session['coopscore'])


class LoginPage(BaseHandler):
    def get(self):
        out = {
            #return a form to add user
        }
        template = JINJA_ENVIRONMENT.get_template('login.html')
        self.response.write(template.render(out))

    def post(self):
        username = self.request.get('inputUsername')
        password = self.request.get('inputPassword')
        player = getUser(username)
        data = {'status': ""}

        if player is not None:
            self.session["username"] = player.username
            if password == player.password:
                self.session["password"] = password
                self.session["score"] = player.score
                self.session["coopscore"] = player.coopscore
                data['status'] = "golden"
            else:
                data['status'] = "invalid Username/Password"
        else:
            self.session["username"] = addUser(username, password).username
            self.session["password"] = password
            self.session["coopscore"] = 0
            self.session["score"] = 0
            data['status'] = "golden"

        self.response.out.headers['Content-Type'] = 'text/json'
        self.response.out.write(json.dumps(data))


class logout(BaseHandler):
    def get(self):
        del self.session['username']
        del self.session['password']
        del self.session['coopscore']
        del self.session['score']
        self.redirect('/')


class createLogin(BaseHandler):
    def get(self):
        out = {
            #return a form to add user
        }
        template = JINJA_ENVIRONMENT.get_template('CreateLogin.html')
        self.response.write(template.render(out))





config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}




app = webapp2.WSGIApplication([
    ('/', Homepage),
    ('/2playerVS', Game),
    ('/SingleBird', SingleBird),
    ('/CoopBird', Player2Coop),
    ('/Scoreboard', ScoreBoard),
    ('/HandleUpdate', HandleUpdate),
    ('/login', LoginPage),
    ('/logout', logout)

], debug=True, config=config)
