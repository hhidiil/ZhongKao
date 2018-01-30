/**
 * 上传文件
 * Created by gaoju on 2018/1/16.
 */
var express = require('express');
var fs = require('fs')
const CONFIG_MAP = require('../../config')
const Helper = require('../helper')

module.exports={
    init: function(app) {
        app.post('/upload',this.doUpLoadFile)
    },
    doUpLoadFile: (req, res, next) => {
        console.log(req);
        let imageFile = req.files.file;
        let foldername = req.body.username;
        let path = `${CONFIG_MAP.root_path}/students_upload_images/all_images`;
        let dateString = Helper.randomString(true,5,16);//产生随机文件名
        let target_path = Helper.createFolder(path,foldername);
        //将上传的图片移到指定目录
        imageFile.mv(`${target_path}/${dateString}.png`, function(err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({file: `all_images/${foldername}/${dateString}.png`});
        });
    }
}
