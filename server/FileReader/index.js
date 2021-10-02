
const {readFile, writeFile} = require('fs');


module.export = (user, cb)=> {
    readFile("../JSON/activities.json","utf8", (err, data)=>{
        if(err){
            return cb("Error updating json file")
        }
        else{
            active = {
                user : {
                    id: user.id,
                    socketId: socket.id,
                    name: user.FullName,
                    UserName : user.UserName,
                    status: "Online"
                }
            };
    
            activities = JSON.parse(data);
            activities.push(active)
    
            var string = JSON.stringify(activities,null,'\t');
    
            writeFile('./JSON/activities.json', string, "utf8", (err)=>{
                if(err) return cb("Error updating json file")
                cb(null, success)
            })
        }
    })
}