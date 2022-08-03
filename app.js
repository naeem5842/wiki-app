const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs  = require('ejs');
const express = require('express');
const PORT = process.env.PORT || 3000;

const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/wikiDB',{useNewUrlParser:true});

const articalsSchema = mongoose.Schema({
    title: String,
    content: String,
});

const Artical = mongoose.model('Artical', articalsSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended:true,
}));

app.use(express.static('public'));

/////////////////routes for comman articals/////////////////////////
app.route('/articals')
    .get(function(req,res){
    Artical.find(function(err, articals){
        if(!err){
            res.send(articals);
        } else{
            res.send(err);
        }
    })
})
.post(function(req,res){
    const newtitle = req.body.title;
    const newdescription = req.body.content;
    const newArtical = new Artical({
        title: newtitle,
        content:newdescription
    });

    newArtical.save(function(err){
        if(!err){
            res.send('successfully added the data');
            
        }
        else{
            res.send(err);
        }
    })
})
.delete(function(req,res){
    Artical.deleteMany(function(err){
        if(!err){
            res.send("succesfully deleted all articals")
        }
        else{
            res.send(err);
        }
    })
});



/////////////////////////////routes for specific articals//////////////////////////

app.route('/articals/:articalTitle').get(function(req, res){
    Artical.findOne({title: req.params.articalTitle} , function(err, foundArtical){
         if(foundArtical){
             res.send(foundArtical);
         }
         else{
             res.send("No ssuch artical found");
         }
    })
})
.put(function(req,res){
    Artical.updateOne(
        {title: req.params.articalTitle},
        {title: req.body.title, content: req.body.connect},
        function(err) {
            if (!err) {
                res.send("successfully updated the data")
            }
        }
        );
})

.patch(function(req,res){
    Artical.updateOne(
        {title:req.params.articalTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("successfully updated data")

            }
        }
        );
})
.delete(function(req,res){
    Artical.deleteOne(
        {title: req.params.articalTitle},
        function(err){
            if(!err){
                res.send('successfully deleted the artical')
            }
        })
});


app.listen(PORT ,()=>{
    console.log(`Server started on port ${PORT} `);
})  