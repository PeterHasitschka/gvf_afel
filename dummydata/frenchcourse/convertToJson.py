#!/usr/bin/python3
import json
from json.decoder import JSONArray

print("Converter")


class Converter:
    STUDENT_ID = '_studentId'
    RESOURCE_ID = '_resourceId'
    ACTION_TYPE = '_actionType'

    ACTION_TYPE_ANSWER = 'ANSWER'
    ACTION_TYPE_ATTEMPT = 'ATTEMPT'

    MAX_LINES = None
    MAX_RESOURCES = 100
    MAX_LEARNERS = 100
    MAX_ACTIVITIES = 50000

    def __init__(self):
        self.csvFile = './ds74_tx_All_Data_65_2015_0729_175736.txt.csv'
        self.outLearners = './learners.json'
        self.outResources = './resources.json'
        self.outActivities = './activities.json'

        self.fieldKeys = {
            Converter.STUDENT_ID: 'Anon Student Id',
            Converter.ACTION_TYPE: 'Student Response Type',
            Converter.RESOURCE_ID: 'Problem Name'
        }

        self.alreadyRegisteredPairs = {}

        self.header = None

        self.data = {
            'resources': [],
            'learners': [],
            'activities': []
        }

    def convert(self):
        with open(self.csvFile) as f:
            content = f.read()

        contentlines = content.split('\n')
        content = None

        self.header = contentlines[0].split('\t')

        contentlines.pop(0)

        linesgonethrough = 0
        for line in contentlines:

            if Converter.MAX_LINES is not None and linesgonethrough >= Converter.MAX_LINES:
                break

            fields = line.split('\t')

            actiontype = self.getField(fields, Converter.ACTION_TYPE)
            if actiontype != Converter.ACTION_TYPE_ATTEMPT:
                continue

            self.registerAction(fields)

            linesgonethrough += 1

        learners = self.data.get('learners')
        resources = self.data.get('resources')
        activities = self.data.get('activities')

        print("=> Learners:{0}\n=> Resources:{1}\n=> Activties:{2}".format(
            len(learners),
            len(resources),
            len(activities)
        ))

        with open(self.outLearners, "w") as lfile:
            lfile.write(json.dumps(learners))
        with open(self.outResources, "w") as rfile:
            rfile.write(json.dumps(resources))
        with open(self.outActivities, "w") as afile:
            afile.write(json.dumps(activities))

    def getField(self, fields, key):
        i = 0
        for fieldHeader in self.header:
            if self.fieldKeys[key] == fieldHeader:
                return fields[i]
            i += 1

    def registerAction(self, fields):

        student = self.getLearner(self.getField(fields, Converter.STUDENT_ID))

        if student is False:
            return False

        resource = self.getResource(self.getField(fields, Converter.RESOURCE_ID))

        if resource is False:
            return False

        activities = self.data.get('activities')

        # Check if already exists
        # print(self.alreadyRegisteredPairs, student.get('id'), (student.get('id') in self.alreadyRegisteredPairs))
        if (student.get('id') in self.alreadyRegisteredPairs) is True:
            if (resource.get('id') in self.alreadyRegisteredPairs.get(student.get('id'))) is True:
                return True

        action = {
            'id': len(activities),
            'type': 'learning',
            'learner_id': student.get('id'),
            'resource_id': resource.get('id'),
        }

        if student.get('id') not in self.alreadyRegisteredPairs:
            self.alreadyRegisteredPairs[student.get('id')] = []
        self.alreadyRegisteredPairs[student.get('id')].append(resource.get('id'))

        if len(activities) < Converter.MAX_ACTIVITIES:
            activities.append(action)
        return True

    def getLearner(self, learnername):
        data = self.data.get('learners')
        for learner in data:
            if learner.get('name') == learnername:
                return learner

        if len(self.data.get('learners')) >= Converter.MAX_LEARNERS:
            return False

        newid = len(data)
        newlearner = {
            'id': newid,
            'name': learnername
        }
        data.append(newlearner)
        return newlearner

    def getResource(self, resourcename):
        data = self.data.get('resources')
        for resource in data:
            if resource.get('title') == resourcename:
                return resource

        if len(self.data.get('resources')) >= Converter.MAX_RESOURCES:
            return False

        newid = len(data)
        newresource = {
            'id': newid,
            'title': resourcename
        }
        data.append(newresource)
        return newresource


# %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



converter = Converter()
converter.convert()
