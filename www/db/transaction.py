import cgi
import datetime
import simplejson
import urllib
import urllib2
from google.appengine.api import memcache
from google.appengine.ext import db
from geo.geomodel import GeoModel
GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/place/search/json'


def getUrlParameter(arg):
    form = cgi.FieldStorage()
    for i in form.keys():
        if i == arg:
            return form[i].value

transaction = getUrlParameter('transaction')
service = getUrlParameter('service')
currentLat = getUrlParameter('currentLat')
currentLon = getUrlParameter('currentLon')


# class CommunityValidatedCommonPlace(GeoModel):
#     counter = db.IntegerProperty(required=True)
#     dateCreated = db.DateTimeProperty()


# class Place():
#     id = db.StringProperty(required=True)
#     name = db.StringProperty(required=True)
#     webservice = db.StringProperty(required=True)
#     dateCreated = db.DateTimeProperty()

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


class MixedCheckin(GeoModel):
    dateCreated = db.DateTimeProperty()


class FbFsMixedCheckin(GeoModel):
    fsId = db.StringProperty(required=True)
    fsName = db.StringProperty(required=True)
    fbId = db.StringProperty(required=True)
    fbName = db.StringProperty(required=True)
    dateCreated = db.DateTimeProperty()


class FbGpMixedCheckin(GeoModel):
    gpId = db.StringProperty(required=True)
    gpName = db.StringProperty(required=True)
    fbId = db.StringProperty(required=True)
    fbName = db.StringProperty(required=True)
    dateCreated = db.DateTimeProperty()


class FsGpMixedCheckin(GeoModel):
    fsId = db.StringProperty(required=True)
    fsName = db.StringProperty(required=True)
    gpId = db.StringProperty(required=True)
    gpName = db.StringProperty(required=True)
    dateCreated = db.DateTimeProperty()


class FbFsGpMixedCheckin(GeoModel):
    gpId = db.StringProperty(required=True)
    gpName = db.StringProperty(required=True)
    fsId = db.StringProperty(required=True)
    fsName = db.StringProperty(required=True)
    fbId = db.StringProperty(required=True)
    fbName = db.StringProperty(required=True)
    dateCreated = db.DateTimeProperty()


class Feedback(db.Model):
    name = db.StringProperty(required=True)
    email = db.StringProperty(required=True)
    description = db.StringProperty(required=True, multiline=True)
    dateCreated = db.DateTimeProperty()


def readFromModel(model):
    if (model == 'FbFsGp'):
        return CommunityValidatedCommonPlaceFbFsGp
    elif (model == 'FbGp'):
        return CommunityValidatedCommonPlaceFbGp
    elif (model == 'FsGp'):
        return CommunityValidatedCommonPlaceFsGp
    elif (model == 'FbFs'):
        return CommunityValidatedCommonPlaceFbFs


def fetchRecordsFromDb(service):
    model = readFromModel(service)
    return model.proximity_fetch(
        model.all(),
        db.GeoPt(float(currentLat), float(currentLon)),
        max_results=10,
        max_distance=500)  # Within 500 m.


def getRecords(service):
    records = memcache.get(service + currentLat[0:7] + currentLon[0:7])
    if records is not None:
        return records
    else:
        records = fetchRecordsFromDb(service)
        memcache.add(service + currentLat[0:7] + currentLon[0:7], records, 3600)
        return records


