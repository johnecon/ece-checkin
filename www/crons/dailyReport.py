import datetime
from google.appengine.ext import db
from geo.geomodel import GeoModel
from google.appengine.api import mail


class Checkin(GeoModel):
    id = db.StringProperty(required=True)
    name = db.StringProperty(required=True)
    dateCreated = db.DateTimeProperty()
    webservice = db.StringProperty(required=True)


class Feedback(db.Model):
    name = db.StringProperty(required=True)
    email = db.StringProperty(required=True)
    description = db.StringProperty(required=True, multiline=True)
    dateCreated = db.DateTimeProperty()


def getNewCheckins():
    now = datetime.datetime.now()
    yesterday = now - datetime.timedelta(days=1)
    query = db.GqlQuery("SELECT * FROM Checkin " +
                "WHERE dateCreated > :1 AND dateCreated < :2 ",
                 yesterday, now)
    return query.fetch(100)


def getNewFeedbacks():
    now = datetime.datetime.now()
    yesterday = now - datetime.timedelta(days=1)
    query = db.GqlQuery("SELECT * FROM Feedback " +
                "WHERE dateCreated > :1 AND dateCreated < :2 ",
                 yesterday, now)
    return query.fetch(100)


def getMessageBody():
    checkins = getNewCheckins()
    feedbacks = getNewFeedbacks()
    body = 'Dear EceCheckin Developers!\n'
    body += 'I am glad to announce you...\n'
    if checkins is not None:
        if (len(checkins) != 0):
            body += '\n\nNew Checkins Found!\n'
            for i in range(len(checkins)):
                body += '\nservice: ' + checkins[i].webservice
                body += '\nname: ' + checkins[i].name + '\n'
        else:
            body += '\n\nNo new Checkins Found..'
    else:
        body += '\n\nNo new Checkins Found..'
    if feedbacks is not None:
        if (len(feedbacks) != 0):
            body += '\n\nNew Feedbacks Found!\n'
            for i in range(len(feedbacks)):
                body += '\nname: ' + feedbacks[i].name
                body += '\nemail: ' + feedbacks[i].email + '\n'
                body += '\ndescription: ' + feedbacks[i].description + '\n'
        else:
            body += '\n\nNo new Feedbacks Found..'
    else:
        body += '\n\nNo new Feedbacks Found..'
    return body


message = mail.EmailMessage(sender="<johnnyecon@gmail.com>",
                            subject="Daily Report")

message.to = "<johnnyecon@gmail.com>"
message.body = getMessageBody()
message.send()
