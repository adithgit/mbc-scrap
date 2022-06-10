const request = require('request-promise').defaults({ jar: true});
const cheerio = require('cheerio');



async function main(){
    const result =  await request.get("http://mbccet.com/login.php");
    const loginResult = await request.post("http://mbccet.com/get_acess.php",{
        form:{
            rno: "5285",
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
    console.log(resultData);
}


main();





