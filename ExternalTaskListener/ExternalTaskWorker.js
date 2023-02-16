//pokretanje: node ExternalTaskWorker.js

import { Client, logger, Variables } from "camunda-external-task-client-js";
import { Headers } from "node-fetch";

import fetch from "node-fetch";

import https from 'https';

const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

const client = new Client(config);


const apiUrl = `https://localhost:7237/api/SignalRealTime`;
const notificationUrl = apiUrl + `/notify`;


client.subscribe("sensor_check", async function( {task, taskService})  {


    console.log("Got to sensor status");


    //httpGET


    //disable SSL verification which API requires

    const httpsAgent = new https.Agent({

        rejectUnauthorized: false,

    });

    console.log(apiUrl);


    fetch(apiUrl, {

        method: 'GET',

        agent: httpsAgent,

      })

      .then( async (success) =>

      {

        console.log("Success sensor status");

        let isWorking = await success.text();

        console.log("isWorking " + isWorking);

        const processVariables = new Variables()

            .set("isWorking", isWorking);


        // complete the task

        try {

            await taskService.complete(task, processVariables);

            console.log("I completed my task successfully!!");

        } catch (e) {

            console.error(`Failed completing my task, ${e}`);

        }

      })

      .catch(err => console.log( "Error while fetching " + err));



});


client.subscribe("send_mail", async function( {task, taskService})  {

    //httpPOSTNotify + sensorid + alert

    console.log("Got to send_mail");

    let header = new Headers();

    header.set("Content-Type", "application/json");

    console.log('test');


    let sensorId = task.businessKey;

    let message = "Alert! Sensor with the serial number " + sensorId + " is not functional. Please check the sensor";


    console.log("Message "+ message + " " + sensorId);


    //disable SSL verification which API requires

    const httpsAgent = new https.Agent({

        rejectUnauthorized: false,

    });


    let params = { method: 'POST', body: JSON.stringify( { "SensorID": sensorId, "Message": message  } ), headers: header, agent: httpsAgent};


    fetch(notificationUrl, params)

    .then( async (success) =>

    {

        console.log("Success send alert");

        let alertSent = await success.text();

        console.log("Alert sent: " + alertSent);

        // complete the task

        try {

            await taskService.complete(task);

            console.log("I completed my task successfully!!");

        } catch (e) {

            console.error(`Failed completing my task, ${e}`);

        }

    })

    .catch(err => console.log( "Error while fetching " + err));



});


//1. user presses button Check sensor


//2. click triggers function which sends POST request to start checking process, POST carries sensorId which is saved in business key of the started process


//3. ExternalTaskWorker is on all the time in background, will catch when the first external task sensor-status becomes active, and will

//at that point make GET request to get sensor functionality variable, boolean isWorking as true or false

//the fetched variable is set for the task, to allow the process determine which way to go next, and the task is completed


//4. The process moves on either to end or to the second external task, at which point ExternalTaskWorker catches it and sens POST to notify endpoint,

//which then via hub alerts frontend that email needs to be sent, frontend sends email - POST carries sensorId and message, which need to be defined in ExternalTaskWorker

//and will be carried to backend, then to frontend (sensorId we get in ExternalTaskWorker from business key of the active process))


//of course, the question is why even send POST to backend, when we could just send email as soon as the second external task is caught here... - but since this script is

//separate from frontend, can't access mail services defined in frontend - this script deals only with the access to Camunda process & sending requests to backend


//5. frontend sends email alert
