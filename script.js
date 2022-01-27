const translate = require('@vitalets/google-translate-api');
const prompts = require('prompts');
const fs = require('fs');
const { isBuffer } = require('util');


let pickedFileName = ''

fs.readdir('./', async (err, files) => {
  prompts({
    type: 'select',
    name: 'fileName',
    message: 'Select a file to write',
    choices: [...files.map((file) =>({title: file, value: file})), {value: 'Create new File', value: 'new'}]
  }).then(async (res) => {
 
    if(res.fileName === 'new') {
      const newFileName = await prompts({
        type: 'text',
        name: 'fileName',
        message: 'Enter file name',
      })

      pickedFileName = newFileName.fileName
    } else {
      pickedFileName = res.fileName
    }
    
    await getTranslation()
  })
})




const getTranslation = async () => {
  const promptResponse = await prompts([{
    type: 'text',
    name: 'word',
    message: 'Enter a word'
  }, {
    type: 'text',
    name: 'language',
    message: 'Enter a language to translate(ru - Russian, en - English)'
  }])
  const translateResult =  await translate(promptResponse.word, {to: promptResponse.language})
  
  console.log('Result ', translateResult.text);

  const saveResultPrompt = await prompts({
    type: 'confirm',
    name: 'result',
    message: 'Save result'
  })


  if (saveResultPrompt.result) {
    fs.appendFile(pickedFileName, `"${promptResponse.word}";"${translateResult.text}"\n`, async (err) => {
      await getTranslation()    
    })
  }

}

