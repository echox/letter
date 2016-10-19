const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const fs = require('fs');

var Imap = require('imap')

let mainWindow

var state = {connections: [] }

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})
	mainWindow.maximize()
  mainWindow.loadURL(`file://${__dirname}/index.html`)

	// debug
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', function() {

	createWindow()
 	mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('log', 'client ready!')
		connectImap()
  })
})


function getBoxes(connection) {
	console.log("getting boxes...")
	connection.imap.getBoxes(function(err, boxes) {
		console.log(err)
    console.log(boxes)
	})
}

function connectImap() {

				var accounts = getAccounts()

				accounts.forEach(function(account){
					var imap = new Imap(account)

								imap.once('error', function(err) {
												  console.log(err);
								});
				 
				imap.once('end', function() {
								  console.log('Connection ended');
				});
				imap.once('ready', function() {
					getBoxes(state.connections[0])
				})
					account.imap = imap
				//	imap.connect()
					state.connections.push(account)
				})
}

exports.getData = function() {

				var accounts = []
				state.connections.forEach(function(account) {

					var boxes = getBoxes(account)
					account.boxes = boxes
					accounts.push(account)
				})

				return {accounts: accounts,
								messages: mockMessages(20)
								}
	};


function mockMessages(count) {

				var subjects = ["Re: ",
												"Re: Mailingliste",
												"Wichtig: Foobar",
												"Bla blup",
												"Wg: blablabla",
												"Hallo!",
												"Re: RE: fwd: Ebay",
												"Ihre Amazon Rechnung",
												"Buy Viagra",
												"Kein Betreff"]
				var dates = ["21:23 24/12/16",
										 "16:20 1/1/13",
										 "00:00 23/5/19",
										 "13:42 9/7/01",
										 "09:30 15/9/03",
										 "19:51 6/10/06"]
				var sender = ["example@example.org",
										"mueller.meier@ebay.de",
										"orders@amazon.com",
										"nobody@example.org",
										"foobar@hotmail.com"]
				
			 var messages = []

				for (var i=0;i<count;i++) {
					var subject = getRand(subjects)
					var date = getRand(dates)
					var from = getRand(sender)

					messages.push({subject: subject, date: date, from: from})
				}

				return messages;
}

function getRand(array) {
				return array[Math.floor(Math.random() * array.length)]
}

function getAccounts() {
				var obj = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));
				return obj
}


app.on('window-all-closed', function () {
	app.quit()
})

