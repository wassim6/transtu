'use strict';

MetronicApp.factory('LoginService',function($resource, urlService){
    
    
    var service = {};
		
    service.Login=Login;
   
    return service;
    
    function Login(){
        return $resource(urlService+'admin/login');
    }
    

    
    
});
