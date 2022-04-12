var admin = require('firebase-admin')

var serviceAccount = require('./family-vc-firebase-firebase-adminsdk-5euz9-dff70c2eaf.json')

if (admin.apps.length == 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })
}
module.exports = admin
