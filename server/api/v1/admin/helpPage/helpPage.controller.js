'use strict';

const fs = require('fs');
const path = require('path');

const filePath = path.resolve('client/assets/attributeHelpDetails.json');

exports.updateAttributeHelpDetails = function (req, res) {
    let attributeHelpDetails = JSON.stringify(req.body);
    fs.writeFile(filePath, attributeHelpDetails, function (error) {
        console.error("Error while updating file", error);
        res.status(500).send(error);
    }, function (success) {
        console.log("file updated successfully");
        res.status(201).send("File update successfully");
    })

}

