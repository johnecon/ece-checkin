from google.appengine.ext import db
from geo.geomodel import GeoModel
from google.appengine.api import mail


class MixedCheckin(GeoModel):
    dateCreated = db.DateTimeProperty()


class CommunityValidatedCommonPlaceFbFs(GeoModel):
    fbId = db.StringProperty(required=True)
    fbName = db.StringProperty(required=True)
    fbLat = db.StringProperty(required=True)
    fbLon = db.StringProperty(required=True)
    fsId = db.StringProperty(required=True)
    fsName = db.StringProperty(required=True)
    fsLat = db.StringProperty(required=True)
    fsLon = db.StringProperty(required=True)
    counter = db.IntegerProperty(required=True)
    dateCreated = db.DateTimeProperty()


class CommunityValidatedCommonPlaceFsGp(GeoModel):
    fsId = db.StringProperty(required=True)
    fsName = db.StringProperty(required=True)
    fsLat = db.StringProperty(required=True)
    fsLon = db.StringProperty(required=True)
    gpId = db.StringProperty(required=True)
    gpName = db.StringProperty(required=True)
    gpLat = db.StringProperty(required=True)
    gpLon = db.StringProperty(required=True)
    gpRef = db.StringProperty(required=True)
    counter = db.IntegerProperty(required=True)
    dateCreated = db.DateTimeProperty()


class CommunityValidatedCommonPlaceFbGp(GeoModel):
    fbId = db.StringProperty(required=True)
    fbName = db.StringProperty(required=True)
    fbLat = db.StringProperty(required=True)
    fbLon = db.StringProperty(required=True)
    gpId = db.StringProperty(required=True)
    gpName = db.StringProperty(required=True)
    gpLat = db.StringProperty(required=True)
    gpLon = db.StringProperty(required=True)
    gpRef = db.StringProperty(required=True)
    counter = db.IntegerProperty(required=True)
    dateCreated = db.DateTimeProperty()


class CommunityValidatedCommonPlaceFbFsGp(GeoModel):
    fbId = db.StringProperty(required=True)
    fbName = db.StringProperty(required=True)
    fbLat = db.StringProperty(required=True)
    fbLon = db.StringProperty(required=True)
    fsId = db.StringProperty(required=True)
    fsName = db.StringProperty(required=True)
    fsLat = db.StringProperty(required=True)
    fsLon = db.StringProperty(required=True)
    gpId = db.StringProperty(required=True)
    gpName = db.StringProperty(required=True)
    gpLat = db.StringProperty(required=True)
    gpLon = db.StringProperty(required=True)
    gpRef = db.StringProperty(required=True)
    counter = db.IntegerProperty(required=True)
    dateCreated = db.DateTimeProperty()


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


def getMixedCheckins():
    return MixedCheckin.all().count()


def getCheckins():
    return Checkin.all().count()


def getCommonPlaces(type):
    if (type == 'fbFs'):
        return CommunityValidatedCommonPlaceFbFs.all().count()
    elif (type == 'fbGp'):
        return CommunityValidatedCommonPlaceFbGp.all().count()
    elif (type == 'fsGp'):
        return CommunityValidatedCommonPlaceFsGp.all().count()
    elif (type == 'fbFsGp'):
        return CommunityValidatedCommonPlaceFbFsGp.all().count()


def getFeedbacks():
    return Feedback.all().count()


def getMessageBody():
    mixedCheckins = getMixedCheckins()
    checkins = getCheckins()
    fbFsCommonPlaces = getCommonPlaces('fbFs')
    fbGpCommonPlaces = getCommonPlaces('fbGp')
    fsGpCommonPlaces = getCommonPlaces('fsGp')
    fbFsGpCommonPlaces = getCommonPlaces('fbFsGp')
    feedbacks = getFeedbacks()
    body = 'Dear EceCheckin Developers!\n'
    body += 'I present you the statistics of checkin app:\n'
    # body += '\n\nFbCheckins: ' + fbCheckins
    # body += '\n\nFsCheckins: ' + fsCheckins
    body += '\nCheckins: ' + str(checkins)
    body += '\nMixedCheckins: ' + str(mixedCheckins)
    body += '\nFeedbacks: ' + str(feedbacks)
    body += '\nFbFsCommonPlaces: ' + str(fbFsCommonPlaces)
    body += '\nFbGpCommonPlaces: ' + str(fbGpCommonPlaces)
    body += '\nFsGpCommonPlaces: ' + str(fsGpCommonPlaces)
    body += '\nFbFsGpCommonPlaces: ' + str(fbFsGpCommonPlaces)
    return body


message = mail.EmailMessage(sender="<johnnyecon@gmail.com>",
                            subject="Daily Report")

message.to = "<johnnyecon@gmail.com>"
message.body = getMessageBody()
message.send()
