const path = require("path");
const fs = require("fs");

const FILE_PATH = path.join(__dirname, "db.json");
let data;

if (fs.existsSync(FILE_PATH)){
    const content = fs.readFileSync(FILE_PATH, "utf-8");
    data = JSON.parse(content);
}
else{
    console.log(`File path ${FILE_PATH} not found`);
}

function savefile(){
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
    gethistory: (username) => {
        const user = data["users"].find(user => user["username"] == username);
        return user ? user['history'] : undefined;
    },
    addtohistory: (username, entry) => {
        const user = data["users"].find(u => u["username"] === username);
        user["history"].push(entry);
        savefile();
    },
    registerUser: (username, password) => {
        const temp = {username, password, "history": []};
        data["users"].push(temp);
        savefile();
    },
    getpass: (username) => {
        const user = data["users"].find(user => user["username"] == username);
        return user ? user["password"] : undefined;
    },
    getall: () => data["users"],
    getallNames: () => {
        let res = [];
        data["users"].forEach(u => {
            res.push(u.username);
        });
        return res;
    },
    deleteUser: (username) => {
        data["users"] = data["users"].filter(u => u["username"] !== username);
        savefile();
    },
}