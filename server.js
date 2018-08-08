//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express(); 

// Body Parser Middleware
app.use(bodyParser.json()); 

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initiallising connection string
var dbConfig = {
    user: 'development',
    password: 'Dev@2018',
    server: 'chatbotdev.database.windows.net', 
    database: 'dev',
    //user: 'manish',
    //password: 'Effective1?',
    //server: 'cancens.database.windows.net', 
    //database: 'manish-test',
    options: {
        encrypt: true
      }
};

//Function to connect to database and execute query
var  executeQuery = function(res, query,callback){     
    sql.close();        
     sql.connect(dbConfig, function (err) {
         if (err) {   
                     console.log("Error while connecting database :- " + err);
                     res.send(err);
                  }
                  else {
                         // create Request object
                         var request = new sql.Request();
                         // query to the database
                         request.query(query, function (err, result) {
                            if (err) {
                            console.log('Error while querying database :- ' + err);
                            callback(err, null);
                            }
                            else {
                            //res.send(result);
                            callback(null, result);
                            }
                            });
                       }
      });           
}

//GET API
app.get("/api/webhook", function(req , res){
                var query = "select * from PersonalTable";
                executeQuery (res, query,function(err, result){
                    console.log(result.rowsAffected);
                    res.send(result);
                });
                
});

