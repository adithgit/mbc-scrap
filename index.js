const request = require('request-promise').defaults({ jar: true});
const cheerio = require('cheerio');



async function getAttendance( admissionNum ){
    const result =  await request.get("http://mbccet.com/login.php");
    const loginResult = await request.post("http://mbccet.com/get_acess.php",{
        form:{
            rno: admissionNum,
            rq_type:"use_rno"
        }
    })
    const studDetails = await request.get("http://mbccet.com/student_details.php");
    

    const $ = cheerio.load( studDetails );

    const titles = $('table .klub_title').text().split(/\s\s+ /);
    titles.pop(); titles.shift();
    const data = $('table .klub_data').text().split(/\s\s+/g); 
    data.shift(); data.pop(); 
    let resultData = "";

    for (let index = 0; index < 6; index++) {
        resultData += (titles[index]+" -- "+data[index]) +"\n";        
    }


    let subjectNodes = $("table tbody")[2].childNodes
    let count = -1;
    
    for( index in subjectNodes ){
        if( subjectNodes[ index ].nodeType != 1) continue;
        count++;
    }

    
    data.splice(0,6);
    data.splice(count*7);
    while( data.length ){
        let subData = data.splice(0,7);
        resultData += subData.join(" , ")+"\n";
    }

    return new Promise((resolve, reject)=>{
        if( resultData ) resolve( resultData );
        reject( false );
    })
}





const { Client, Intents } = require("discord.js");
require('dotenv').config();

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.once("ready", ()=>{
    console.log("Bot is online");
})

client.on("messageCreate", message =>{
    if( message.content.startsWith("#")){
        if(message.content.substring(1,4)==='get'){
           getAttendance( message.content.substring(4).trim() ).then(( result )=>{
               message.reply( result );
           }).catch(( err )=>{
            message.reply(" Please check your query again or try later.")
           });
        }else{
            message.reply("Invalid request!!")
        }
    }
})



client.login(
    process.env.TOKEN
);





