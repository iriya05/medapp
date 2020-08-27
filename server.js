const express = require('express');//express is set up
const mustacheExpress = require('mustache-express');//mustache is set up 
const { response } = require('express');
const bodyParser = require('body-parser');
//instialize
const app = express();
const mustache = mustacheExpress();
const { client, Client } = require('pg'); //for connection with database
mustache.cache = null; //set cache

app.engine('mustache',mustache);//set as engine
app.set('view engine','mustache');//engine is view by mustache


app.use(express.static('public'))//use this file for static file info for express
app.use(bodyParser.urlencoded({extended:false}));
//route submit button med-form mustache
app.get('/add',(req,res)=>{
    res.render('med-form');
});

app.post('/meds/add',(req,res)=>{
    console.log('post body',req.body);

    const client = new Client({
     
        user:'postgres',
        host:'localhost',
        database:'medical1',
        password:'Isteve@123',
        port:'5432',

    });
    client.connect()
            .then(()=>{
                console.log('connection Complete');
                const sql = 'INSERT INTO meds (name,count,brand) VALUES ($1, $2, $3)'
                 const params = [req.body.name,req.body.count,req.body.brand];
                 return client.query(sql,params);

            })
            .then((result)=>{
                console.log('results?',result);
                res.redirect('/meds');
            });

        });
            
    
//route for med

app.get('/meds',(req,res)=>{
     //setting up client to connect to database
    const client = new Client({
     
        user:'postgres',
        host:'localhost',
        database:'medical1',
        password:'Isteve@123',
        port:'5432',

    });
    client.connect()
            .then(()=>{
              return client.query('SELECT * FROM meds');

            })
            .then((results)=>{
                console.log('results',results);
                res.render('meds',results);
             
            });
   
});

app.post('/meds/delete/:id',(req,res)=>{
    const client = new Client({
     
        user:'postgres',
        host:'localhost',
        database:'medical1',
        password:'Isteve@123',
        port:'5432',

    });
    client.connect()
            .then(()=>{
                const sql = 'DELETE FROM meds WHERE mid = $1'
                const params = [req.params.id]; //access id
                return client.query(sql,params);
            })
            .then((results)=>{
                res.redirect('/meds');

            });
   
});

app.get('/meds/edit/:id',(req,res)=>{
    const client = new Client({
     
        user:'postgres',
        host:'localhost',
        database:'medical1',
        password:'Isteve@123',
        port:'5432',

    });
    client.connect()
            .then(()=>{
                const sql = 'SELECT * FROM meds WHERE mid = $1'
                const params = [req.params.id]; //access id
                return client.query(sql,params);
            })
            .then((results)=>{
                console.log('results?',results)
                res.render('meds-edit',{med:results.rows[0]});

            });
});

app.post('/meds/edit/:id',(req,res)=>{
    const client = new Client({
     
        user:'postgres',
        host:'localhost',
        database:'medical1',
        password:'Isteve@123',
        port:'5432',

    });
    client.connect()
            .then(()=>{
                const sql = 'UPDATE meds SET name=$1, count=$2, brand=$3 WHERE mid = $4'
                const params = [req.body.name,req.body.count,req.body.brand,req.params.id]; //access id
                return client.query(sql,params);
            })
            .then((results)=>{
                console.log('results?',results)
                res.redirect('/meds');

            });
});
//Dashboard

app.get('/dashboard',(req,res)=>{
    const client = new Client({
     
        user:'postgres',
        host:'localhost',
        database:'medical1',
        password:'Isteve@123',
        port:'5432',

    });
    client.connect()
        .then(()=>{
            return client.query('SELECT SUM(count) FROM meds; SELECT DISTINCT COUNT(brand) FROM meds');

        }) 
        .then((results)=>{
            console.log('?results',results[0]);
            console.log('?results',results[1]);
            res.render('dashboard',{n1:results[0].rows,n2:results[1].rows});
        });
});


//route to local host
app.listen(5001,()=>{
    console.log('Listening to port 5001'); //setup up port no that to listen
})