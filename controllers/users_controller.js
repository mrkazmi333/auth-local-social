const User = require('../models/user');
// const bcrypt = require('bcrypt');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile',{
            title: "User Profile",
            profile_user: user
        });
    });
    
}

module.exports.update = function(req, res){
  
        if(req.user.id == req.params.id && req.body.new_password == req.body.confirm_new_password){
            User.findByIdAndUpdate(req.params.id,{password: req.body.confirm_new_password}, function(err, user){
                if(user.password == req.body.old_password){
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
    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){ req.flash('error', err); return }

                req.flash('success', 'You have signed up, login to continue!');
                return res.redirect('/users/sign-in');
            });
            // try {
            //     const hashedPassword = await bcrypt.hash(req.body.password, 10);
            //     User.create({email: req.body.email, password: req.body.hashedPassword, name: req.body.name  }, function(err, user){
            //         if(err){ req.flash('error', err); return }
    
            //         req.flash('success', 'You have signed up, login to continue!');
            //         return res.redirect('/users/sign-in');
            //     });
            // } catch {
            //     res.status(500).send();
            // }
           
        }else{
           // req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }
    })

}


//Sign In and create a session for the user
module.exports.createSession = function(req, res){

    req.flash('success', 'Logged In Succesfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();

    req.flash('success', 'You Have Logged Out');
    return res.redirect('/');
}