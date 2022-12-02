var express=require('express');
var router=express.Router();

require('../models/connection');
const Place= require('../models/places');
const {checkBody} =require('../modules/checkBody');

router.post('/', (req, res) => {
    //{ nickname: 'Max', name: 'Lyon', latitude: 45.758, longitude: 4.835 }
    if (!checkBody(req.body, ['nickname', 'name','latitude','longitude'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }  
    const newPlace= new Place({
        nickname: req.body.nickname,
        name: req.body.name,
        latitude: req.body.latitude,
        longitude:req.body.longitude 
    });

    newPlace.save().then(newDoc =>{
        res.json({ result: true});
    })

});


router.get('/:nickname',(req,res)=>{
    // nickname: { $regex: new RegExp(req.body.nickname, "i") }
    Place.find({nickname: req.params.nickname}).then(data=>{
        if(data){
            console.log(data)
            const dataplace=data.map(elem=>{
                return {nickname: elem.nickname,name: elem.name,latitude: elem.latitude,longitude: elem.longitude};
            })

            res.json({ result: true,places:dataplace});
        }else{
            res.json({ result: false});
        }
    })
})

router.delete('/',(req,res)=>{
    //{ nickname: 'Max', name: 'Lyon' }
    if (!checkBody(req.body, ['nickname', 'name'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }  
   
    // nickname: { $regex: new RegExp(req.body.nickname, "i") }
    Place.deleteMany({ $and: [{ nickname:req.body.nickname }, { name:req.body.name }] }).then(data=>{
        if(data){
            res.json({result: true});
        }else{
            res.json({result: false});
        }

    })
})

module.exports =router;

