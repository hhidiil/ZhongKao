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
        let imageFile = req.files.file,foldername='',preUrl='',dateString='',target_path='';
        let path = `${CONFIG_MAP.root_path}/students_upload_images/all_images`;
        foldername = req.body.username;
        preUrl = req.body.preurl;
        Helper.deleteFile((path+"/"+foldername),preUrl);//文件存在，删除文件
        dateString = Helper.randomString(true,5,16);//产生随机文件名
        target_path = Helper.createFolder(path,foldername);
        //将上传的图片移到指定目录
        imageFile.mv(`${target_path}/${dateString}.png`, function(err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({file: `all_images/${foldername}/${dateString}.png`});
        });
    }
}
