//const url = 'https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'

const cheerio = require('cheerio')
const request = require('request')

const path = require('path')

const fs = require('fs')

const xlsx = require('xlsx')


function processScoreCard(url)
{
    request(url ,cb)
}



function cb(error , response , html)
{
    if(error)
    {
        console.log(error)
    }
    else
    {
        extractMatchInfo(html)
    }
}

function extractMatchInfo(html)
{
    let $ = cheerio.load(html)

    let descElem = $('.header-info .description')
    //console.log(descElem.text())

    let descArr = descElem.text().split(',')

    let venue = descArr[1].trim()
    let date = descArr[2].trim()

    let result = $('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span').text()
    console.log(venue)
    console.log(date)
   // console.log(result.text())
    console.log(result)

    console.log('````````````````````````````````````````')

    let innings = $('.card.content-block.match-scorecard-table>.Collapsible')

    //console.log(innings)

    let htmlString = ''

    for(let i =0 ; i<innings.length ; i++)
    {
        htmlString +=$(innings[i]).html()

        let teamName = $(innings[i]).find('h5').text()

        teamName = teamName.split('INNINGS')[0].trim()
        

        let opponentIndex = i==0 ? 1:0

        let opponentName = $(innings[opponentIndex]).find('h5').text()
        opponentName = opponentName.split('INNINGS')[0].trim()

        // console.log(teamName)
        // console.log(opponentName)

        // console.log(' ${venue} | ${teamName} | ${opponentName} | ${date} | ${result} ')

        // console.log(venue , date , teamName , opponentName , result)

        let cInning = $(innings[i])

        let allRows = cInning.find('.table.batsman tbody tr')

        for(let j=0 ; j<allRows.length ; j++)
        {
            let allCols = $(allRows[j]).find('td')
            let isWorthy = $(allCols[0]).hasClass('batsman-cell')

            if(isWorthy == true)
            {
                //Player Name run balls fours and sixes and STR

                let playerName = $(allCols[0]).text().trim()
                let runs = $(allCols[2]).text().trim()

                let balls = $(allCols[3]).text().trim()

                let fours = $(allCols[5]).text().trim()

                let sixes = $(allCols[6]).text().trim()

                let STR = $(allCols[7]).text().trim()

                //console.log(`${playerName}| ${runs}| ${balls}| ${fours}| ${sixes}| ${STR}`)
                console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${STR}`)

                processPlayer(teamName ,playerName, runs, balls , fours , sixes , STR , opponentName , venue , result, date)
                
            }
        }
        console.log('`````````````````````````````````````')
    }
   // console.log(htmlString)



}

// function processPlayer(teamName ,playerName, runs, balls , fours , sixes , STR , opponentName , venue , result, date)
// {
//     let teamPath = path.join(__dirname , "IPL" , teamName)
//     dirCreator(teamPath)

//     let filePath = path.join(teamPath , playerName+ ".xlsx")
//     let content = excelReader(filePath , playerName)

//     let playerObj = {
//         teamName,
//         playerName,
//         runs,
//         balls,
//         fours,
//         sixes, 
//         STR, 
//         opponentName, 
//         venue, 
//         result,
//         date

//     }

//     content.push(playerObj)
//     excelWriter(filePath , content , playerName )
// }
function processPlayer(
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    STR,
    opponentName,
    venue,
    result, date
  ) {
    let teamPath = path.join(__dirname, "IPL", teamName);
    dirCreator(teamPath);
  
  
    let filePath = path.join(teamPath , playerName+ ".xlsx")
    let content = excelReader(filePath , playerName)
  
    let playerObj = {
      teamName,
      playerName,
      runs,
      balls,
      fours,
      sixes,
      STR,
      opponentName,
      venue,
      result,date
    }
  
    content.push(playerObj)
    excelWriter(filePath , content , playerName)
  }


function dirCreator(filePath)
{
    if(fs.existsSync(filePath)==false)
    {
        fs.mkdirSync(filePath)
    }
}


function excelWriter(filePath , Jsondata , SheetName)
 {
    let newWB = xlsx.utils.book_new();
    //Adds new Workbook / Excel Sheet
    let newWS = xlsx.utils.json_to_sheet(Jsondata);
    //This will take json and will convert into excel format
    xlsx.utils.book_append_sheet(newWB, newWS,SheetName );
    xlsx.writeFile(newWB, filePath);

 }


function excelReader(filePath , sheetName){

    if(fs.existsSync(filePath)==false)
    {
        return []
    }
    let wb = xlsx.readFile(filePath);
//Which Work book to read / excel file to read
let excelData = wb.Sheets[sheetName];
let ans = xlsx.utils.sheet_to_json(excelData);
//console.log(ans)

return ans

}

module.exports={
    ps : processScoreCard
}