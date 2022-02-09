const request = require('request')
const cheerio = require('cheerio')

let scorecardObj = require('../espnCricketScrapping/scoreCard')



function getAllMatchLink(url)
{
    request(url , function(error , response , html)
    {
        if(error)
        {
            console.log(error)
        }
        else
        {
            extractAllMAtchLink(html)
        } 

    })
}



function extractAllMAtchLink(html)
{
    let $ = cheerio.load(html)


    let scoreCardElemArr = $('a[data-hover="Scorecard"]')

    for(let i=0 ; i<scoreCardElemArr.length ; i++)
    {
        let ScoreCardLink = $(scoreCardElemArr[i]).attr('href')

        let fullLink = 'https://www.espncricinfo.com/' + ScoreCardLink

        console.log(fullLink)
        scorecardObj.ps(fullLink)
    }
}

module.exports={
    getAllMatch : getAllMatchLink
}
