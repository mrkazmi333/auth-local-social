const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile',{
            title: "User Profile",
            profile_user: user
        });
    });
    
}

module.exports.update = async function(req, res){
  
        if(req.user.id == req.params.id && req.body.new_password == req.body.confirm_new_password){
            User.findByIdAndUpdate(req.params.id,{password: await bcrypt.hash(req.body.confirm_new_password, 10)}, function(err, user){
                console.log(user.password);
                if( bcrypt.compare(req.body.old_password, user.password)) { //user.password == req.body.old_password){
                    req.flash('success', 'Password Updated');
                    return res.redirect('back');
                }else{
                    req.flash('error', 'Old password entered is wrong');
                    return res.redirect('back');
                }
            });
        }else{
            req.flash('error', 'UnAuthorized');
            return res.status(401).send('Unauthorized');
        }
}

//Render the signup page
module.exports.SignUp = function(req, res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title: "SignUp"
    });
}

//Render the SignIn page
module.exports.SignIn = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: "SignIn"
    });
}
 
//Get the signUp data
module.exports.create =  function(req, res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords did not matched!');
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, async function(err, user){
        if(err){req.flash('error', err); return}

        if(!user){
           
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                User.create({email: req.body.email, password: hashedPassword, name: req.body.name  }, function(err, user){
                    if(err){ req.flash('error', err); return }
    
                    req.flash('success', 'You have signed up, login to continue!');
                    return res.redirect('/users/sign-in');
                });
            } catch {
                res.status(500).send();
            }


            // User.create(req.body, function(err, user){
            //     if(err){ req.flash('error', err); return }

            //     req.flash('success', 'You have signed up, login to continue!');
            //     return res.redirect('/users/sign-in');
            // });
           
        }else{
           // req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }
    });

}


//Sign In and create a session for the user
module.exports.createSession = async function(req, res){

    
    req.flash('success', 'Logged In Succesfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();

    req.flash('success', 'You Have Logged Out');
    return res.redirect('/');
}