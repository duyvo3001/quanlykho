const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
// tạo hash
const _pass = (pass) =>{
    let createpass ={
        hash :  bcrypt.hashSync(pass, salt),
        // re_hash : bcrypt.hashSync(re_pass, saltRounds)
    }
    return {createpass} ;
}

//test hash
const test_pass= (pass, hash) =>{
    let test =  {
        test_Hash : bcrypt.compareSync(pass, hash),  
    }
    return test ; 
}

export  {_pass, test_pass} ;