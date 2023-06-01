/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/*
  Função de exemplo do Firebase.
*/
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

/*
  Nossas Funções.
*/
// Import and initialize the Firebase Admin SDK.
const admin = require("firebase-admin");
// Import the Firebase SDK for Google Cloud Functions.
const functions = require("firebase-functions");
// Import Scheduller GCP
// const {PubSub} = require("@google-cloud/pubsub");

admin.initializeApp({credential: admin.credential.cert(require("./pdm-aulas-797c8-c2380437b21d.json"))});

/*
  Atenção: Esta função só funciona em Produção (por que o agendamento é feito pelo GCP).
  Segundo a documentação atual do Firebase, Cloud Pub/Sub não funciona no emulador local.
  Fonte: https://firebase.google.com/docs/emulator-suite?hl=pt-br
*/
// envia regularmente notificações para engajar na campanha "admin"
exports.scheduledAdminNotification = functions.pubsub
    .schedule("every thursday 13:20")
    .timeZone("America/Sao_Paulo") // Users can choose timezone - default is America/Los_Angeles
    .onRun(async (context) => {
      const payload = {
        notification: {
          title: "Campanha admin",
          body: "Teste de um schedule no Cloud Function para envio de notificações.",
        },
        data: {
          route: "admin",
        },
      };

      try {
        const response = await admin
            .messaging()
            .sendToTopic("admin", payload);
        console.log("Notification sent successfully:", response);
      } catch (error) {
        console.error("Notification sent failed:", error);
      }
      return null;
    });

/*
  Atenção: Esta função só funciona em Produção (por que o agendamento é feito pelo GCP).
  Segundo a documentação atual do Firebase, Cloud Pub/Sub não funciona no emulador local.
  Fonte: https://firebase.google.com/docs/emulator-suite?hl=pt-br
*/
// envia regularmente notificações para engajar na campanha "admin"
exports.scheduledUserNotification = functions.pubsub
    .schedule("every thursday 13:20")
    .timeZone("America/Sao_Paulo") // Users can choose timezone - default is America/Los_Angeles
    .onRun(async (context) => {
      const payload = {
        notification: {
          title: "Campanha user",
          body: "Teste de um schedule no Cloud Function para envio de notificações.",
        },
        data: {
          route: "user",
        },
      };

      try {
        const response = await admin
            .messaging()
            .sendToTopic("user", payload);
        console.log("Notification sent successfully:", response);
      } catch (error) {
        console.error("Notification sent failed:", error);
      }
      return null;
    });

// Simulação de envio de Notification pelo Firestore local (tópico admin)
exports.firestoreReactionAdmin = functions.firestore
    .document("sendNotification/admin")
    .onUpdate(async (event) => {
      console.log("Event do documento admin=");
      console.log(event);
      console.log("Dados do documento admin=");
      console.log(event.after._fieldsProto.send);
      if (event.after._fieldsProto.send.booleanValue === true) {
        console.log("**********************");
        console.log("Simulou o envio manual de uma notification para o tópico admin");
        console.log("**********************");
      }
      return true;
    });

// Simulação de envio de Notification pelo Firestore local (tópico admin)
exports.firestoreReactionUser = functions.firestore
    .document("sendNotification/user")
    .onUpdate(async (event) => {
      console.log("Event do documento user=");
      console.log(event);
      console.log("Dados do documento user=");
      console.log(event.after._fieldsProto.send);
      if (event.after._fieldsProto.send.booleanValue === true) {
        console.log("**********************");
        console.log("Simulou o envio manual de uma notification para o tópico user");
        console.log("**********************");
      }
      return true;
    });

/*
  Funções Utilitárias
*/
// const pubsub = new PubSub({
//   projectId: "pdm-aulas-797c8",
//   apiEndpoint: "localhost:8432", // Change it to your PubSub emulator address and port
// });

// setInterval(async () => {
//   const SCHEDULED_FUNCTION_TOPIC = "scheduledUserNotification";
//   console.log(`Trigger sheduled function via PubSub topic: ${SCHEDULED_FUNCTION_TOPIC}`);
//   const msg = await pubsub.topic(SCHEDULED_FUNCTION_TOPIC).publishJSON({
//     foo: "bar",
//   }, {attr1: "value1"});
//   console.log(msg);
// }, 10 * 1000); // 1000 = 1s

// setInterval(async () => {
//   const SCHEDULED_FUNCTION_TOPIC = "myScheduledFunctionCode";
//   console.log(`Trigger sheduled function via PubSub topic: ${SCHEDULED_FUNCTION_TOPIC}`);
// }, 5 * 1000); // 1000 = 1s
