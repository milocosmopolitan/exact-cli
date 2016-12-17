const fs = require('./filesystem');
const message = require('./message');
const util = require('./utils');
const path = require('path');

const log = console.log;

/* path variables */
// const react_dir = path.join(__dirname, '/../../app');
const react_dir = path.join(process.cwd(), '/app');
const containers_dir = path.join(react_dir, '/components');


function toPascalCase(str) {
    return str.replace(/(\w)(\w*)/g, (g0, g1, g2) => {
        return g1.toUpperCase() + g2.toLowerCase()
    });
}
/*
 * ATTACH MODULE
 * ===================
 * this function is used to add import, export code lines 
 * into a file that correspondant with its module type
 */
function attachModule(Name, moduleType) {

    if (moduleType === 'actions') return

    let pluralModuleType = moduleType !== 'actions' ?
        `${moduleType}s` :
        moduleType;

    let filepath = `${react_dir}/index-${pluralModuleType}.js`;

    fs.read(filepath)
        .then(template => {
            let templateRows = template.split('\n'),
                impRowNum = 0,
                expRowNum = 0;

            templateRows.forEach((row, index) => {
                if (row === '/* IMPORT */') impRowNum = index;
                if (row === '/* EXPORT */') expRowNum = index;
            })

            let impRowTxt = `import ${Name}${util.toPascalCase(moduleType)} from './${pluralModuleType}/${Name}/${Name}-${moduleType}';`,
                expRowTxt = `export const ${Name} = ${Name}${util.toPascalCase(moduleType)};`


            templateRows.splice(expRowNum + 1, 0, expRowTxt);
            templateRows.splice(impRowNum + 1, 0, impRowTxt);

            return templateRows.join('\n');
        }).then(moduleIndex => {
            return fs.touch(filepath, moduleIndex)
        }).catch(console.error)
}


/*
 * GENERATE FILES
 * ===================
 * generate defalt file set for the react component with its
 * reducer and action creators
 */

function generateFiles(filepath, customTemplate) {
    let Name = filepath.split('/').pop();


    // Read all files in specific template directory
    fs.readdir(path.join(__dirname, `/templates/${customTemplate}`))
        .then(files => {

            // loop thru each template files to generate files in frontend directory
            files.forEach(file => {

                let targetPath = `${filepath}/${Name}-${file}`,
                    templateFile = path.join(__dirname, `/templates/${customTemplate}/${file}`);

                fs.exists(targetPath)
                    .then(exists => {
                        // Create new file when file to generate does NOT exist
                        // This is IMPORTANT because we want to 
                        // avoid user using the cli command to overwrite existing component
                        // That would be disaster...
                        if (exists) throw new Error(`File ${Name}-${file} Already EXISTS`)
                        return fs.read(templateFile)
                    })
                    .then(template => {
                        // Replace 'Template' strings to give component Name
                        let filedata = template.replace(/Template/g, Name)
                        return fs.touch(targetPath, filedata)
                    }).then(() => {
                        let filename = file.split('.')[0]
                        if (filename === 'component' || filename === 'reducer') attachModule(Name, filename)
                    }).catch(message.red)
            })
        })
        .catch(console.error)
}

/*
 * MAKE COMPONENT
 * ===================
 * generate defalt file set for the react component with its
 * reducer and action creators
 */

// function mkComponent(name, optional) {
//     log('make container');
//     let Name = util.toPascalCase(name),
//         filepath = path.join(containers_dir, `/${Name}`);

//     message.green('Make Container')

//     log(optional);
//     let template = commander.template ? commander.template : 'blank'
//     fs.mkdir(filepath).then(() => {
//         return generateFiles(filepath, template)
//     }).catch(console.error)
// }

module.exports = (commander)=>{
    return { 
        mkComponent: function(name, optional) {
            log('make container');
            let Name = util.toPascalCase(name),
                filepath = path.join(containers_dir, `/${Name}`);

            message.green('Make Container')

            log(optional);
            let template = commander.template ? commander.template : 'blank'
            fs.mkdir(filepath).then(() => {
                return generateFiles(filepath, template)
            }).catch(console.error)
        }
    }
}
