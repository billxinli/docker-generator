const _ = require('lodash')
const yaml = require('js-yaml')
const glob = require('glob')
const path = require('path')
const inquirer = require('inquirer')
const Promise = require('bluebird')
const mustache = require('mustache')
const fs = require('fs')
const mkdirp = require('mkdirp')
const writeFile = Promise.promisify(fs.writeFile)

const appendFile = Promise.promisify(fs.appendFile)

const containerTemplate = fs.readFileSync('./templates/container.mustache').toString()

const dockerMetadataFolder = 'container-data'
const persistenceFolder = 'persistence'

function loadContainerFiles () {
  return new Promise((resolve, reject) => {
    glob('dockerfiles/**/container.json', (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}

function loadContainerInformation (files) {
  return Promise.reduce(files, (result, file) => {
    let container = require(path.join(__dirname, file))
    result[container.image] = container
    return result
  }, {})
}

function promptForContainer (containers) {
  let prompts = [
    {
      type: 'input',
      name: 'appName',
      message: 'What is the app\'s name?',
      default: () => {
        return `my-app`
      }
    },
    {
      type: 'checkbox',
      message: 'What stacks are required?',
      pageSize: 20,
      name: 'technologyContainers',
      choices: () => {
        let containerChoices = _.map(_.values(containers), (container) => {
          return {
            name: container.description,
            value: container.image
          }
        })
        return containerChoices
      },
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must choose at least one stack.'
        }
        return true
      }
    }
  ]

  _.forEach(_.values(containers), (container) => {
    if (_.get(container, 'requireCommandInput', false)) {
      prompts.push({
        type: 'input',
        name: _.get(container, 'commandKey'),
        message: `What is the command required to run the ${_.get(container, 'simpleName')} application?`,
        default: _.get(container, 'defaultCommand'),
        when: (answers) => {
          return _.includes(answers.technologyContainers, container.image)
        }
      })
    }
  })

  return inquirer.prompt(prompts)
}

let mappedPorts = []
function buildPortMapping (port) {
  let proposedPort = parseInt(port)
  let mappedPort = 10000 + proposedPort
  if (!_.includes(mappedPorts, mappedPort)) {
    mappedPorts.push(mappedPort)
    return `${mappedPort}:${proposedPort}`
  } else {
    return buildPortMapping(proposedPort + 1)
  }
}

function buildVolumeMapping (volume) {
  let path = `./${dockerMetadataFolder}/${persistenceFolder}/${volume}`
  mkdirp.sync(path)
  return `${path}:${volume}`
}

function buildContainerName (appName, simpleName) {
  return `${appName}-${simpleName}`
}

function buildContainerConfig (containers, answers) {
  let config = {
    version: '3',
    services: {}
  }

  _.forEach(answers.technologyContainers, (container) => {
    let technologyContainer = containers[container]
    let image = technologyContainer.image
    config.services[technologyContainer.name] = {}
    config.services[technologyContainer.name].image = image

    let simpleName = _.get(technologyContainer, 'simpleName')
    if (simpleName) {
      config.services[technologyContainer.name].container_name = buildContainerName(answers.appName, simpleName)
    }

    let ports = _.get(technologyContainer, 'ports', [])
    if (ports.length > 0) {
      config.services[technologyContainer.name].ports = _.map(ports, (port) => buildPortMapping(port))
      config.services[technologyContainer.name].expose = ports
    }

    let volumes = _.get(technologyContainer, 'volumes', [])
    if (volumes.length > 0) {
      config.services[technologyContainer.name].volumes = _.map(volumes, (volume) => buildVolumeMapping(volume))
    }

    let requireCommandInput = _.get(technologyContainer, 'requireCommandInput', false)
    if (requireCommandInput) {
      let command = _.get(answers, _.get(technologyContainer, 'commandKey'))

      config.services[technologyContainer.name].command = command
      config.services[technologyContainer.name].build = {context: `./${dockerMetadataFolder}/${technologyContainer.name}`}

      if (config.services[technologyContainer.name].volumes && _.isArray(config.services[technologyContainer.name].volumes)) {
        config.services[technologyContainer.name].volumes.push('./:/app')
      } else {
        config.services[technologyContainer.name].volumes = ['./:/app']

      }

      mkdirp.sync(`./${dockerMetadataFolder}/${technologyContainer.name}`)

      let data = mustache.render(containerTemplate, {image, command})

      fs.writeFileSync(`./${dockerMetadataFolder}/${technologyContainer.name}/Dockerfile`, data)
    }

  })

  return Promise.resolve(yaml.dump(config))
}

loadContainerFiles()
  .then((files) => loadContainerInformation(files))
  .then((containers) => Promise.all([containers, promptForContainer(containers)]))
  .spread(buildContainerConfig)
  .then((containerYaml) => writeFile('docker-compose.yml', containerYaml))
  .then(() => {
    return appendFile('./.gitignore', '\n\n# Ignores the docker container meta data folder\ncontainer-data')
  })
  .then(() => {
    console.log(`Docker compose file has been written to docker-compose.yml
To run your stack: docker-compose up
`)
  })
  .catch((err) => {console.log(err)})