//POST API
 app.post("/api/webhook", function(req , res){
                
                if(req.body.queryResult.action == 'input.welcome'){
                    console.log('you are into Welcome! captured session id: ' + req.body.session);
                    var query = "INSERT INTO PersonalTable (SessionId) VALUES ('" + req.body.session + "')";
                    executeQuery (res, query,function(err, result){
                        console.log(result.rowsAffected);
                    });
                }
                
                //This is a test action 

                else if(req.body.queryResult.action == 'test-action'){
                    res.json( 
                        

                          {
                            "fulfillmentText": "This is a text response",
                            "fulfillmentMessages": [
                                {
                                    "platform": "SLACK",
                                    "card": {
                                      "title": "Title: this is a title",
                                      "subtitle": "This is an subtitle.  Text can include unicode characters including emoji 📱.",
                                      "imageUri": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                                      "buttons": [
                                        {
                                          "text": "This is a button",
                                          "postback": "https://assistant.google.com/"
                                        }
                                      ]
                                    }
                                  },
                              {
                                "platform": "FACEBOOK",
                                "card": {
                                  "title": "Title: this is a title",
                                  "subtitle": "This is an subtitle.  Text can include unicode characters including emoji 📱.",
                                  "imageUri": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                                  "buttons": [
                                    {
                                      "text": "This is a button",
                                      "postback": "https://assistant.google.com/"
                                    }
                                  ]
                                }
                              },
                              {
                                "text": {
                                    "text": [
                                    "Text defined in Dialogflow's console for the intent that was matched"
                                  ]
                                }
                              }
                            ]
                          }





                        // {
                        //     "fulfillmentText": "This is a text response",
                        //     "fulfillmentMessages": [],
                        //     "source": "example.com",
                        //     "payload": {
                        //         "google": {
                        //             "expectUserResponse": true,
                        //             "richResponse": {
                        //                 "items": [
                        //                     {
                        //                         "simpleResponse": {
                        //                             "textToSpeech": "This is a Basic Card:"
                        //                         }
                        //                     },
                        //                     {
                        //                         "basicCard": {
                        //                             "title": "card title",
                        //                             "image": {
                        //                                 "url": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                        //                                 "accessibilityText": "Google Logo"
                        //                             },
                        //                             "buttons": [
                        //                                 {
                        //                                     "title": "Button Title",
                        //                                     "openUrlAction": {
                        //                                         "url": "https://www.google.com"
                        //                                     }
                        //                                 }
                        //                             ],
                        //                             "imageDisplayOptions": "WHITE"
                        //                         }
                        //                     }
                        //                 ]
                        //             }
                        //         }
                        //     }
                        // }
                        );
                    }


                        //   {
                        //     "fulfillmentText": "This is a text response",
                        //     "fulfillmentMessages": [
                        //         {
                        //             "platform": "SLACK",
                        //             "card": {
                        //               "title": "Title: this is a title",
                        //               "subtitle": "This is an subtitle.  Text can include unicode characters including emoji 📱.",
                        //               "imageUri": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                        //               "buttons": [
                        //                 {
                        //                   "text": "This is a button",
                        //                   "postback": "https://assistant.google.com/"
                        //                 }
                        //               ]
                        //             }
                        //           },
                        //       {
                        //         "platform": "FACEBOOK",
                        //         "card": {
                        //           "title": "Title: this is a title",
                        //           "subtitle": "This is an subtitle.  Text can include unicode characters including emoji 📱.",
                        //           "imageUri": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                        //           "buttons": [
                        //             {
                        //               "text": "This is a button",
                        //               "postback": "https://assistant.google.com/"
                        //             }
                        //           ]
                        //         }
                        //       },
                        //       {
                        //         "text": {
                        //             "text": [
                        //             "Text defined in Dialogflow's console for the intent that was matched"
                        //           ]
                        //         }
                        //       }
                        //     ]
                        //   }
                         
                        
                      

                    // res.json( 
                        
                        




                else if(req.body.queryResult.action == 'DefaultWelcomeIntent.DefaultWelcomeIntent-custom.DefaultWelcomeIntent-Register-custom'){
                    console.log('you are into EmailCapture! Captured email is: ' + req.body.queryResult.parameters.email);
                    var query = "UPDATE PersonalTable SET Email='"+ req.body.queryResult.parameters.email +"' WHERE SessionId ='" + req.body.session + "'";
                    console.log(query);
                    executeQuery (res, query,function(err, result){
                        console.log(result.rowsAffected);
                    });
                }
                
                else if(req.body.queryResult.action == 'CaptureNumberRegistration.CaptureNumberRegistration-custom'){
                    console.log('you are into NumberCapture! is: ' + req.body.queryResult.parameters.phonenumber);
                    var query = "UPDATE PersonalTable SET MobileNumber='"+ req.body.queryResult.parameters.phonenumber +"' WHERE SessionId ='" + req.body.session + "'";
                    console.log(query);
                    executeQuery (res, query,function(err, result){
                        console.log(result.rowsAffected);
                    });
                }

                else if(req.body.queryResult.action == 'CaptureNumberRegistration.CaptureNumberRegistration-custom.captureNumberRegistration-Custom-custom'){
                    console.log('you are into GenderCapture! is: ' + req.body.queryResult.parameters.Gender);
                    var query = "UPDATE PersonalTable SET Gender='"+ req.body.queryResult.parameters.Gender +"' WHERE SessionId ='" + req.body.session + "'";
                    console.log(query);
                    executeQuery (res, query,function(err, result){
                        console.log(result.rowsAffected);
                    });
                }

                else if(req.body.queryResult.action == 'CaptureNumberRegistration.CaptureNumberRegistration-custom.captureNumberRegistration-Custom-custom.captureNumberRegistration_captureAgeGroup-custom'){
                    console.log('you are into AgeGroupCapture! is: ' + req.body.queryResult.parameters.AgeGroup);
                    var query = "UPDATE PersonalTable SET AgeGroup='"+ req.body.queryResult.parameters.AgeGroup +"' WHERE SessionId ='" + req.body.session + "'";
                    console.log(query);
                    executeQuery (res, query,function(err, result){
                        console.log(result.rowsAffected);
                    });
                }

                else if(req.body.queryResult.action == 'CaptureNumberRegistration.CaptureNumberRegistration-custom.captureNumberRegistration-Custom-custom.captureNumberRegistration_captureAgeGroup-custom.captureAgeGroup-custom'){
                    console.log('you are into MaritalCapture! is: ' + req.body.queryResult.parameters.MaritalStatus);
                    var query = "UPDATE PersonalTable SET MaritalStatus='"+ req.body.queryResult.parameters.MaritalStatus +"' WHERE SessionId ='" + req.body.session + "'";
                    console.log(query);
                    executeQuery (res, query,function(err, result){
                        console.log(result.rowsAffected);
                    });
                }

                else if(req.body.queryResult.action == 'Login.Login-custom'){
                    var query = "SELECT Email FROM PersonalTable where Email ='" + req.body.queryResult.parameters.email +"' OR MobileNumber = '" + req.body.queryResult.parameters.number +"'";
                    executeQuery (res, query,function(err, result){
                        console.log(result.rowsAffected);
                        if(result.rowsAffected[0] > 0){
                        //res.json({ fulfillmentText: 'You have successfully logged in. You can now start to use our services. Please say "Stock Investment" or "Market Updates" or "Financial Advice" for continue.' });
                    }
                         else
                        {
                            res.json({ fulfillmentText: 'Sorry, but the email / mobile phone you provided is invalid. Please re-enter by speaking "Login" or speak "Register" if you have not completed the registration.' });
                        }
                    }
                    );
                }

                    
                    //res.json({ fulfillmentText: 'this is from Node.js' });
                
            

                else if(req.body.queryResult.action == 'StockInvestment.StockInvestment-custom'){
                    console.log('i am in the logic');
                    var query = "SELECT * FROM StockInvestmentTable where StockCode ='" + req.body.queryResult.parameters.StockCode +"' OR StockName = '" + req.body.queryResult.parameters.StockName +"'";
                    executeQuery (res, query,function(err, result){
                        console.log(result);
                        if(result.rowsAffected[0] > 0){
                            console.log(result.recordset[0].StockCode);
                        res.json(
                            { fulfillmentText: 'Stock Code: '+ result.recordset[0].StockCode +' \nStock Name: '+ result.recordset[0].StockName +'\nLatestPrice: '+ result.recordset[0].LatestPrice +'\nRevenue: '+ result.recordset[0].Revenue +'\nDividendYield: '+ result.recordset[0].DividendYield +'\nPE: '+ result.recordset[0].PE +'' }
                        );}
                         else
                        {
                            res.json({ fulfillmentText: 'Sorry, but the stock is not present.' });
                        }
                    });
                    
                    //res.json({ fulfillmentText: 'this is from Node.js' });
                }             
                //res.send(req.body);
                //var query = "INSERT INTO PersonalTable (Email,Number,CountryCode,Gender,AgeGroup,MaritalStatus) VALUES ('manish@example.com','8460211189','+61','Male','26-35','Single')";
                //executeQuery (res, query);
                //sql.close();
});

//PUT API
 app.put("/api/user/:id", function(req , res){
                var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id='" + req.params.id +"'";
                executeQuery (res, query);
});

// DELETE API
 app.delete("/api/user /:id", function(req , res){
                var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
                executeQuery (res, query);
});