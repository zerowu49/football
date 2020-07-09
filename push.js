var webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BL-ZidiTfjLlA-zWgzPOXONeNIR58NVPaImfqwNw8MbqGMCDrilvJUZ2iTxgL5PQDKoOaKxNcPb6O2ybmoa6O0c",
   "privateKey": "wR8s7yogshQR3i4dKMYWrigPFhAYCPB6xEUSgYUaWmg"
};


webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/f-bjo7c74Ew:APA91bFAPDvTOIcieyHQaz_06tsy4gM5-C4pBG71SR-FRZaV_R36n9UsH7bJVO6MVv8Mf26OTaXlhh55leZ_mcj20bWG4PiSGCvxEwL6oBNMHDTgbkpJA3Hq84c1Wb1d0BRjiyADg7X1",
   "keys": {
      "p256dh": "BBIRDzUgoweGcnXVIqfTQdGtop+PQt8EXyACvTCWdd4JdQMjouPNaVfg01MeIlE70HDuydJ4ugROwkrLbaSI82w=",
      "auth": "Djbs8T+dhxK66DxSFYdZeA=="
   }
};
var payload = 'Selamat menggunakan Aplikasi PWA Football Score!';

var options = {
   gcmAPIKey: '495585133814',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);