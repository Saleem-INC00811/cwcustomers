sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/ws/WebSocket"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.ws.WebSocket} WebSocket
     */
    function (Controller,JSONModel,WebSocket) {
        "use strict";

        return Controller.extend("com.msb.nwcustomers.controller.View1", {
            onInit: function () {
                let oMdlNotification = new JSONModel({
                    "aMsg" : [
                        {
                            "type" : "None",
                            "msg"  : "Default <em>(Information)</em> with default icon and <strong>close button</strong>:"
                        },
                        {
                            "type" : "Error",
                            "msg"  : '<strong>Error</strong> with link to ' + '<a target="_blank" href="http://www.sap.com">SAP Homepage</a> <em>(For more info)</em>'
                        },
                        {
                            "type" : "Warning",
                            "msg"  : "<strong>Warning</strong> with default icon and close button:"
                        },
                        {
                            "type" : "Success",
                            "msg"  : "<strong>Success</strong> with default icon and close button:"
                        }
                    ]
                });
                this.getView().setModel(oMdlNotification, "mNotification");

                let aMsg = $.extend(true,[],oMdlNotification.getProperty("/aMsg"));

                this.oWS = new WebSocket("wss://suncor-websocket-test.cfapps.us20.hana.ondemand.com/webSocket/Sam");
                this.oWS.attachOpen(function(oWSEvent){
                    console.log("WS Connection Open Successful with user Sam");
                });

                this.oWS.attachClose(function(oWSEvent){
                    console.log("WS Connection Close Successful with user Sam");
                });

                this.oWS.attachError(function(oWSEvent){
                    console.log("WS Connection Error");
                });

                this.oWS.attachMessage(function(oWSEvent){
                    console.log("WS Message received for user Sam");
                    console.log(oWSEvent.getParameters().data);
                    let oNotif = oWSEvent.getParameters().data;
                    if(oNotif){
                        aMsg.unshift({
                            "type" : oNotif.type ? oNotif.type : "None",
                            "msg"  : oNotif.message ? oNotif.message : oNotif
                        });
                        oMdlNotification.setProperty("/aMsg",aMsg);
                    }
                    
                });


                
            },

            onCloseMsgStrip: function(oEvent){
                let oMdlNotification = this.getView().getModel("mNotification");
                let oMsgContainer = this.byId("idVBoxMsgStripCont");
                let aMsg = $.extend(true,[],oMdlNotification.getProperty("/aMsg"));
                oEvent.getSource().destroy();
                if(!oMsgContainer.getItems().length){
                    oMsgContainer.removeStyleClass("active");
                }
                let sPath = oEvent.getSource().getBindingContext("mNotification").getPath();
                let iRemMsgStrip = Number(sPath.replace("/aMsg/",""));
                aMsg.splice(iRemMsgStrip,1);
                oMdlNotification.setProperty("/aMsg",aMsg);
                oMdlNotification.refresh();
            },


            onShow:function(oEvent){
                let oMsgContainer = this.byId("idVBoxMsgStripCont");
                if(oMsgContainer.hasStyleClass("active")){
                    oMsgContainer.removeStyleClass("active");
                }else{
                    oMsgContainer.addStyleClass("active");
                }
            }

        });
    });