if (transaction == 'write'):
    if (service == 'Facebook'):
        fbCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
             id=getUrlParameter('fbId'),
             name=getUrlParameter('fbName').decode('utf-8'),
             webservice='Facebook')

        fbCheckin.dateCreated = datetime.datetime.now()
        fbCheckin.update_location()
        fbCheckin.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'Foursquare'):
        fsCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))),
             id=getUrlParameter('fsId'),
             name=getUrlParameter('fsName').decode('utf-8'),
             webservice='Foursquare')
        fsCheckin.dateCreated = datetime.datetime.now()
        fsCheckin.update_location()
        fsCheckin.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'GoogleP'):
        gpCheckin = Checkin(location=db.GeoPt(getUrlParameter('gpLat'), getUrlParameter('gpLon')),
             id=getUrlParameter('gpId'),
             name=getUrlParameter('gpName').decode('utf-8'),
             webservice='GooglePlus')
        gpCheckin.dateCreated = datetime.datetime.now()
        gpCheckin.update_location()
        gpCheckin.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'MixedFbFs'):
        fbFsMixedCheckin = MixedCheckin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))))
        fbFsMixedCheckin.dateCreated = datetime.datetime.now()
        fbFsMixedCheckin.update_location()
        fbFsMixedCheckin.put()

        fsCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))),
             id=getUrlParameter('fsId'),
             name=getUrlParameter('fsName').decode('utf-8'),
             webservice='Foursquare',
             parent=fbFsMixedCheckin)
        fsCheckin.dateCreated = datetime.datetime.now()
        fsCheckin.update_location()
        fsCheckin.put()

        fbCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
             id=getUrlParameter('fbId'),
             name=getUrlParameter('fbName').decode('utf-8'),
             webservice='Facebook',
             parent=fbFsMixedCheckin)
        fbCheckin.dateCreated = datetime.datetime.now()
        fbCheckin.update_location()
        fbCheckin.put()

        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'MixedFbGp'):
        fbGpMixedCheckin = MixedCheckin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))))
        fbGpMixedCheckin.dateCreated = datetime.datetime.now()
        fbGpMixedCheckin.update_location()
        fbGpMixedCheckin.put()

        gpCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('gpLat')), float(getUrlParameter('gpLon'))),
             id=getUrlParameter('gpId'),
             name=getUrlParameter('gpName').decode('utf-8'),
             webservice='GooglePlus',
             parent=fbGpMixedCheckin)
        gpCheckin.dateCreated = datetime.datetime.now()
        gpCheckin.update_location()
        gpCheckin.put()

        fbCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
             id=getUrlParameter('fbId'),
             name=getUrlParameter('fbName').decode('utf-8'),
             webservice='Facebook',
             parent=fbGpMixedCheckin)
        fbCheckin.dateCreated = datetime.datetime.now()
        fbCheckin.update_location()
        fbCheckin.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'MixedFsGp'):
        fsGpMixedCheckin = MixedCheckin(location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))))
        fsGpMixedCheckin.dateCreated = datetime.datetime.now()
        fsGpMixedCheckin.update_location()
        fsGpMixedCheckin.put()

        gpCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('gpLat')), float(getUrlParameter('gpLon'))),
             id=getUrlParameter('gpId'),
             name=getUrlParameter('gpName').decode('utf-8'),
             webservice='GooglePlus',
             parent=fsGpMixedCheckin)
        gpCheckin.dateCreated = datetime.datetime.now()
        gpCheckin.update_location()
        gpCheckin.put()

        fsCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))),
             id=getUrlParameter('fsId'),
             name=getUrlParameter('fsName').decode('utf-8'),
             webservice='Foursquare',
             parent=fsGpMixedCheckin)
        fsCheckin.dateCreated = datetime.datetime.now()
        fsCheckin.update_location()
        fsCheckin.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'MixedFbFsGp'):
        fbFsGpMixedCheckin = MixedCheckin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))))
        fbFsGpMixedCheckin.dateCreated = datetime.datetime.now()
        fbFsGpMixedCheckin.update_location()
        fbFsGpMixedCheckin.put()

        gpCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('gpLat')), float(getUrlParameter('gpLon'))),
             id=getUrlParameter('gpId'),
             name=getUrlParameter('gpName').decode('utf-8'),
             webservice='GooglePlus',
             parent=fbFsGpMixedCheckin)
        gpCheckin.dateCreated = datetime.datetime.now()
        gpCheckin.update_location()
        gpCheckin.put()

        fsCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))),
             id=getUrlParameter('fsId'),
             name=getUrlParameter('fsName').decode('utf-8'),
             webservice='Foursquare',
             parent=fbFsGpMixedCheckin)
        fsCheckin.dateCreated = datetime.datetime.now()
        fsCheckin.update_location()
        fsCheckin.put()

        fbCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
             id=getUrlParameter('fbId'),
             name=getUrlParameter('fbName').decode('utf-8'),
             webservice='Facebook',
             parent=fbFsGpMixedCheckin)
        fbCheckin.dateCreated = datetime.datetime.now()
        fbCheckin.update_location()
        fbCheckin.put()

        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'MultiFbFsGp'):
        fbCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
             id=getUrlParameter('fbId'),
             name=getUrlParameter('fbName').decode('utf-8'),
             webservice='Facebook')
        fbCheckin.update_location()
        fbCheckin.dateCreated = datetime.datetime.now()
        fbCheckin.put()

        gpCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('gpLat')), float(getUrlParameter('gpLon'))),
             id=getUrlParameter('gpId'),
             name=getUrlParameter('gpName').decode('utf-8'),
             webservice='GooglePlus')
        gpCheckin.dateCreated = datetime.datetime.now()
        gpCheckin.update_location()
        gpCheckin.put()

        fsCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))),
             id=getUrlParameter('fsId'),
             name=getUrlParameter('fsName').decode('utf-8'),
             webservice='Foursquare')
        fsCheckin.update_location()
        fsCheckin.dateCreated = datetime.datetime.now()
        fsCheckin.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'MultiFbFs'):
        fbCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
             id=getUrlParameter('fbId'),
             name=getUrlParameter('fbName').decode('utf-8'),
             webservice='Facebook')
        fbCheckin.update_location()
        fbCheckin.dateCreated = datetime.datetime.now()
        fbCheckin.put()

        fsCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))),
             id=getUrlParameter('fsId'),
             name=getUrlParameter('fsName').decode('utf-8'),
             webservice='Foursquare')
        fsCheckin.update_location()
        fsCheckin.dateCreated = datetime.datetime.now()
        fsCheckin.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'MultiFbGp'):
        fbCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
             id=getUrlParameter('fbId'),
             name=getUrlParameter('fbName').decode('utf-8'),
             webservice='Facebook')
        fbCheckin.update_location()
        fbCheckin.dateCreated = datetime.datetime.now()
        fbCheckin.put()

        gpCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('gpLat')), float(getUrlParameter('gpLon'))),
             id=getUrlParameter('gpId'),
             name=getUrlParameter('gpName').decode('utf-8'),
             webservice='GooglePlus')
        gpCheckin.dateCreated = datetime.datetime.now()
        gpCheckin.update_location()
        gpCheckin.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'MultiFsGp'):
        fsCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))),
             id=getUrlParameter('fsId'),
             name=getUrlParameter('fsName').decode('utf-8'),
             webservice='Foursquare')
        fsCheckin.update_location()
        fsCheckin.dateCreated = datetime.datetime.now()
        fsCheckin.put()

        gpCheckin = Checkin(location=db.GeoPt(float(getUrlParameter('gpLat')), float(getUrlParameter('gpLon'))),
             id=getUrlParameter('gpId'),
             name=getUrlParameter('gpName').decode('utf-8'),
             webservice='GooglePlus')
        gpCheckin.dateCreated = datetime.datetime.now()
        gpCheckin.update_location()
        gpCheckin.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'communityValidateFbFsGp'):
        records = CommunityValidatedCommonPlaceFbFs.gql(
            "WHERE fbId = :1 AND fsId = :2", getUrlParameter('fbId'), getUrlParameter('fsId'))
        if (len(records.fetch(10))):
            for record in records:
                record.counter = record.counter + 1
                record.put()
        else:
            communityValidatedCommonPlaceFbFs = CommunityValidatedCommonPlaceFbFs(
                location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
                fsId=getUrlParameter('fsId'),
                fsName=getUrlParameter('fsName').decode('utf-8'),
                fsLat=getUrlParameter('fsLat'),
                fsLon=getUrlParameter('fsLon'),
                fbId=getUrlParameter('fbId'),
                fbName=getUrlParameter('fbName').decode('utf-8'),
                fbLat=getUrlParameter('fbLat'),
                fbLon=getUrlParameter('fbLon'),
                counter=1)
            communityValidatedCommonPlaceFbFs.update_location()
            communityValidatedCommonPlaceFbFs.dateCreated = datetime.datetime.now()
            communityValidatedCommonPlaceFbFs.put()
        records = CommunityValidatedCommonPlaceFsGp.gql(
            "WHERE fsId = :1 AND gpId = :2", getUrlParameter('fsId'), getUrlParameter('gpId'))
        if (len(records.fetch(10))):
            for record in records:
                record.counter = record.counter + 1
                record.put()
        else:
            communityValidatedCommonPlaceFsGp = CommunityValidatedCommonPlaceFsGp(
                location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))),
                fsId=getUrlParameter('fsId'),
                fsName=getUrlParameter('fsName').decode('utf-8'),
                fsLat=getUrlParameter('fsLat'),
                fsLon=getUrlParameter('fsLon'),
                gpId=getUrlParameter('gpId'),
                gpName=getUrlParameter('gpName').decode('utf-8'),
                gpLat=getUrlParameter('gpLat'),
                gpLon=getUrlParameter('gpLon'),
                gpRef=getUrlParameter('gpRef'),
                counter=1)
            communityValidatedCommonPlaceFsGp.update_location()
            communityValidatedCommonPlaceFsGp.dateCreated = datetime.datetime.now()
            communityValidatedCommonPlaceFsGp.put()
        records = CommunityValidatedCommonPlaceFbGp.gql(
            "WHERE fbId = :1 AND gpId = :2", getUrlParameter('fbId'), getUrlParameter('gpId'))
        if (len(records.fetch(10))):
            for record in records:
                record.counter = record.counter + 1
                record.put()
        else:
            communityValidatedCommonPlaceFbGp = CommunityValidatedCommonPlaceFbGp(
                location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
                fbId=getUrlParameter('fbId'),
                fbName=getUrlParameter('fbName').decode('utf-8'),
                fbLat=getUrlParameter('fbLat'),
                fbLon=getUrlParameter('fbLon'),
                gpId=getUrlParameter('gpId'),
                gpName=getUrlParameter('gpName').decode('utf-8'),
                gpLat=getUrlParameter('gpLat'),
                gpLon=getUrlParameter('gpLon'),
                gpRef=getUrlParameter('gpRef'),
                counter=1)
            communityValidatedCommonPlaceFbGp.update_location()
            communityValidatedCommonPlaceFbGp.dateCreated = datetime.datetime.now()
            communityValidatedCommonPlaceFbGp.put()
        records = CommunityValidatedCommonPlaceFbFsGp.gql(
            "WHERE fbId = :1 AND fsId = :2 AND gpId = :3", getUrlParameter('fbId'), getUrlParameter('fsId'), getUrlParameter('gpId'))
        if (len(records.fetch(10))):
            for record in records:
                record.counter = record.counter + 1
                record.put()
        else:
            communityValidatedCommonPlaceFbFsGp = CommunityValidatedCommonPlaceFbFsGp(
                location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
                fsId=getUrlParameter('fsId'),
                fsName=getUrlParameter('fsName').decode('utf-8'),
                fsLat=getUrlParameter('fsLat'),
                fsLon=getUrlParameter('fsLon'),
                fbId=getUrlParameter('fbId'),
                fbName=getUrlParameter('fbName').decode('utf-8'),
                fbLat=getUrlParameter('fbLat'),
                fbLon=getUrlParameter('fbLon'),
                gpId=getUrlParameter('gpId'),
                gpName=getUrlParameter('gpName').decode('utf-8'),
                gpLat=getUrlParameter('gpLat'),
                gpLon=getUrlParameter('gpLon'),
                gpRef=getUrlParameter('gpRef'),
                counter=1)
            communityValidatedCommonPlaceFbFsGp.update_location()
            communityValidatedCommonPlaceFbFsGp.dateCreated = datetime.datetime.now()
            communityValidatedCommonPlaceFbFsGp.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'communityValidateFbFs'):
        records = CommunityValidatedCommonPlaceFbFs.gql(
            "WHERE fbId = :1 AND fsId = :2", getUrlParameter('fbId'), getUrlParameter('fsId'))
        if (len(records.fetch(10))):
            for record in records:
                record.counter = record.counter + 1
                record.put()
        else:
            communityValidatedCommonPlaceFbFs = CommunityValidatedCommonPlaceFbFs(
                location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
                fsId=getUrlParameter('fsId'),
                fsName=getUrlParameter('fsName').decode('utf-8'),
                fsLat=getUrlParameter('fsLat'),
                fsLon=getUrlParameter('fsLon'),
                fbId=getUrlParameter('fbId'),
                fbName=getUrlParameter('fbName').decode('utf-8'),
                fbLat=getUrlParameter('fbLat'),
                fbLon=getUrlParameter('fbLon'),
                counter=1)
            communityValidatedCommonPlaceFbFs.update_location()
            communityValidatedCommonPlaceFbFs.dateCreated = datetime.datetime.now()
            communityValidatedCommonPlaceFbFs.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'communityValidateFsGp'):
        records = CommunityValidatedCommonPlaceFsGp.gql(
            "WHERE fsId = :1 AND gpId = :2", getUrlParameter('fsId'), getUrlParameter('gpId'))
        if (len(records.fetch(10))):
            for record in records:
                record.counter = record.counter + 1
                record.put()
        else:
            communityValidatedCommonPlaceFsGp = CommunityValidatedCommonPlaceFsGp(
                location=db.GeoPt(float(getUrlParameter('fsLat')), float(getUrlParameter('fsLon'))),
                fsId=getUrlParameter('fsId'),
                fsName=getUrlParameter('fsName').decode('utf-8'),
                fsLat=getUrlParameter('fsLat'),
                fsLon=getUrlParameter('fsLon'),
                gpId=getUrlParameter('gpId'),
                gpName=getUrlParameter('gpName').decode('utf-8'),
                gpLat=getUrlParameter('gpLat'),
                gpLon=getUrlParameter('gpLon'),
                gpRef=getUrlParameter('gpRef'),
                counter=1)
            communityValidatedCommonPlaceFsGp.update_location()
            communityValidatedCommonPlaceFsGp.dateCreated = datetime.datetime.now()
            communityValidatedCommonPlaceFsGp.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
    elif (service == 'communityValidateFbGp'):
        records = CommunityValidatedCommonPlaceFbGp.gql(
            "WHERE fbId = :1 AND gpId = :2", getUrlParameter('fbId'), getUrlParameter('gpId'))
        if (len(records.fetch(10))):
            for record in records:
                record.counter = record.counter + 1
                record.put()
        else:
            communityValidatedCommonPlaceFbGp = CommunityValidatedCommonPlaceFbGp(
                location=db.GeoPt(float(getUrlParameter('fbLat')), float(getUrlParameter('fbLon'))),
                fbId=getUrlParameter('fbId'),
                fbName=getUrlParameter('fbName').decode('utf-8'),
                fbLat=getUrlParameter('fbLat'),
                fbLon=getUrlParameter('fbLon'),
                gpId=getUrlParameter('gpId'),
                gpName=getUrlParameter('gpName').decode('utf-8'),
                gpLat=getUrlParameter('gpLat'),
                gpLon=getUrlParameter('gpLon'),
                gpRef=getUrlParameter('gpRef'),
                counter=1)
            communityValidatedCommonPlaceFbGp.update_location()
            communityValidatedCommonPlaceFbGp.dateCreated = datetime.datetime.now()
            communityValidatedCommonPlaceFbGp.put()
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({})'
elif (transaction == 'readFbFsGp'):
#    stringQuery = "SELECT * FROM CommunityValidatedCommonPlaceFbFsGp"
#    query = db.GqlQuery(stringQuery)
    fbFsGpRecords = getRecords('FbFsGp')
    if fbFsGpRecords is not None:
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({'
        print '"data": ['
        for i in range(len(fbFsGpRecords)):
            print '{"fbName": "' + fbFsGpRecords[i].fbName.encode('utf-8') + '",'
            print '"fsName": "' + fbFsGpRecords[i].fsName.encode('utf-8') + '",'
            print '"gpName": "' + fbFsGpRecords[i].gpName.encode('utf-8') + '",'
            print '"counter": "' + str(fbFsGpRecords[i].counter) + '",'
            print '"fbId": "' + fbFsGpRecords[i].fbId + '",'
            print '"fsId": "' + fbFsGpRecords[i].fsId + '",'
            print '"gpId": "' + fbFsGpRecords[i].gpId + '",'
            print '"fbLat": "' + fbFsGpRecords[i].fbLat + '",'
            print '"fbLon": "' + fbFsGpRecords[i].fbLon + '",'
            print '"gpLat": "' + fbFsGpRecords[i].gpLat + '",'
            print '"gpLon": "' + fbFsGpRecords[i].gpLon + '",'
            print '"gpRef": "' + fbFsGpRecords[i].gpRef + '",'
            print '"fsLat": "' + fbFsGpRecords[i].fsLat + '",'
            print '"fsLon": "' + fbFsGpRecords[i].fsLon + '"}'
            if (i != (len(fbFsGpRecords) - 1)):
                print ','
        print ']})'
    else:
        print 'Content-Type: application/json\n'
        print 'Ext.util.JSONP.callback({'
        print '"data": []})'
elif (transaction == 'readFbFs'):
#    stringQuery = "SELECT * FROM CommunityValidatedCommonPlaceFbFs"
#    query = db.GqlQuery(stringQuery)
    fbFsRecords = getRecords('FbFs')
#    records = query.fetch(100)
    print 'Content-Type: application/json\n'
    print 'Ext.util.JSONP.callback({'
    print '"data": ['
    for i in range(len(fbFsRecords)):
        print '{"fbName": "' + fbFsRecords[i].fbName.encode('utf-8') + '",'
        print '"fsName": "' + fbFsRecords[i].fsName.encode('utf-8') + '",'
        print '"counter": "' + str(fbFsRecords[i].counter) + '",'
        print '"fbId": "' + fbFsRecords[i].fbId + '",'
        print '"fsId": "' + fbFsRecords[i].fsId + '",'
        print '"fbLat": "' + fbFsRecords[i].fbLat + '",'
        print '"fbLon": "' + fbFsRecords[i].fbLon + '",'
        print '"fsLat": "' + fbFsRecords[i].fsLat + '",'
        print '"fsLon": "' + fbFsRecords[i].fsLon + '"}'
        if (i != (len(fbFsRecords) - 1)):
            print ','
    print ']})'
elif (transaction == 'readFsGp'):
#    stringQuery = "SELECT * FROM CommunityValidatedCommonPlaceFsGp"
#    query = db.GqlQuery(stringQuery)
    fsGpRecords = getRecords('FsGp')
#    records = query.fetch(100)
    print 'Content-Type: application/json\n'
    print 'Ext.util.JSONP.callback({'
    print '"data": ['
    for i in range(len(fsGpRecords)):
        print '{"gpName": "' + fsGpRecords[i].gpName.encode('utf-8') + '",'
        print '"fsName": "' + fsGpRecords[i].fsName.encode('utf-8') + '",'
        print '"counter": "' + str(fsGpRecords[i].counter) + '",'
        print '"gpId": "' + fsGpRecords[i].gpId + '",'
        print '"gpRef": "' + fsGpRecords[i].gpRef + '",'
        print '"fsId": "' + fsGpRecords[i].fsId + '",'
        print '"gpLat": "' + fsGpRecords[i].gpLat + '",'
        print '"gpLon": "' + fsGpRecords[i].gpLon + '",'
        print '"fsLat": "' + fsGpRecords[i].fsLat + '",'
        print '"fsLon": "' + fsGpRecords[i].fsLon + '"}'
        if (i != (len(fsGpRecords) - 1)):
            print ','
    print ']})'
elif (transaction == 'readFbGp'):
#    stringQuery = "SELECT * FROM CommunityValidatedCommonPlaceFbGp"
#    query = db.GqlQuery(stringQuery)
    fbGpRecords = getRecords('FbGp')
#    records = query.fetch(100)
    print 'Content-Type: application/json\n'
    print 'Ext.util.JSONP.callback({'
    print '"data": ['
    for i in range(len(fbGpRecords)):
        print '{"gpName": "' + fbGpRecords[i].gpName.encode('utf-8') + '",'
        print '"fbName": "' + fbGpRecords[i].fbName.encode('utf-8') + '",'
        print '"counter": "' + str(fbGpRecords[i].counter) + '",'
        print '"gpId": "' + fbGpRecords[i].gpId + '",'
        print '"gpRef": "' + fbGpRecords[i].gpRef + '",'
        print '"fbId": "' + fbGpRecords[i].fbId + '",'
        print '"gpLat": "' + fbGpRecords[i].gpLat + '",'
        print '"gpLon": "' + fbGpRecords[i].gpLon + '",'
        print '"fbLat": "' + fbGpRecords[i].fbLat + '",'
        print '"fbLon": "' + fbGpRecords[i].fbLon + '"}'
        if (i != (len(fbGpRecords) - 1)):
            print ','
    print ']})'
elif (transaction == 'getGpPlaces'):
    def geocode(sensor, location, radius, key, **geo_args):
        geo_args.update({
            'sensor': sensor,
            'location': location,
            'radius': radius,
            'key': key
        })

        url = GEOCODE_BASE_URL + '?' + urllib.urlencode(geo_args)
        result = simplejson.load(urllib.urlopen(url))
        print ''
        print 'Ext.util.JSONP.callback('
        print simplejson.dumps(result, indent=2)
        print ')'

    if __name__ == '__main__':
        geocode(sensor="true", location=currentLat + ',' + currentLon, radius="500", key='AIzaSyDB6Oie4_LoSI4PAEG-uO2mZIvLwvCh8KQ')
elif (transaction == 'postGpCheckin'):
    url = 'https://maps.googleapis.com/maps/api/place/check-in/json?sensor=true&key=AIzaSyDB6Oie4_LoSI4PAEG-uO2mZIvLwvCh8KQ'
    data = {'reference': getUrlParameter('reference')}

    jsonData = simplejson.dumps(data)
    req = urllib2.Request(url, jsonData)
    response = urllib2.urlopen(req)
    the_page = response.read()
    print ''
    print 'Ext.util.JSONP.callback('
    print the_page
    print ')'
elif (transaction == 'feedback'):
    feedback = Feedback(name=getUrlParameter('name').decode('utf-8'),
        email=getUrlParameter('email').decode('utf-8'),
        description=getUrlParameter('description').decode('utf-8'))
    feedback.dateCreated = datetime.datetime.now()
    feedback.put()

    print ''
    print 'Ext.util.JSONP.callback({})'
elif (transaction == 'getGeoLocation'):
    url = 'https://maps.googleapis.com/maps/api/browserlocation/json?browser=' + getUrlParameter('browserName') + '&sensor=true'
    result = simplejson.load(urllib.urlopen(url))
    print ''
    print 'Ext.util.JSONP.callback('
    print simplejson.dumps(result, indent=2)
    print ')'
