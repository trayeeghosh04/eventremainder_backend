const express = require('express')
var cors = require('cors')
const nodemailer = require('nodemailer')
const connectToMongo = require('./db.js')
const auth = require('./models/Admin.js')
const remainderinfo = require('./models/remainderInfo.js')
const fetchadmin = require('./middleware/fetchadmin.js')
connectToMongo()
const app = express()
const port = 8000

app.use(express.json())
app.use(cors())
app.use('/api/auth', require('./routes/Auth.js'))
app.use('/api/events', require('./routes/Events.js'))
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

setInterval(() => {
    remainderinfo.find({}, (err, reminderList) => {
        if (err) {
            console.log(err)
        }
        if (reminderList) {
            reminderList.forEach(reminder => {
                if (!reminder.isReminded) {
                    const now = new Date()
                    if ((new Date(reminder.remindAt) - now) < 0) {
                        remainderinfo.findByIdAndUpdate(reminder._id, { isReminded: true }, (err, remindObj) => {
                            if (err) {
                                console.log(err)
                            }
                            const  SendMail = async()=> {
                                //   console.log("Msg Send...")
                            let testAccount = await nodemailer.createTestAccount();

                            // create reusable transporter object using the default SMTP transport
                            let transporter = nodemailer.createTransport({
                                host: "smtp.ethereal.email",
                                port: 587,
                                secure: false, // true for 465, false for other ports
                                auth: {
                                    user: 'retta.hettinger@ethereal.email',
                                    pass: 'hbbHCVGqr3SEsXjzCa' // generated ethereal password
                                },
                            });
                            // const userId = req.user.id;
                            // const user = await admin.findById(userId).select("-password")
                            // send mail with defined transport object
                            let info = await transporter.sendMail({
                                from: '"Fred Foo 👻" <aakash@gmail.com>', // sender address
                                to: "aakashdey786@gmail.com", // list of receivers
                                subject: "Todo Remainder ✔", // Subject line
                                text : remindObj.reminderMsg, // plain text body
                                // html: "<b>Hello world?</b>", // html body
                            });

                            console.log("Message sent: %s", info.messageId);
                            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                            // Preview only available when sending through an Ethereal account
                            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                            let note =  await remainderinfo.findByIdAndDelete(reminder._id);
                            }
                            SendMail().catch(console.error)
                        })
                    }
                }
            })
        }
    })
}, 1000)